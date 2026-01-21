import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Zap, 
  GraduationCap,
  Target,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "CRM Inteligente",
    description: "Gerencie seus leads com IA que nunca esquece um follow-up",
    route: "/crm",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Building2,
    title: "Carteira de Imóveis",
    description: "Seu inventário infinito de imóveis sempre atualizado",
    route: "/imoveis",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Zap,
    title: "Captação Automática",
    description: "Leads chegando 24h por dia, mesmo enquanto você dorme",
    route: "/captacao",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: GraduationCap,
    title: "Academia Fly",
    description: "Aprenda a dominar o mercado com nossos treinamentos",
    route: "/academia",
    color: "from-purple-500 to-pink-500"
  }
];

export function WelcomeSection() {
  const { clienteSaas } = useAuth();
  const navigate = useNavigate();
  
  const firstName = clienteSaas?.nome_empresa?.split(' ')[0] || 'Corretor';

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative space-y-8">
        {/* Hero Welcome */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Bem-vindo ao FlyImob</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Olá, <span className="text-primary">{firstName}</span>! 👋
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Seu copiloto digital para fechar mais negócios. Explore as ferramentas abaixo e transforme leads em vendas.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="font-semibold text-primary">Sistema Ativo</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, idx) => (
            <Card 
              key={idx}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
              onClick={() => navigate(feature.route)}
            >
              <CardContent className="p-5 space-y-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Acessar
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats Bar */}
        <Card className="bg-gradient-to-r from-card via-card to-primary/5 border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próximo passo sugerido</p>
                  <p className="font-medium">Configure suas fontes de captação para começar a receber leads</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="shrink-0"
                onClick={() => navigate('/fontes')}
              >
                Configurar Fontes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
