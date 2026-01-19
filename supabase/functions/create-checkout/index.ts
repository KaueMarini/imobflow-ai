import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// SEUS IDS DO MODO DE TESTE (Certifique-se que estão corretos)
const PLAN_PRICES = {
  start: "price_1SrBrVFZLHvlHqJMQz7zHvh0", 
  pro: "price_1SrBrhFZLHvlHqJM8Ix286c3",
  elite: "price_1SrBrtFZLHvlHqJMc5H277hh", 
};

const IMPLEMENTATION_FEE_PRICE = "price_1SrBr1FZLHvlHqJMqYz3Rrv0"; 

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Chave do Stripe não configurada.");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Usuário não autenticado.");

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user || !user.email) throw new Error("Sessão inválida.");

    const { planId, includeImplementationFee = true } = await req.json();
    console.log(`[Checkout] User: ${user.email} | Plano: ${planId} | Taxa: ${includeImplementationFee}`);

    const priceId = PLAN_PRICES[planId as keyof typeof PLAN_PRICES];
    if (!priceId) throw new Error(`Plano não encontrado: ${planId}`);

    // Busca ou cria cliente
    let customerId;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id }
      });
      customerId = newCustomer.id;
    }

    const lineItems = [];
    
    // Configuração dos dados da assinatura
    const subscriptionData: any = {
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    };

    // LÓGICA MÁGICA AQUI:
    // Se tiver taxa de implementação, adicionamos ela como item avulso
    // E damos 30 dias de trial na assinatura mensal.
    if (includeImplementationFee) {
      // 1. Adiciona a taxa (será cobrada HOJE)
      lineItems.push({
        price: IMPLEMENTATION_FEE_PRICE,
        quantity: 1,
      });

      // 2. Define que a mensalidade só começa daqui a 30 dias
      subscriptionData.trial_period_days = 30;
    }

    // Adiciona o Plano Mensal (será cobrado R$ 0 hoje se tiver trial, ou valor cheio se não tiver)
    lineItems.push({
      price: priceId,
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?payment=success`,
      cancel_url: `${req.headers.get("origin")}/upgrade?payment=canceled`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
      subscription_data: subscriptionData, // Passamos a config com o trial aqui
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Erro no Checkout:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});