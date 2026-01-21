import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  LayoutDashboard, 
  Users, 
  Scale, 
  ArrowRight, 
  CheckCircle2,
  TrendingUp,
  Bot
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Welcome() {
  const navigate = useNavigate();
  const { user, clienteSaas } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Efeito de montagem para animação
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // Pega o primeiro nome ou usa "Parceiro"
  const nomeUsuario = user?.user_metadata?.nome_empresa || clienteSaas?.nome_empresa || "Corretor";
  const primeiroNome = nomeUsuario.split(' ')[0];

  const features = [
    {
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      title: "Inteligência de Mercado",
      desc: "Avalie imóveis com precisão usando nossa IA e dados em tempo real."
    },
    {
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      title: "CRM Integrado",
      desc: "Gerencie leads e funis de venda em um único lugar organizado."
    },
    {
      icon: Scale,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
      title: "Clube Jurídico",
      desc: "Acesso exclusivo a descontos com advogados e cartórios parceiros."
    },
    {
      icon: Bot,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      title: "Automação 24/7",
      desc: "Seus robôs trabalhando enquanto você foca em fechar negócios."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* Background Decorativo (Blobs) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Conteúdo Principal */}
      <div className={`max-w-5xl w-full z-10 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header de Boas Vindas */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4 animate-pulse">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Acesso Liberado</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
            Bem-vindo ao futuro. <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Seu ambiente <strong>FlyImob</strong> está configurado e pronto. 
            Preparamos um ecossistema completo para acelerar suas vendas.
          </p>
        </div>

        {/* Grid de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              className={`border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md p-6 hover:-translate-y-2 transition-all duration-300 group cursor-default
                ${mounted ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Botão de Ação Principal */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Button 
            size="lg" 
            onClick={handleGoToDashboard}
            className="h-16 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              <LayoutDashboard className="h-5 w-5" />
              Acessar Meu Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Efeito de brilho passando no botão */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </Button>
          
          <p className="text-xs text-slate-400 font-medium">
            Configure seu perfil completo nas configurações
          </p>
        </div>

      </div>
    </div>
  );
}