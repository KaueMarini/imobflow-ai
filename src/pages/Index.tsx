import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowRight,
  Bot,
  Shield,
  LayoutDashboard,
  Check,
  ChevronDown
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
      {/* Elegant Header */}
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
              onClick={() => scrollToSection("solucao")} 
              className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors duration-300"
            >
              Solução
            </button>
            <button 
              onClick={() => scrollToSection("recursos")} 
              className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors duration-300"
            >
              Recursos
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

      {/* Hero Section with Building Background */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBuilding})` }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/80 via-[#1e3a5f]/70 to-[#1e3a5f]/90" />
        {/* Tech grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="container mx-auto max-w-5xl text-center relative z-10 px-6 pt-20">
          <div className="animate-fade-in">
            <Badge variant="outline" className="mb-10 px-5 py-2 border-white/30 text-white/90 font-normal rounded-full bg-white/10 backdrop-blur-sm">
              Tecnologia premium para o mercado imobiliário
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.05] tracking-tight animate-slide-up">
            Venda mais.
            <br />
            <span className="text-white/60">Trabalhe menos.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-14 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
            Inteligência artificial que atende, qualifica e recomenda imóveis 24 horas por dia.
            <span className="text-white font-medium"> 40.000 imóveis</span> ao seu alcance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="h-14 px-10 text-base bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-medium" asChild>
              <Link to="/auth">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-base text-white/80 hover:text-white hover:bg-white/10 rounded-full" onClick={() => scrollToSection("solucao")}>
              Saiba Mais
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-16 mt-24 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">40k+</div>
              <div className="text-sm text-white/50">imóveis</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-white/50">atendimento</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-sm text-white/50">proteção</div>
            </div>
          </div>

          {/* Scroll indicator */}
          <button 
            onClick={() => scrollToSection("solucao")}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors duration-300"
          >
            <ChevronDown className="h-8 w-8 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solucao" className="py-40 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="animate-slide-up">
              <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-6">O Problema</div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-8 leading-tight">
                Cada lead perdido é uma comissão que escapa
              </h2>
              <p className="text-lg text-slate-500 mb-12 leading-relaxed">
                O cliente pede algo específico, você não tem, ele vai para os portais.
                Com o FlyImob, você sempre tem o imóvel certo.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Inventário Infinito", desc: "40.000 imóveis da região sempre disponíveis" },
                  { title: "Lead Blindado", desc: "Cliente nunca pula você, comissão garantida" },
                  { title: "Parceria 50/50", desc: "Imóvel de terceiro? Você faz a parceria" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                      <Check className="h-5 w-5 text-[#1e3a5f]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1e3a5f] mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual element */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1e3a5f]/10 to-white border border-[#1e3a5f]/10 animate-pulse-soft" />
                <div className="absolute inset-8 rounded-full bg-white shadow-2xl shadow-[#1e3a5f]/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-[#1e3a5f] mb-2">40k</div>
                    <div className="text-sm text-slate-400">imóveis mapeados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-40 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-6">Recursos</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
              Três pilares essenciais
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Tecnologia elegante que transforma sua operação
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Bot,
                title: "IA Concierge",
                desc: "Atende no WhatsApp 24/7, entende o cliente e recomenda imóveis automaticamente."
              },
              {
                icon: Building2,
                title: "Inventário Infinito",
                desc: "40.000 imóveis. Seus VIPs em destaque, os demais em modo discreto.",
                featured: true
              },
              {
                icon: LayoutDashboard,
                title: "Dashboard",
                desc: "Monitore conversas, configure prioridades, pause quando quiser fechar pessoalmente."
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`group p-10 rounded-3xl transition-all duration-500 animate-slide-up ${
                  feature.featured 
                    ? "bg-[#1e3a5f] text-white" 
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-8 ${
                  feature.featured 
                    ? "bg-white/10" 
                    : "bg-white shadow-sm border border-slate-100"
                }`}>
                  <feature.icon className={`h-6 w-6 ${feature.featured ? "text-white" : "text-[#1e3a5f]"}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${feature.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${feature.featured ? "text-white/70" : "text-slate-500"}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-40 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-24">
            <div className="text-sm text-[#1e3a5f]/60 uppercase tracking-widest mb-6">Investimento</div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a5f] mb-6">
              Planos transparentes
            </h2>
            <p className="text-lg text-slate-500">
              Escolha o plano ideal para seu volume de leads
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Start", price: "250", leads: "100", label: "Autônomos" },
              { name: "Pro", price: "500", leads: "250", label: "High Performers", featured: true },
              { name: "Elite", price: "800", leads: "500", label: "Pequenas Equipes" },
              { name: "Enterprise", price: null, leads: "∞", label: "Imobiliárias" }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`p-8 rounded-3xl transition-all duration-500 animate-slide-up ${
                  plan.featured 
                    ? "bg-[#1e3a5f] text-white scale-[1.02]" 
                    : "bg-white border border-slate-100"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
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
                <div className="mb-8">
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

          <p className="text-center text-sm text-slate-400 mt-12">
            Todos os planos incluem taxa única de implementação de R$ 1.000
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 bg-[#1e3a5f]">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-10 animate-scale-in">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Pronto para transformar
            <br />seu negócio?
          </h2>
          <p className="text-lg text-white/60 mb-12 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Junte-se aos corretores que já vendem mais com inteligência artificial
          </p>
          <Button size="lg" className="h-14 px-12 text-base bg-white text-[#1e3a5f] hover:bg-white/90 rounded-full font-medium animate-slide-up" style={{ animationDelay: "200ms" }} asChild>
            <Link to="/auth">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-100">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-[#1e3a5f]">FlyImob</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <button onClick={() => scrollToSection("solucao")} className="hover:text-[#1e3a5f] transition-colors duration-300">
                Solução
              </button>
              <button onClick={() => scrollToSection("recursos")} className="hover:text-[#1e3a5f] transition-colors duration-300">
                Recursos
              </button>
              <button onClick={() => scrollToSection("precos")} className="hover:text-[#1e3a5f] transition-colors duration-300">
                Planos
              </button>
              <Link to="/auth" className="hover:text-[#1e3a5f] transition-colors duration-300">
                Login
              </Link>
            </div>

            <div className="text-sm text-slate-400">
              © 2025 FlyImob
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
