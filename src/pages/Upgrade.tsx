import { useState } from "react";
import { Check, Zap, Crown, Rocket, Building2, Shield, Sparkles, Loader2, CreditCard, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Upgrade() {
  const { clienteSaas } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const isPlanoAtivo = clienteSaas?.status_pagamento === "ativo" || clienteSaas?.status_pagamento === "trialing";
  const planoAtual = isPlanoAtivo ? (clienteSaas?.plano || "free") : "free";
  const jaPagouTaxa = clienteSaas?.plano && clienteSaas.plano !== "free";

  const plans = [
    {
      id: "start",
      name: "Start",
      price: "294",
      description: "Perfeito para corretores autônomos",
      features: ["100 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Dashboard de Controle", "Suporte por Email"],
      buttonText: "Começar Agora",
      popular: false,
      icon: Zap,
      accentColor: "from-cyan-500 to-blue-600",
      bgGlow: "bg-cyan-500/20",
    },
    {
      id: "pro",
      name: "Pro",
      price: "500",
      description: "Para high performers ambiciosos",
      features: ["250 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Prioridade VIP", "Suporte Prioritário"],
      buttonText: "Assinar Pro",
      popular: true,
      icon: Crown,
      accentColor: "from-primary via-purple-500 to-pink-500",
      bgGlow: "bg-primary/30",
    },
    {
      id: "elite",
      name: "Elite",
      price: "800",
      description: "Ideal para pequenas equipes",
      features: ["500 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Multi-usuários", "Gerente de Conta"],
      buttonText: "Assinar Elite",
      popular: false,
      icon: Rocket,
      accentColor: "from-orange-500 to-amber-500",
      bgGlow: "bg-orange-500/20",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Consulte",
      description: "Soluções para grandes operações",
      features: ["Leads Ilimitados", "IA Personalizada", "API Dedicada", "Treinamento Equipe", "Suporte VIP 24/7"],
      buttonText: "Falar com Vendas",
      popular: false,
      icon: Building2,
      accentColor: "from-slate-400 to-zinc-500",
      bgGlow: "bg-slate-500/20",
    },
  ];

  const handleSolicitarPlano = async (planId: string, planName: string) => {
    if (planId === planoAtual && isPlanoAtivo) {
      toast.info("Você já está neste plano!");
      return;
    }

    if (planId === "enterprise") {
      toast.success("Solicitação do plano Enterprise enviada! Entraremos em contato.");
      return;
    }

    setLoadingPlan(planId);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId,
          includeImplementationFee: !jaPagouTaxa
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não encontrada");
      }
    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      toast.error(error.message || "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Erro ao abrir portal:", error);
      toast.error("Erro ao abrir portal de assinatura.");
    }
  };

  const getPlanoLabel = (plano: string) => {
    const labels: Record<string, string> = {
      free: "Gratuito", start: "Start", pro: "Pro", elite: "Elite", enterprise: "Enterprise"
    };
    return labels[plano] || "Gratuito";
  };

  const getStatusBadge = (status: string | null | undefined) => {
    if (!status) return null;
    if (status === 'ativo' || status === 'trialing') 
      return <Badge className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">✓ Ativo</Badge>;
    if (status === 'cancelado') 
      return <Badge variant="destructive" className="px-3 py-1 bg-red-500/20 text-red-400 border-red-500/30">✕ Cancelado</Badge>;
    if (status === 'inadimplente') 
      return <Badge variant="destructive" className="px-3 py-1 bg-amber-500/20 text-amber-400 border-amber-500/30">! Pendente</Badge>;
    return <Badge variant="secondary" className="px-3 py-1">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center py-16 px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-6 animate-fade-in max-w-3xl">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Potencialize seus resultados
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            <span className="text-foreground">Escolha o plano</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              perfeito para você
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Desbloqueie o poder do <strong className="text-foreground">Inventário Infinito</strong> e transforme cada lead em oportunidade.
          </p>
          
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 border border-border backdrop-blur-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Plano atual:</span>
              <Badge variant="secondary" className="font-semibold">
                {getPlanoLabel(clienteSaas?.plano || 'free')}
              </Badge>
              {getStatusBadge(clienteSaas?.status_pagamento)}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl w-full mb-20">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === planoAtual && isPlanoAtivo;
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.name}
                className={`group relative flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in bg-card/80 backdrop-blur-sm ${
                  plan.popular 
                    ? "border-2 border-primary/50 shadow-xl shadow-primary/20 xl:scale-105 z-10" 
                    : "border-border/50 hover:border-primary/30"
                } ${isCurrentPlan ? "ring-2 ring-primary ring-offset-4 ring-offset-background" : ""}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 ${plan.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`} />
                
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-px left-0 right-0">
                    <div className={`bg-gradient-to-r ${plan.accentColor} text-white text-center py-2.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2`}>
                      <Star className="h-4 w-4 fill-current" />
                      Mais Popular
                    </div>
                  </div>
                )}
                
                {isCurrentPlan && !plan.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs font-semibold">
                      Seu Plano
                    </Badge>
                  </div>
                )}

                <CardHeader className={`relative space-y-4 ${plan.popular ? "pt-14" : "pt-6"}`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.accentColor} p-0.5 shadow-lg`}>
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl font-bold mb-1">{plan.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{plan.description}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="relative flex-1 pt-2">
                  {/* Price */}
                  <div className="mb-8">
                    {plan.price !== "Consulte" ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-muted-foreground">R$</span>
                        <span className={`text-5xl font-bold bg-gradient-to-r ${plan.accentColor} bg-clip-text text-transparent`}>
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm">/mês</span>
                      </div>
                    ) : (
                      <span className={`text-3xl font-bold bg-gradient-to-r ${plan.accentColor} bg-clip-text text-transparent`}>
                        Sob Consulta
                      </span>
                    )}
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`h-5 w-5 rounded-full bg-gradient-to-br ${plan.accentColor} flex items-center justify-center flex-shrink-0`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="relative pt-6 pb-6">
                  <Button 
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 group/btn ${
                      plan.popular && !isCurrentPlan
                        ? `bg-gradient-to-r ${plan.accentColor} hover:opacity-90 shadow-lg shadow-primary/30 text-white`
                        : isCurrentPlan 
                          ? "bg-muted text-muted-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                    }`}
                    variant={isCurrentPlan ? "secondary" : (plan.popular ? "default" : "secondary")}
                    size="lg"
                    disabled={isCurrentPlan || loadingPlan === plan.id}
                    onClick={() => handleSolicitarPlano(plan.id, plan.name)}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {isCurrentPlan ? "✓ Plano Atual" : plan.buttonText}
                        {!isCurrentPlan && <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* FAQ Section */}
        <div className="w-full max-w-3xl animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Tire suas dúvidas sobre os planos FlyImob
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
                O que são "Leads Únicos"?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                Leads únicos são contatos individuais que interagem com a IA pelo WhatsApp. Cada número de telefone conta como um lead único, independente de quantas mensagens trocar.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
                O que é a taxa de implementação?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                É uma taxa única de R$ 1.000 para configurar sua conta, treinar a IA com seu portfólio e fazer as integrações necessárias. É cobrada apenas uma vez.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
                Posso mudar de plano depois?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A diferença será calculada proporcionalmente.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-border/50 rounded-2xl px-6 bg-card/50 backdrop-blur-sm data-[state=open]:bg-card">
              <AccordionTrigger className="text-left hover:no-underline py-5 text-base font-medium">
                E se eu ultrapassar o limite de leads?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                Entraremos em contato para fazer upgrade do seu plano. Não se preocupe, seus leads nunca serão perdidos.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Manage Subscription Button */}
        {isPlanoAtivo && (
          <div className="mt-12 animate-fade-in" style={{ animationDelay: "450ms" }}>
            <Button 
              variant="outline" 
              onClick={handleManageSubscription} 
              className="gap-2 h-12 px-6 text-base border-border/50 hover:bg-muted/50"
            >
              <CreditCard className="h-5 w-5" />
              Gerenciar Assinatura
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center space-y-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          {!jaPagouTaxa ? (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">
                Taxa de implementação única:
              </span>
              <span className="text-lg font-bold text-foreground">R$ 1.000</span>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">Setup único</Badge>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm text-emerald-400 font-medium">
                Taxa de implementação já paga!
              </span>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            Dúvidas? <a href="#" className="text-primary hover:underline font-medium transition-colors">Fale conosco</a>
          </p>
        </div>
      </div>
    </div>
  );
}
