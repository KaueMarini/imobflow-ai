import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature || !endpointSecret) {
    return new Response("Webhook signature missing", { status: 400 });
  }

  let event;
  try {
    const body = await req.text();
    // Usa Async para evitar erro de ambiente Deno
    event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
  } catch (err) {
    console.error(`❌ Erro de assinatura: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // LOG para debug
  console.log(`🔔 Evento recebido: ${event.type}`);

  try {
    // CASO 1: Compra realizada com sucesso (Checkout)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const planId = session.metadata?.plan_id;

      if (userId && planId) {
        await atualizarStatusUsuario(supabaseAdmin, userId, planId, "ativo");
      }
    }

    // CASO 2: Assinatura alterada (Cancelou, Cartão falhou, Voltou a pagar)
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata?.user_id;
      const planId = subscription.metadata?.plan_id;
      
      // Mapeamento de status do Stripe para o nosso sistema
      // Stripe: active, trialing, past_due, unpaid, canceled, incomplete
      const statusStripe = subscription.status;
      let novoStatus = "inativo";

      if (statusStripe === "active" || statusStripe === "trialing") {
        novoStatus = "ativo";
      } else if (statusStripe === "past_due" || statusStripe === "unpaid") {
        novoStatus = "inadimplente"; // Cartão falhou
      } else if (statusStripe === "canceled") {
        novoStatus = "cancelado";
      }

      console.log(`🔄 Assinatura mudou: ${statusStripe} -> ${novoStatus} | User: ${userId}`);

      if (userId) {
        // Se não tiver planId no metadata da assinatura, mantemos o atual ou buscamos do banco
        // Mas geralmente o metadata persiste se foi criado pelo checkout
        await atualizarStatusUsuario(supabaseAdmin, userId, planId, novoStatus);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error(`❌ Erro no processamento: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

// Função auxiliar para não repetir código
async function atualizarStatusUsuario(supabase: any, userId: string, planId: string | undefined, status: string) {
  // Monta objeto de atualização
  const updateData: any = { 
    status_pagamento: status,
    updated_at: new Date().toISOString()
  };
  
  // Só atualiza o plano se ele vier preenchido (no cancelamento as vezes não vem, aí mantém o antigo)
  if (planId) {
    updateData.plano = planId;
  }

  const { error } = await supabase
    .from("clientes_saas")
    .upsert({ 
      user_id: userId,
      ...updateData
    }, { onConflict: 'user_id' });

  if (error) {
    console.error("❌ Erro ao atualizar banco:", error);
    throw error;
  } else {
    console.log(`✅ Banco atualizado! User: ${userId} | Status: ${status}`);
  }
}