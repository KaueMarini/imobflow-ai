import { Check } from "lucide-react";
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
      id: "starter",
      name: "Starter",
      price: "R$ 97",
      description: "Perfeito para quem está começando a organizar seus processos.",
      features: ["Até 50 Leads/mês", "Gestão Básica de Imóveis", "1 Usuário", "Suporte por Email"],
      buttonText: "Começar Agora",
      popular: false,
    },
    {
      id: "professional",
      name: "Pro",
      price: "R$ 197",
      description: "Para imobiliárias que buscam escala e automação.",
      features: ["Leads Ilimitados", "Integração com Portais", "Até 5 Usuários", "Automação de WhatsApp", "Suporte Prioritário"],
      buttonText: "Assinar Pro",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "R$ 497",
      description: "Soluções customizadas para grandes operações.",
      features: ["Tudo do Pro", "API Dedicada", "Usuários Ilimitados", "Gerente de Conta", "Treinamento da Equipe"],
      buttonText: "Falar com Vendas",
      popular: false,
    },
  ];

  const handleSolicitarPlano = (planId: string, planName: string) => {
    if (planId === planoAtual) {
      toast.info("Você já está neste plano!");
      return;
    }
    // Aqui você pode integrar com Stripe ou outro gateway de pagamento
    toast.success(`Solicitação do plano ${planName} enviada! Entraremos em contato.`);
  };

  const getPlanoLabel = (plano: string) => {
    switch (plano) {
      case "free": return "Gratuito";
      case "starter": return "Starter";
      case "professional": return "Pro";
      case "enterprise": return "Enterprise";
      default: return "Gratuito";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Escolha o plano ideal para o seu crescimento
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Desbloqueie todo o potencial do ImobFlow AI e leve sua gestão para o próximo nível.
        </p>
        
        {/* Plano atual */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-muted-foreground">Seu plano atual:</span>
          <Badge variant="secondary" className="text-sm">
            {getPlanoLabel(planoAtual)}
          </Badge>
          {clienteSaas?.status_pagamento && (
            <Badge variant={clienteSaas.status_pagamento === "ativo" ? "default" : "destructive"}>
              {clienteSaas.status_pagamento === "ativo" ? "Ativo" : "Pendente"}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === planoAtual;
          
          return (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${
                plan.popular 
                  ? "border-primary shadow-lg scale-105 z-10" 
                  : "border-border hover:border-primary/50 transition-colors"
              } ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Mais Popular
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute -top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Plano Atual
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isCurrentPlan ? "secondary" : (plan.popular ? "default" : "outline")}
                  size="lg"
                  disabled={isCurrentPlan}
                  onClick={() => handleSolicitarPlano(plan.id, plan.name)}
                >
                  {isCurrentPlan ? "Plano Atual" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      <p className="mt-8 text-sm text-muted-foreground">
        Dúvidas sobre os planos? Entre em contato com nosso suporte.
      </p>
    </div>
  );
}