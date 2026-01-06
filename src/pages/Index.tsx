import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Shield, 
  Bot, 
  LayoutDashboard, 
  MessageCircle, 
  Settings, 
  Zap,
  Check,
  ArrowRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone
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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Imobflow AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection("funcionalidades")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </button>
            <button 
              onClick={() => scrollToSection("como-funciona")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona
            </button>
            <button 
              onClick={() => scrollToSection("precos")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preços
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Zap className="h-3 w-3 mr-1" />
            Baixada Santista • 40.000+ Imóveis
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transforme seu WhatsApp em uma{" "}
            <span className="text-primary">Máquina de Vendas</span>{" "}
            com Inventário Infinito
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Atendimento via IA 24/7 que acessa 40.000 imóveis da Baixada Santista. 
            Blinde seus leads e nunca mais perca uma venda por falta de opções.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">40k+</div>
              <div className="text-sm text-muted-foreground">Imóveis Mapeados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Atendimento IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Leads Blindados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">9</div>
              <div className="text-sm text-muted-foreground">Cidades Cobertas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O Poder do Imobflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para transformar seu atendimento e nunca mais perder uma venda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Inventário Infinito</CardTitle>
                <CardDescription>
                  40 mil imóveis mapeados e atualizados diariamente em toda a Baixada Santista
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Blindagem de Leads</CardTitle>
                <CardDescription>
                  Envie descrições perfeitas de imóveis de terceiros sem dar o link do concorrente
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">IA Concierge</CardTitle>
                <CardDescription>
                  Respostas instantâneas e inteligentes no tom de voz do corretor, 24 horas por dia
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Dashboard Inteligente</CardTitle>
                <CardDescription>
                  Controle total sobre fontes VIP e Background, métricas e desempenho do robô
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Simples e Rápido</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-lg text-muted-foreground">
              Em apenas 3 passos você já está vendendo mais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  1
                </div>
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Conecte seu WhatsApp</h3>
                <p className="text-muted-foreground">
                  Integração simples e segura com seu número profissional em poucos cliques
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  2
                </div>
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Configure suas Fontes</h3>
                <p className="text-muted-foreground">
                  Defina suas fontes prioritárias (VIP) e secundárias para busca inteligente
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
            </div>

            <div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  3
                </div>
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">IA Atende 24h</h3>
                <p className="text-muted-foreground">
                  A IA atende, qualifica e recomenda os imóveis certos automaticamente
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Planos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-lg text-muted-foreground">
              Planos flexíveis para corretores de todos os tamanhos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Start Plan */}
            <Card className="bg-background border-border relative">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Start</CardTitle>
                <CardDescription>Ideal para começar</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 250</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">100 leads únicos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Atendimento IA 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Acesso ao inventário</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Dashboard básico</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Taxa de implementação: R$ 1.000
                  </p>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth">Começar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-background border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Mais Popular</Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Pro</CardTitle>
                <CardDescription>Para corretores ativos</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 500</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">250 leads únicos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Atendimento IA 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Inventário completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Dashboard avançado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Suporte prioritário</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Taxa de implementação: R$ 1.000
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link to="/auth">Começar Agora</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className="bg-background border-border relative">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Elite</CardTitle>
                <CardDescription>Máxima performance</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 800</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">500 leads únicos/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Atendimento IA 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Inventário premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Dashboard completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Suporte VIP</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Relatórios avançados</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Taxa de implementação: R$ 1.000
                  </p>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth">Começar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pronto para revolucionar suas vendas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se aos corretores que já estão vendendo mais com Imobflow AI
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/auth">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Imobflow AI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Plataforma de Inventário Infinito para corretores de imóveis da Baixada Santista. 
                Atendimento via IA 24/7 com acesso a mais de 40.000 imóveis.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Santos, SP - Baixada Santista</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection("funcionalidades")} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("como-funciona")} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Como Funciona
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection("precos")} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Preços
                  </button>
                </li>
                <li>
                  <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contato@imobflow.ai</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>(13) 99999-9999</span>
                </li>
              </ul>
              <div className="flex items-center gap-4 mt-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Imobflow AI. Todos os direitos reservados. Feito com ❤️ na Baixada Santista.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
