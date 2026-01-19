import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowRight,
  Bot,
  Shield,
  LayoutDashboard,
  ChevronDown,
  MessageCircle,
  Settings,
  Lock,
  Eye,
  EyeOff,
  Handshake,
  Brain,
  Zap,
  Mic,
  Pause
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1e3a5f] tracking-tight">FlyImob</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection("problema")} 
              className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors duration-300"
            >
              O Problema
            </button>
            <button 
              onClick={() => scrollToSection("produto")} 
              className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors duration-300"
            >
              A Solução
            </button>
            <button 
              onClick={() => scrollToSection("precos")} 
              className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors duration-300"
            >
              Planos
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-[#1e3a5f]" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#152c4a] text-white rounded-full px-6" asChild>
              <Link to="/auth">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroBuilding})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/95 via-[#1e3a5f]/85 to-[#1e3a5f]/95" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto max-w-5xl text-center relative z-10 px-6 pt-20">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-8 px-6 py-2.5 border-red-400/40 text-red-300 font-medium rounded-full bg-red-500/10 backdrop-blur-md text-sm">
              ⚠️ A lentidão custa dinheiro. O mercado não perdoa.
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight animate-slide-up">
            Quem não controla o lead,
            <br />
            <span className="bg-gradient-to-r from-white/60 via-white/40 to-white/60 bg-clip-text text-transparent">perde a comissão.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
            O FlyImob entrega o <span className="text-white font-semibold">Inventário Infinito</span>:
            <br />
            <span className="text-white font-bold">40.000 imóveis</span> na palma da sua mão — sem perder o cliente para portais ou concorrentes.
          </p>

          {/* Motivational phrase with icon */}
          <div className="flex items-center justify-center gap-2 mb-8 animate-slide-up" style={{ animationDelay: "120ms" }}>
            <Zap className="h-4 w-4 text-emerald-400" />
            <p className="text-base text-emerald-300 font-medium">
              Este sistema é a tecnologia que faltava para você se destacar.
            </p>
          </div>

          <p className="text-base text-white/50 mb-10 animate-slide-up" style={{ animationDelay: "150ms" }}>
            Não vendemos bot. Vendemos <span className="text-white font-medium">blindagem de lead</span> e <span className="text-white font-medium">retenção de comissão</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="h-16 px-12 text-lg bg-gradient-to-r from-white to-slate-100 text-[#1e3a5f] hover:from-slate-100 hover:to-white rounded-full font-bold shadow-2xl shadow-white/20 transition-all duration-300 hover:scale-105" asChild>
              <Link to="/auth">
                <Shield className="mr-3 h-6 w-6" />
                Blindar Meus Leads
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-16 px-10 text-lg text-white/80 hover:text-white hover:bg-white/10 rounded-full border border-white/20 backdrop-blur-sm" asChild>
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>

          {/* Stats with better styling */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
              <div className="text-4xl font-bold text-white mb-1">40k+</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">imóveis mapeados</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
              <div className="text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">IA atendendo</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
              <div className="text-4xl font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">leads blindados</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20">
              <div className="text-4xl font-bold text-white mb-1">50/50</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">parceria garantida</div>
            </div>
          </div>

          <button 
            onClick={() => scrollToSection("problema")}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors duration-300"
          >
            <ChevronDown className="h-8 w-8 animate-bounce" />
          </button>
        </div>
      </section>

      {/* O PROBLEMA */}
      <section id="problema" className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              O Problema
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6 leading-tight">
              O corretor trabalha muito.
              <br />
              <span className="text-slate-400">E vende pouco.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Sua concorrência já está avançando. E você?
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <p className="text-xl text-slate-600 leading-relaxed">
              Você passa o dia respondendo curiosos.
            </p>
            <p className="text-xl text-slate-600 leading-relaxed">
              E quando o cliente pede algo específico…
            </p>
            <div className="p-10 rounded-3xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 shadow-lg shadow-red-100/50">
              <p className="text-2xl md:text-3xl font-bold text-red-600 text-center">
                "Não tenho esse imóvel."
              </p>
              <p className="text-sm text-red-500/70 text-center mt-4">
                Essa frase custa milhares em comissão perdida.
              </p>
            </div>
            <div className="text-center space-y-3">
              <p className="text-xl text-slate-600 leading-relaxed">
                Essa frase encerra a conversa.
                <br />
                O cliente vai para o portal.
              </p>
              <p className="text-2xl text-[#1e3a5f] font-bold">
                E sua comissão morre ali.
              </p>
              <p className="text-sm text-slate-400 mt-4">
                Não perca mais negócios por falta de ferramentas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* A SOLUÇÃO */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-slide-up">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-4">A Solução</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-8 leading-tight">
              Um cérebro digital que
              <br />
              <span className="text-[#1e3a5f]">nunca diz "não tenho".</span>
            </h2>
          </div>

          <p className="text-xl text-slate-500 mb-16 animate-slide-up" style={{ animationDelay: "100ms" }}>
            O FlyImob dá ao corretor o poder de:
          </p>

          <div className="grid md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <Zap className="h-10 w-10 text-[#1e3a5f] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Atender instantaneamente</h3>
              <p className="text-slate-500 text-sm">Resposta em segundos, não horas</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <Building2 className="h-10 w-10 text-[#1e3a5f] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Ter milhares de imóveis</h3>
              <p className="text-slate-500 text-sm">40.000 opções na palma da mão</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
              <Lock className="h-10 w-10 text-[#1e3a5f] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Manter o cliente sob controle</h3>
              <p className="text-slate-500 text-sm">Sem entregar o lead para ninguém</p>
            </div>
          </div>
        </div>
      </section>

      {/* O PRODUTO - A TRÍADE DE PODER */}
      <section id="produto" className="py-32 px-6 bg-[#1e3a5f]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20 animate-slide-up">
            <div className="text-sm text-white/40 uppercase tracking-widest mb-4">O Produto</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              A Tríade de Poder FlyImob
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Motor de IA */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm animate-slide-up">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Motor de IA</div>
              <h3 className="text-2xl font-bold text-white mb-4">O Concierge</h3>
              <div className="space-y-4 text-white/70">
                <p className="text-sm">
                  IA semântica que entende <span className="text-white">intenção</span>, não palavras.
                </p>
                <p className="text-sm italic text-white/50">
                  "Quero algo perto da balsa, com sol da manhã."
                </p>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-white/60" />
                    <span className="text-sm">Respostas instantâneas no WhatsApp, 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mic className="h-4 w-4 text-white/60" />
                    <span className="text-sm">Tom configurável: formal, descontraído ou agressivo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventário Infinito */}
            <div className="p-8 rounded-3xl bg-white border border-white/20 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="h-14 w-14 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mb-6">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="text-xs uppercase tracking-widest text-[#1e3a5f]/60 mb-2">Principal</div>
              <h3 className="text-2xl font-bold text-[#1e3a5f] mb-6">Inventário Infinito</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#1e3a5f]/5 border border-[#1e3a5f]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-[#1e3a5f]" />
                    <span className="font-semibold text-sm text-[#1e3a5f]">VIP</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Imóveis seus ou de parceiros diretos.
                    <br />
                    <span className="text-[#1e3a5f]">Fotos, links e CTA direto.</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <EyeOff className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-sm text-slate-600">Background</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    40.000 imóveis varridos da região.
                    <br />
                    <span className="text-slate-600">Apenas descrição, sem link do concorrente.</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-sm text-green-600">O Pulo do Gato</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cliente se interessa → Você recebe a fonte → <span className="text-green-600 font-medium">Fifty 50/50</span> → Comissão protegida
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <LayoutDashboard className="h-7 w-7 text-white" />
              </div>
              <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Dashboard</div>
              <h3 className="text-2xl font-bold text-white mb-4">O Leme</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mic className="h-4 w-4 text-white/60 mt-1" />
                  <span className="text-sm text-white/70">Tom de voz configurável</span>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="h-4 w-4 text-white/60 mt-1" />
                  <span className="text-sm text-white/70">Definição de VIP e Background</span>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-4 w-4 text-white/60 mt-1" />
                  <span className="text-sm text-white/70">Monitoramento em tempo real</span>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 mt-4">
                  <div className="flex items-center gap-3">
                    <Pause className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-300 font-medium">Botão de pânico: assuma a conversa quando quiser</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O DIFERENCIAL - BLINDAGEM */}
      <section className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-slide-up">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-4">O Diferencial</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Blindagem de Lead = <span className="text-green-600">Retenção de Comissão</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-[#1e3a5f] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">1</div>
              <p className="text-sm text-slate-600">Cliente pede um imóvel específico</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-[#1e3a5f] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">2</div>
              <p className="text-sm text-slate-600">IA encontra no Background</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-[#1e3a5f] text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">3</div>
              <p className="text-sm text-slate-600">Cliente se interessa</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-green-50 border border-green-200">
              <div className="h-12 w-12 rounded-full bg-green-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">4</div>
              <p className="text-sm text-green-700 font-medium">Você entra e fecha</p>
            </div>
          </div>

          <div className="text-center p-8 rounded-3xl bg-[#1e3a5f] animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Lock className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">O cliente nunca pula você.</h3>
            <p className="text-white/60 text-lg">
              "Não vendemos bot.
              <br />
              <span className="text-white font-medium">Vendemos proteção da sua comissão."</span>
            </p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-slide-up">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-4">Como Funciona</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Em 3 passos seus leads estão blindados
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="text-center">
              <div className="h-20 w-20 rounded-3xl bg-[#1e3a5f] flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">1</div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">Conecte seu WhatsApp</h3>
              <p className="text-slate-500">Integração simples em poucos cliques</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-3xl bg-[#1e3a5f] flex items-center justify-center mx-auto mb-6">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">2</div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">Configure prioridades</h3>
              <p className="text-slate-500">Defina VIPs e tom de voz</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-3xl bg-green-600 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-[#1e3a5f] mb-2">3</div>
              <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">A IA atende. Você fecha.</h3>
              <p className="text-slate-500">Leads blindados 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="precos" className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-20 animate-slide-up">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-4">Investimento</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              Modelo SaaS baseado em leads únicos
            </h2>
            <p className="text-lg text-slate-500">
              Escala, previsibilidade e margem protegida
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            {[
              { name: "Start", price: "294", leads: "100", label: "Autônomos" },
              { name: "Pro", price: "500", leads: "250", label: "High Performers", featured: true },
              { name: "Elite", price: "800", leads: "500", label: "Pequenas Equipes" },
              { name: "Enterprise", price: null, leads: "∞", label: "Imobiliárias" }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`p-8 rounded-3xl transition-all duration-500 ${
                  plan.featured 
                    ? "bg-[#1e3a5f] text-white scale-[1.02]" 
                    : "bg-slate-50 border border-slate-100"
                }`}
              >
                {plan.featured && (
                  <div className="text-xs uppercase tracking-widest text-white/60 mb-4">Recomendado</div>
                )}
                <div className={`text-sm mb-2 ${plan.featured ? "text-white/60" : "text-slate-400"}`}>
                  {plan.label}
                </div>
                <div className={`text-2xl font-bold mb-6 ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                  {plan.name}
                </div>
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <span className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                        R$ {plan.price}
                      </span>
                      <span className={plan.featured ? "text-white/60" : "text-slate-400"}>/mês</span>
                    </>
                  ) : (
                    <span className={`text-xl font-semibold ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                      Sob Consulta
                    </span>
                  )}
                </div>
                <div className={`text-sm mb-8 ${plan.featured ? "text-white/70" : "text-slate-500"}`}>
                  <span className={`font-semibold ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                    {plan.leads}
                  </span> leads únicos/mês
                </div>
                <Button 
                  className={`w-full rounded-full h-12 ${
                    plan.featured 
                      ? "bg-white text-[#1e3a5f] hover:bg-white/90" 
                      : "bg-[#1e3a5f] text-white hover:bg-[#152c4a]"
                  }`}
                  asChild
                >
                  <Link to="/auth">{plan.price ? "Começar" : "Falar com Consultor"}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 space-y-2 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <p className="text-sm text-slate-400">
              Todos os planos incluem taxa única de implementação de R$ 1.000
            </p>
            <p className="text-lg text-[#1e3a5f] font-medium">
              💡 Uma venda paga o sistema por meses.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#0a1929] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-emerald-300 text-sm font-medium mb-8 animate-slide-up">
            <Zap className="w-4 h-4" />
            O avanço da tecnologia é um caminho sem volta
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up">
            Pronto para parar de
            <br />
            <span className="bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent">perder comissão?</span>
          </h2>
          
          <p className="text-lg text-white/60 mb-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
            O Inventário Infinito já está mudando o jogo na Baixada Santista.
          </p>
          
          <p className="text-xl text-emerald-300 font-semibold mb-12 animate-slide-up" style={{ animationDelay: "150ms" }}>
            Seja pioneiro, não ultrapassado.
          </p>
          
          <Button size="lg" className="h-16 px-14 text-lg bg-gradient-to-r from-white to-slate-100 text-[#1e3a5f] hover:from-slate-100 hover:to-white rounded-full font-bold shadow-2xl shadow-white/20 transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: "200ms" }} asChild>
            <Link to="/auth">
              Começar Agora
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </Button>
          
          <p className="text-sm text-white/40 mt-8 animate-slide-up" style={{ animationDelay: "250ms" }}>
            Quem não inova, fica obsoleto.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#1e3a5f]">FlyImob</span>
          </div>
          <p className="text-slate-500 mb-2">A revolução da inteligência imobiliária.</p>
          <p className="text-[#1e3a5f] font-medium">
            Inventário Infinito. Leads Blindados. Comissão protegida.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-slate-400">
            <button onClick={() => scrollToSection("problema")} className="hover:text-[#1e3a5f] transition-colors">
              O Problema
            </button>
            <button onClick={() => scrollToSection("produto")} className="hover:text-[#1e3a5f] transition-colors">
              A Solução
            </button>
            <button onClick={() => scrollToSection("precos")} className="hover:text-[#1e3a5f] transition-colors">
              Planos
            </button>
            <Link to="/auth" className="hover:text-[#1e3a5f] transition-colors">
              Login
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-8">© 2025 FlyImob. Baixada Santista, SP</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
