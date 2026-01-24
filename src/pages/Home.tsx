import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bot, 
  Settings, 
  Search, 
  PlayCircle, 
  ArrowRight, 
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const { clienteSaas } = useAuth();
  const navigate = useNavigate();
  const [evolutionStatus, setEvolutionStatus] = useState<string | null>(null);
  const { user } = useAuth();

  // Pega o nome do usuário
  const firstName = clienteSaas?.nome_empresa?.split(" ")[0] || "Parceiro";

  // Busca o evolution_status do banco
  useEffect(() => {
    async function fetchEvolutionStatus() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('clientes_saas' as any)
          .select('evolution_status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!error && data) {
          setEvolutionStatus((data as any).evolution_status);
        }
      } catch (err) {
        console.error("Erro ao buscar evolution_status:", err);
      }
    }
    fetchEvolutionStatus();
  }, [user]);

  // Calcula progresso real baseado nos dados
  const isRoboAtivo = evolutionStatus === "conectado";
  const isFontesConfiguradas = clienteSaas?.fontes_preferenciais && clienteSaas.fontes_preferenciais.length > 0;
  
  // Progresso: Conta criada (33%) + Fontes (33%) + Robô (34%)
  const setupProgress = 33 + (isFontesConfiguradas ? 33 : 0) + (isRoboAtivo ? 34 : 0);

  return (
    <div className="min-h-screen bg-background">

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden">

        {/* Background Effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            <div className="flex-1 space-y-6 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Sistema Operacional v2.0</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Olá, <span className="text-primary">{firstName}</span>! 👋
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Bem-vindo ao <strong className="text-foreground">FlyImob</strong>. 
                Seu copiloto de vendas está pronto. Vamos configurar suas ferramentas 
                para começar a captar leads automaticamente?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => navigate("/fontes")} 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 shadow-lg shadow-primary/20"
                >
                  Começar Configuração <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/academia")}
                >
                  <PlayCircle className="mr-2 h-5 w-5" /> Ver Tutorial
                </Button>
              </div>

            </div>

            {/* Card de Progresso Flutuante */}
            <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Setup Inicial</CardTitle>
                  <span className="text-2xl font-bold text-primary">{setupProgress}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={setupProgress} className="h-2" />
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-foreground">Conta criada</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {isFontesConfiguradas ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={isFontesConfiguradas ? "text-foreground" : "text-muted-foreground"}>Configurar Fontes</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {isRoboAtivo ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                    <span className={isRoboAtivo ? "text-foreground" : "text-muted-foreground"}>Ativar Robô</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* --- GRID DE AÇÕES RÁPIDAS --- */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            Passos para o Sucesso
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Fontes */}
          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate("/fontes")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <CardTitle>1. Defina suas Fontes</CardTitle>
              <CardDescription>
                Escolha onde o robô deve buscar imóveis (OLX, Imovelweb, etc).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                Configurar agora <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Robô */}
          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate("/robo")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <CardTitle>2. Ative a Inteligência</CardTitle>
              <CardDescription>
                Configure os horários e critérios para a IA qualificar os leads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                Acessar Robô <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Dashboard */}
          <Card 
            className="group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate("/dashboard")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <CardTitle>3. Acompanhe Resultados</CardTitle>
              <CardDescription>
                Veja os leads chegando e a performance em tempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
                Ir para Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
}
