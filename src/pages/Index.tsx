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
  Sparkles,
  ChevronDown
} from "lucide-react";

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">FlyImob</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("solucao")} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Solução
            </button>
            <button 
              onClick={() => scrollToSection("recursos")} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Recursos
            </button>
            <button 
              onClick={() => scrollToSection("precos")} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Planos
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Ultra Minimal */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16 relative overflow-hidden">
        {/* Abstract geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/10 rounded-full" />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Badge variant="outline" className="mb-8 px-4 py-1.5 border-primary/30 text-primary">
            <Sparkles className="h-3 w-3 mr-2" />
            Tecnologia imobiliária de ponta
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            O futuro do
            <br />
            <span className="text-primary">mercado imobiliário</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            IA que atende, qualifica e recomenda imóveis automaticamente.
            <br className="hidden md:block" />
            <span className="text-foreground font-medium">40.000 imóveis</span> na palma da sua mão.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/auth">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => scrollToSection("solucao")}>
              Saiba Mais
            </Button>
          </div>

          {/* Floating stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">IA ativa 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">40k+</span>
              <span className="text-muted-foreground">imóveis mapeados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">100%</span>
              <span className="text-muted-foreground">leads protegidos</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <button 
            onClick={() => scrollToSection("solucao")}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Solution Section - Clean Grid */}
      <section id="solucao" className="py-32 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-6">O Problema</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Corretores perdem vendas por não ter o imóvel certo
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O cliente pede algo específico, você não tem, ele vai para os portais e sua comissão desaparece. 
                Com o FlyImob, isso nunca mais acontece.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Inventário Infinito</h3>
                    <p className="text-sm text-muted-foreground">Acesso a 40.000 imóveis da região, sempre tem o que o cliente quer</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Lead Blindado</h3>
                    <p className="text-sm text-muted-foreground">Cliente nunca pula você, sua comissão está garantida</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Parceria Fifty 50/50</h3>
                    <p className="text-sm text-muted-foreground">Quando a IA encontra imóvel de terceiro, você faz a parceria</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual element */}
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-transparent rounded-3xl border border-border/50 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
                <div className="relative h-full flex flex-col items-center justify-center gap-8">
                  <div className="text-8xl font-bold text-primary/20">40k</div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground mb-2">Imóveis Mapeados</div>
                    <div className="text-sm text-muted-foreground">Baixada Santista</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimal Cards */}
      <section id="recursos" className="py-32 px-6 bg-card/50 border-y border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6">Recursos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Três pilares da revolução
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Tecnologia simples que transforma a forma como você vende imóveis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Bot className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">IA Concierge</h3>
              <p className="text-muted-foreground leading-relaxed">
                Atende no WhatsApp 24/7, entende o desejo real do cliente e recomenda os imóveis certos automaticamente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-background border border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-6 relative">
                <Building2 className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 relative">Inventário Infinito</h3>
              <p className="text-muted-foreground leading-relaxed relative">
                Acesso a 40.000 imóveis. Seus imóveis VIP aparecem com destaque, os demais em modo background.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <LayoutDashboard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Dashboard de Controle</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitore conversas, configure prioridades e pause o robô quando quiser fechar a venda pessoalmente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean */}
      <section id="precos" className="py-32 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <Badge variant="secondary" className="mb-6">Planos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha seu plano
            </h2>
            <p className="text-lg text-muted-foreground">
              Baseado em leads únicos mensais. Escale conforme cresce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start */}
            <div className="p-6 rounded-2xl border border-border/50 bg-background">
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2">Autônomos</div>
                <div className="text-2xl font-bold text-foreground">Start</div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">R$ 250</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="h-4 w-4 text-primary" />
                  100 leads únicos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  IA Concierge 24/7
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Inventário Infinito
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth">Começar</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-2xl border-2 border-primary bg-background relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">Popular</Badge>
              <div className="mb-6">
                <div className="text-sm text-primary mb-2">High Performers</div>
                <div className="text-2xl font-bold text-foreground">Pro</div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">R$ 500</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="h-4 w-4 text-primary" />
                  250 leads únicos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  IA Concierge 24/7
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Dashboard avançado
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Suporte prioritário
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/auth">Começar</Link>
              </Button>
            </div>

            {/* Elite */}
            <div className="p-6 rounded-2xl border border-border/50 bg-background">
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-2">Pequenas Equipes</div>
                <div className="text-2xl font-bold text-foreground">Elite</div>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">R$ 800</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="h-4 w-4 text-primary" />
                  500 leads únicos
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  IA Concierge 24/7
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Dashboard completo
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Suporte VIP
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth">Começar</Link>
              </Button>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <div className="mb-6">
                <div className="text-sm text-primary mb-2">Imobiliárias</div>
                <div className="text-2xl font-bold text-foreground">Enterprise</div>
              </div>
              <div className="mb-6">
                <span className="text-xl font-bold text-foreground">Sob Consulta</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                <li className="flex items-center gap-2 text-foreground font-medium">
                  <Check className="h-4 w-4 text-primary" />
                  Volume personalizado
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Múltiplos corretores
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  API personalizada
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  Gerente de sucesso
                </li>
              </ul>
              <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10" asChild>
                <Link to="/auth">Falar com Consultor</Link>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Todos os planos incluem taxa de implementação de R$ 1.000
          </p>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-32 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para blindar seus leads?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Comece agora e transforme a forma como você vende imóveis
          </p>
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/auth">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer - Ultra Minimal */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">FlyImob</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => scrollToSection("solucao")} className="hover:text-foreground transition-colors">
                Solução
              </button>
              <button onClick={() => scrollToSection("recursos")} className="hover:text-foreground transition-colors">
                Recursos
              </button>
              <button onClick={() => scrollToSection("precos")} className="hover:text-foreground transition-colors">
                Planos
              </button>
              <Link to="/auth" className="hover:text-foreground transition-colors">
                Login
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              © 2025 FlyImob. Baixada Santista, SP
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
