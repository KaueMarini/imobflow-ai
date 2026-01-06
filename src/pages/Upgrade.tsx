import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Upgrade() {
  const plans = [
    {
      name: "Starter",
      price: "R$ 97",
      description: "Perfeito para quem está começando a organizar seus processos.",
      features: ["Até 50 Leads/mês", "Gestão Básica de Imóveis", "1 Usuário", "Suporte por Email"],
      buttonText: "Começar Agora",
      popular: false,
    },
    {
      name: "Pro",
      price: "R$ 197",
      description: "Para imobiliárias que buscam escala e automação.",
      features: ["Leads Ilimitados", "Integração com Portais", "Até 5 Usuários", "Automação de WhatsApp", "Suporte Prioritário"],
      buttonText: "Assinar Pro",
      popular: true, // Destaque visual
    },
    {
      name: "Enterprise",
      price: "R$ 497",
      description: "Soluções customizadas para grandes operações.",
      features: ["Tudo do Pro", "API Dedicada", "Usuários Ilimitados", "Gerente de Conta", "Treinamento da Equipe"],
      buttonText: "Falar com Vendas",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Escolha o plano ideal para o seu crescimento
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Desbloqueie todo o potencial do ImobFlow AI e leve sua gestão para o próximo nível.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative flex flex-col ${
              plan.popular 
                ? "border-primary shadow-lg scale-105 z-10" 
                : "border-gray-200 hover:border-primary/50 transition-colors"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Mais Popular
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
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <p className="mt-8 text-sm text-gray-500">
        Dúvidas sobre os planos? Entre em contato com nosso suporte.
      </p>
    </div>
  );
}