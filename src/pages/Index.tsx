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
  Phone,
  Brain,
  Eye,
  EyeOff,
  Handshake,
  AlertTriangle,
  TrendingUp,
  Lock,
  Users,
  Pause,
  Mic,
  Star
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
              onClick={() => scrollToSection("problema")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              O Problema
            </button>
            <button 
              onClick={() => scrollToSection("triade")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              A Solução
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
              Planos
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

      {/* Hero Section - O Oceano Azul */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto text-center max-w-5xl relative">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            O mercado imobiliário tradicional está quebrado
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Pare de perder vendas por{" "}
            <span className="text-destructive">"não ter o imóvel"</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            O <span className="text-primary font-semibold">Inventário Infinito</span> dá a você o poder de ter{" "}
            <span className="text-foreground font-bold">40.000 imóveis</span> na palma da mão.
          </p>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Não vendemos "bot". Vendemos <span className="text-primary font-semibold">Blindagem de Lead</span> e{" "}
            <span className="text-primary font-semibold">Retenção de Comissão</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90" asChild>
              <Link to="/auth">
                Blindar Meus Leads
                <Shield className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">40k+</div>
              <div className="text-sm text-muted-foreground">Imóveis Mapeados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">IA Atendendo</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Leads Blindados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">50/50</div>
              <div className="text-sm text-muted-foreground">Parceria Garantida</div>
            </div>
          </div>
        </div>
      </section>

      {/* O Problema Section */}
      <section id="problema" className="py-20 px-4 bg-destructive/5 border-y border-destructive/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-destructive/30 text-destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              O Problema
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O corretor gasta <span className="text-destructive">80% do tempo</span> respondendo curiosos
            </h2>
            <p className="text-lg text-muted-foreground">
              E perde vendas porque não tem o imóvel que o cliente quer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-background border-destructive/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-lg text-destructive">"Não tenho esse imóvel"</CardTitle>
                <CardDescription className="text-base">
                  Esta frase é o <strong>fim da comissão</strong>. O cliente foge para os portais e o corretor vira figurante.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-background border-primary">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-primary">A Solução Fly</CardTitle>
                <CardDescription className="text-base">
                  Um <strong>Cérebro Digital</strong> que dá ao corretor o poder de ter 40.000 imóveis na palma da mão.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* A Tríade de Poder */}
      <section id="triade" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">O Produto</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Tríade de Poder
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              O sistema opera em três frentes simultâneas que garantem a conversão
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Motor de IA */}
            <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 border border-primary/20">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                <Badge variant="outline" className="w-fit mb-2">Motor de IA</Badge>
                <CardTitle className="text-xl">O Concierge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">IA Semântica</strong> que entende o desejo real do cliente 
                    <span className="text-primary italic"> (ex: "quero algo perto da balsa, com sol da manhã")</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Resposta instantânea</strong> no WhatsApp (24/7), eliminando o tempo de espera que mata a venda
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mic className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tom de voz configurável:</strong> Formal, descontraído ou agressivo
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Inventário Infinito */}
            <Card className="bg-card border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="pb-4 relative">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <Badge className="w-fit mb-2 bg-primary">Principal</Badge>
                <CardTitle className="text-xl">Inventário Infinito</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm text-primary">Status VIP</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Imóveis da sua imobiliária ou parceiros diretos. Aparecem com <strong>fotos, links e CTA direto</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">Status Background</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    40.000 imóveis varridos da região. Aparecem apenas como <strong>texto descritivo</strong>.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm text-green-500">O Pulo do Gato</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cliente fica curioso → Você recebe o link no dashboard → Faz o <strong>Fifty (50/50)</strong>. Cliente nunca pula você!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard de Controle */}
            <Card className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 border border-primary/20">
                  <LayoutDashboard className="h-7 w-7 text-primary" />
                </div>
                <Badge variant="outline" className="w-fit mb-2">Dashboard</Badge>
                <CardTitle className="text-xl">O Leme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mic className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Tom de voz:</strong> Configure se quer formal, descontraído ou agressivo
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Gestão de Prioridades:</strong> Defina quem é VIP e quem é Background
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Monitoramento Real-Time:</strong> Veja o que a IA está falando
                  </p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                  <Pause className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-destructive">Botão de Pânico:</strong> Pause o robô para fechar a venda pessoalmente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blindagem de Leads - Explicação */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              O Diferencial
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Blindagem de Lead = <span className="text-primary">Retenção de Comissão</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <span className="text-destructive font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Cliente pede um imóvel específico</h3>
                  <p className="text-sm text-muted-foreground">
                    "Quero um 3 quartos no Gonzaga com vista pro mar"
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">IA encontra no Inventário Background</h3>
                  <p className="text-sm text-muted-foreground">
                    Envia descrição detalhada <strong>sem o link do concorrente</strong>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <span className="text-green-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Cliente fica interessado</h3>
                  <p className="text-sm text-muted-foreground">
                    Você recebe a fonte no dashboard e faz o <strong>Fifty 50/50</strong>
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-background border-primary p-6">
              <div className="text-center">
                <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">Lead Blindado</h3>
                <p className="text-muted-foreground mb-4">
                  O cliente <strong>nunca pula o corretor</strong>. Sua comissão está garantida.
                </p>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    "Nós não vendemos bot. Vendemos proteção da sua comissão."
                  </p>
                </div>
              </div>
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
              Em apenas 3 passos você já está blindando seus leads
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  1
                </div>
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4 border border-border">
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
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4 border border-border">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Configure VIP e Background</h3>
                <p className="text-muted-foreground">
                  Defina suas fontes prioritárias (VIP) e o tom de voz da sua IA
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
            </div>

            <div>
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  3
                </div>
                <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center mb-4 border border-border">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Leads Blindados 24h</h3>
                <p className="text-muted-foreground">
                  A IA atende, qualifica e recomenda os imóveis certos. Você só fecha!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Modelo SaaS</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planos baseados em <span className="text-primary">Leads Únicos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Escala e recorrência para proteger sua margem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start Plan */}
            <Card className="bg-background border-border relative">
              <CardHeader className="pb-4">
                <Badge variant="outline" className="w-fit mb-2">Autônomos</Badge>
                <CardTitle className="text-xl">Start</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 250</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground font-semibold">100 leads únicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">IA Concierge 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Inventário Infinito</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Dashboard básico</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    + Taxa de implementação: <strong>R$ 1.000</strong>
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
                <Badge variant="outline" className="w-fit mb-2 border-primary/50 text-primary">High Performers</Badge>
                <CardTitle className="text-xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 500</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground font-semibold">250 leads únicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">IA Concierge 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Inventário completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Dashboard avançado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Suporte prioritário</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    + Taxa de implementação: <strong>R$ 1.000</strong>
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
                <Badge variant="outline" className="w-fit mb-2">Pequenas Equipes</Badge>
                <CardTitle className="text-xl">Elite</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">R$ 800</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground font-semibold">500 leads únicos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">IA Concierge 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Inventário premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Dashboard completo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Suporte VIP</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    + Taxa de implementação: <strong>R$ 1.000</strong>
                  </p>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth">Começar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 relative">
              <CardHeader className="pb-4">
                <Badge variant="outline" className="w-fit mb-2 border-primary/50 text-primary">Grandes Imobiliárias</Badge>
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-foreground">Sob Consulta</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground font-semibold">Volume personalizado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Múltiplos corretores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">API personalizada</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Gerente de sucesso</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">SLA garantido</span>
                  </li>
                </ul>
                <div className="pt-4 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground text-center">
                    Implementação personalizada
                  </p>
                </div>
                <Button className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30" variant="outline" asChild>
                  <Link to="/auth">Falar com Consultor</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upsell */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 max-w-2xl mx-auto">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Academia Fly</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Curso "Como vender com IA" disponível no dashboard por apenas <strong className="text-primary">R$ 29,90</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Pronto para blindar seus leads?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Junte-se aos corretores que já estão usando o poder do Inventário Infinito
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Imobflow AI</span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                A revolução da inteligência imobiliária. Inventário Infinito para corretores da Baixada Santista.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Baixada Santista, SP - Brasil</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection("triade")} className="text-muted-foreground hover:text-foreground transition-colors">
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("precos")} className="text-muted-foreground hover:text-foreground transition-colors">
                    Preços
                  </button>
                </li>
                <li>
                  <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contato</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:contato@imobflow.ai" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    contato@imobflow.ai
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    @imobflow.ai
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    Imobflow AI
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Imobflow AI. Todos os direitos reservados.</p>
            <p className="mt-1">Feito com ❤️ para corretores da Baixada Santista</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
