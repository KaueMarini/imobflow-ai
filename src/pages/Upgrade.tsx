import { Check, Zap, Crown, Rocket, Building2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Upgrade() {
  const { clienteSaas } = useAuth();
  const planoAtual = clienteSaas?.plano || "free";

  const plans = [
    {
      id: "start",
      name: "Start",
      price: "R$ 250",
      description: "Perfeito para corretores autônomos que querem blindar seus leads.",
      features: ["Até 100 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Dashboard de Controle", "Suporte por Email"],
      buttonText: "Começar Agora",
      popular: false,
      icon: Zap,
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
    },
    {
      id: "pro",
      name: "Pro",
      price: "R$ 500",
      description: "Para high performers que não perdem nenhuma oportunidade.",
      features: ["Até 250 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Prioridade VIP", "Suporte Prioritário"],
      buttonText: "Assinar Pro",
      popular: true,
      icon: Crown,
      gradient: "from-primary/20 to-purple-500/20",
      iconColor: "text-primary",
    },
    {
      id: "elite",
      name: "Elite",
      price: "R$ 800",
      description: "Ideal para pequenas equipes que dominam o mercado.",
      features: ["Até 500 Leads únicos/mês", "IA Concierge 24/7", "Inventário Infinito", "Multi-usuários", "Gerente de Conta"],
      buttonText: "Assinar Elite",
      popular: false,
      icon: Rocket,
      gradient: "from-orange-500/10 to-amber-500/10",
      iconColor: "text-orange-500",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Sob Consulta",
      description: "Soluções personalizadas para grandes imobiliárias.",
      features: ["Leads Ilimitados", "IA Personalizada", "API Dedicada", "Treinamento da Equipe", "Suporte VIP 24/7"],
      buttonText: "Falar com Vendas",
      popular: false,
      icon: Building2,
      gradient: "from-slate-500/10 to-zinc-500/10",
      iconColor: "text-slate-500",
    },
  ];

  const handleSolicitarPlano = (planId: string, planName: string) => {
    if (planId === planoAtual) {
      toast.info("Você já está neste plano!");
      return;
    }
    toast.success(`Solicitação do plano ${planName} enviada! Entraremos em contato.`);
  };

  const getPlanoLabel = (plano: string) => {
    switch (plano) {
      case "free": return "Gratuito";
      case "start": return "Start";
      case "pro": return "Pro";
      case "elite": return "Elite";
      case "enterprise": return "Enterprise";
      default: return "Gratuito";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col items-center py-12 px-4 md:px-8">
      {/* Header Section */}
      <div className="text-center mb-16 space-y-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Potencialize seus resultados</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Escolha o plano ideal para o{" "}
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            seu crescimento
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Desbloqueie todo o potencial do <strong>Inventário Infinito</strong> e nunca mais perca uma venda.
        </p>
        
        {/* Plano atual */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Seu plano atual:</span>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {getPlanoLabel(planoAtual)}
          </Badge>
          {clienteSaas?.status_pagamento && (
            <Badge 
              variant={clienteSaas.status_pagamento === "ativo" ? "default" : "destructive"}
              className="px-3 py-1"
            >
              {clienteSaas.status_pagamento === "ativo" ? "✓ Ativo" : "⚠ Pendente"}
            </Badge>
          )}
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
        {plans.map((plan, index) => {
          const isCurrentPlan = plan.id === planoAtual;
          const IconComponent = plan.icon;
          
          return (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in ${
                plan.popular 
                  ? "border-2 border-primary shadow-lg shadow-primary/20 lg:scale-105 z-10" 
                  : "border-border hover:border-primary/50"
              } ${isCurrentPlan ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`} />
              
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-primary to-purple-500 text-primary-foreground text-center py-2 text-sm font-semibold">
                    ⭐ Mais Popular
                  </div>
                </div>
              )}
              
              {/* Current Plan Badge */}
              {isCurrentPlan && !plan.popular && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="text-xs">
                    Seu Plano
                  </Badge>
                </div>
              )}

              <CardHeader className={`relative ${plan.popular ? "pt-12" : ""}`}>
                <div className={`w-12 h-12 rounded-xl bg-background shadow-sm flex items-center justify-center mb-4 ${plan.iconColor}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="relative flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {plan.price}
                  </span>
                  {plan.price !== "Sob Consulta" && (
                    <span className="text-muted-foreground text-sm">/mês</span>
                  )}
                </div>
                
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter className="relative pt-4">
                <Button 
                  className={`w-full transition-all duration-300 ${
                    plan.popular && !isCurrentPlan
                      ? "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-lg shadow-primary/30"
                      : ""
                  }`}
                  variant={isCurrentPlan ? "secondary" : (plan.popular ? "default" : "outline")}
                  size="lg"
                  disabled={isCurrentPlan}
                  onClick={() => handleSolicitarPlano(plan.id, plan.name)}
                >
                  {isCurrentPlan ? "✓ Plano Atual" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Footer Info */}
      <div className="mt-16 text-center space-y-3 animate-fade-in" style={{ animationDelay: "400ms" }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <span className="text-sm text-muted-foreground">
            Taxa de implementação: <span className="font-bold text-foreground">R$ 1.000,00</span>
          </span>
          <Badge variant="outline" className="text-xs">Setup único</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Dúvidas sobre os planos? <a href="#" className="text-primary hover:underline font-medium">Entre em contato</a> com nosso suporte.
        </p>
        
        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Pagamento seguro
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" /> Ativação imediata
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3" /> Cancele quando quiser
          </span>
        </div>
      </div>
    </div>
  );
}
