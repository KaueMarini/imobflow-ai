import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import {
  Building2, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  Check,
  Users,
  BarChart3,
  MessageSquare,
  Radar,
  Calculator,
  Home,
  FileText,
  Scale,
  Gavel,
  GraduationCap,
  Camera,
  Target,
  Handshake,
  Crown
} from "lucide-react";

// Lazy load 3D component for performance
const FlyCore3D = lazy(() => import("@/components/landing/FlyCore3D"));

const Index = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#1e3a5f]/10 selection:text-[#1e3a5f]">
      {/* Header - Ultra minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl">
        <div className="max-w-screen-xl mx-auto flex h-14 items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold text-[#1e3a5f] tracking-tight">FlyImob</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {["Produto", "Recursos", "Planos"].map((item, i) => (
              <button 
                key={i}
                onClick={() => scrollToSection(item.toLowerCase())} 
                className="text-[13px] text-[#1e3a5f]/60 hover:text-[#1e3a5f] transition-colors duration-300"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-[13px] text-[#1e3a5f]/70 hover:text-[#1e3a5f] hover:bg-transparent h-8 px-3" asChild>
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button size="sm" className="bg-[#1e3a5f] hover:bg-[#0f1f33] text-white text-[13px] h-8 px-4 rounded-full" asChild>
              <Link to="/auth">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero - With 3D Core */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a0f1a]">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-cyan-500/10 animate-pulse" />
            </div>
          }>
            <FlyCore3D />
          </Suspense>
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="text-center max-w-4xl mx-auto relative z-20"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div 
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[12px] font-medium text-white/70 tracking-wide">Ecossistema Imobiliário Inteligente</span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="text-[clamp(2.5rem,8vw,5.5rem)] font-semibold text-white leading-[0.95] tracking-[-0.03em] mb-6"
          >
            Interesse vira
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">negócio fechado.</span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-[clamp(1rem,2vw,1.25rem)] text-white/40 max-w-xl mx-auto leading-relaxed mb-4 font-light"
          >
            40.000 imóveis. IA que atende 24/7.
            <br />
            Do primeiro contato ao fechamento.
          </motion.p>

          <motion.p 
            variants={fadeUp}
            className="text-[14px] text-cyan-400/60 mb-10 font-light tracking-wide"
          >
            Uma plataforma viva, operando o mercado em tempo real.
          </motion.p>

          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="h-12 px-8 text-[15px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-medium transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/25 border-0" 
              asChild
            >
              <Link to="/auth">
                Começar agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="h-12 px-8 text-[15px] text-white/60 hover:text-white hover:bg-white/5 rounded-full font-medium border border-white/10"
              onClick={() => scrollToSection("produto")}
            >
              Saiba mais
            </Button>
          </motion.div>
        </motion.div>

        <motion.button 
          onClick={() => scrollToSection("produto")}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors duration-300 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </motion.button>
      </section>

      {/* Stats - Floating cards */}
      <section className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { value: "40k+", label: "Imóveis" },
              { value: "24/7", label: "Atendimento IA" },
              { value: "100%", label: "Continuidade" },
              { value: "50/50", label: "Parceria" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="text-center p-8 rounded-2xl bg-white border border-black/[0.04] hover:border-black/[0.08] transition-colors duration-500"
              >
                <div className="text-[clamp(2rem,4vw,3rem)] font-semibold text-[#1e3a5f] tracking-tight mb-1">{stat.value}</div>
                <div className="text-[13px] text-[#1e3a5f]/40 font-medium tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Section */}
      <section id="produto" className="py-32 px-6">
        <div className="max-w-screen-lg mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[13px] text-[#1e3a5f]/40 uppercase tracking-[0.2em] mb-4">
              O Problema
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[clamp(1.75rem,5vw,3.5rem)] font-semibold text-[#1e3a5f] leading-[1.1] tracking-tight mb-6">
              O corretor trabalha muito.
              <br />
              <span className="text-[#1e3a5f]/25">E vende pouco.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[17px] text-[#1e3a5f]/50 max-w-md mx-auto font-light">
              Quando o cliente pede algo específico, a resposta sempre é a mesma.
            </motion.p>
          </motion.div>

          <motion.div 
            className="max-w-xl mx-auto text-center mb-20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-12 rounded-3xl bg-gradient-to-b from-[#1e3a5f]/5 to-white border border-[#1e3a5f]/10">
              <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-medium text-[#1e3a5f]/60 leading-tight">
                "Não tenho esse imóvel."
              </p>
              <p className="text-[14px] text-[#1e3a5f]/40 mt-4 font-light">
                Essa frase custa milhares em comissão perdida.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="recursos" className="py-32 px-6 bg-[#1e3a5f]">
        <div className="max-w-screen-lg mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[13px] text-white/30 uppercase tracking-[0.2em] mb-4">
              A Solução
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[clamp(1.75rem,5vw,3.5rem)] font-semibold text-white leading-[1.1] tracking-tight mb-6">
              Um cérebro digital que
              <br />
              <span className="text-white/30">nunca diz "não tenho".</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { 
                title: "IA Concierge", 
                desc: "Entende intenção, não palavras. Responde em segundos, 24 horas.",
                highlight: "Semântica avançada"
              },
              { 
                title: "Inventário Infinito", 
                desc: "40.000 imóveis na palma da mão. VIP e Background organizados.",
                highlight: "Nunca diga não"
              },
              { 
                title: "Dashboard Leme", 
                desc: "Controle total. Tom de voz, prioridades, botão de assumir.",
                highlight: "Você no comando"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500"
              >
                <p className="text-[11px] text-white/30 uppercase tracking-[0.15em] mb-3">{feature.highlight}</p>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-[15px] text-white/50 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 px-6">
        <div className="max-w-screen-lg mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[13px] text-[#1e3a5f]/40 uppercase tracking-[0.2em] mb-4">
              Como Funciona
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[clamp(1.75rem,5vw,3rem)] font-semibold text-[#1e3a5f] leading-[1.1] tracking-tight">
              Três passos para começar
            </motion.h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { step: "01", title: "Conecte", desc: "Integre seu WhatsApp em poucos cliques" },
              { step: "02", title: "Configure", desc: "Defina prioridades e tom de voz" },
              { step: "03", title: "Feche", desc: "A IA atende, você fecha negócios" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-[80px] font-extralight text-[#1e3a5f]/10 leading-none mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-[#1e3a5f] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#1e3a5f]/50 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecossistema" className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[13px] text-[#1e3a5f]/40 uppercase tracking-[0.2em] mb-4">
              O Ecossistema FlyImob
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[clamp(1.75rem,5vw,3rem)] font-semibold text-[#1e3a5f] leading-[1.1] tracking-tight mb-6">
              Tudo o que uma operação imobiliária
              <br />
              <span className="text-[#1e3a5f]/30">moderna precisa. Em um só lugar.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[17px] text-[#1e3a5f]/50 max-w-2xl mx-auto font-light leading-relaxed">
              O FlyImob não é apenas uma ferramenta de atendimento. É um ecossistema integrado que conecta 
              leads, imóveis, inteligência, jurídico e capacitação em uma única plataforma.
            </motion.p>
          </motion.div>

          {/* Module: Operação Comercial */}
          <motion.div 
            className="mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1e3a5f]">Operação Comercial</h3>
                <p className="text-[13px] text-[#1e3a5f]/50">Controle total da jornada do lead</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: BarChart3,
                  title: "CRM Imobiliário Unificado", 
                  desc: "Todos os leads centralizados em um único painel, com histórico completo de interações, origem, interesse e estágio da negociação."
                },
                { 
                  icon: Radar,
                  title: "Termômetro de Demanda", 
                  desc: "Visualize, em tempo real, quais imóveis, regiões e perfis estão sendo mais buscados. Dados reais de intenção — não achismo."
                },
                { 
                  icon: MessageSquare,
                  title: "Atendimento Contínuo com IA", 
                  desc: "A IA mantém a conversa ativa, qualifica o interesse e entrega o lead pronto para o corretor fechar."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-white border border-black/[0.04] hover:border-[#1e3a5f]/20 transition-all duration-500 hover:shadow-lg hover:shadow-[#1e3a5f]/5"
                >
                  <item.icon className="h-6 w-6 text-[#1e3a5f]/60 mb-4" />
                  <h4 className="text-lg font-semibold text-[#1e3a5f] mb-2">{item.title}</h4>
                  <p className="text-[14px] text-[#1e3a5f]/50 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Module: Inteligência de Mercado */}
          <motion.div 
            className="mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1e3a5f]">Inteligência de Mercado</h3>
                <p className="text-[13px] text-[#1e3a5f]/50">Decisão baseada em dados, não em sensação</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  icon: Radar,
                  title: "Radar de Captação de Imóveis", 
                  desc: "Identifique oportunidades de captação com base em demanda real do mercado e comportamento dos leads."
                },
                { 
                  icon: Calculator,
                  title: "Avaliação de Imóveis com IA", 
                  desc: "Estimativas inteligentes de valor, considerando região, padrão, liquidez e comportamento de busca — uma base sólida para negociação."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-white border border-black/[0.04] hover:border-[#1e3a5f]/20 transition-all duration-500 hover:shadow-lg hover:shadow-[#1e3a5f]/5"
                >
                  <item.icon className="h-6 w-6 text-[#1e3a5f]/60 mb-4" />
                  <h4 className="text-lg font-semibold text-[#1e3a5f] mb-2">{item.title}</h4>
                  <p className="text-[14px] text-[#1e3a5f]/50 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Module: Ativos & Inventário */}
          <motion.div 
            className="mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1e3a5f]">Ativos & Inventário</h3>
                <p className="text-[13px] text-[#1e3a5f]/50">Liberdade para definir de onde vêm seus imóveis</p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeUp}
              className="p-8 rounded-2xl bg-white border border-black/[0.04]"
            >
              <h4 className="text-lg font-semibold text-[#1e3a5f] mb-4">Inventário Unificado e Personalizável</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    "Integração XML com portais e CRMs",
                    "Definição das fontes de imóveis preferidas",
                    "Controle sobre imóveis próprios e de parceiros"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-[#1e3a5f]" />
                      </div>
                      <span className="text-[14px] text-[#1e3a5f]/60">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <p className="text-[14px] text-[#1e3a5f]/50 font-light leading-relaxed">
                    Tudo organizado para garantir continuidade no atendimento — sem direcionar o cliente para portais concorrentes.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Module: Governança Jurídica */}
          <motion.div 
            className="mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1e3a5f]">Governança Jurídica Imobiliária</h3>
                <p className="text-[13px] text-[#1e3a5f]/50">Segurança para fechar negócios com tranquilidade</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: FileText,
                  title: "Central Jurídica Imobiliária", 
                  desc: "Uma área dedicada a dúvidas, contratos e procedimentos do mercado imobiliário."
                },
                { 
                  icon: MessageSquare,
                  title: "IA Jurídica Integrada", 
                  desc: "Respostas rápidas e contextualizadas para dúvidas jurídicas do dia a dia do corretor."
                },
                { 
                  icon: Gavel,
                  title: "Advogada Parceira Especialista", 
                  desc: "Acesso a uma profissional especializada no ramo imobiliário para suporte técnico e orientações."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="p-6 rounded-2xl bg-white border border-black/[0.04] hover:border-[#1e3a5f]/20 transition-all duration-500 hover:shadow-lg hover:shadow-[#1e3a5f]/5"
                >
                  <item.icon className="h-6 w-6 text-[#1e3a5f]/60 mb-4" />
                  <h4 className="text-lg font-semibold text-[#1e3a5f] mb-2">{item.title}</h4>
                  <p className="text-[14px] text-[#1e3a5f]/50 font-light leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.p 
              variants={fadeUp}
              className="text-center text-[15px] text-[#1e3a5f]/60 mt-8 font-light"
            >
              Menos insegurança. Mais confiança na tomada de decisão.
            </motion.p>
          </motion.div>

          {/* Module: Formação & Performance */}
          <motion.div 
            className="mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1e3a5f]">Formação & Performance</h3>
                <p className="text-[13px] text-[#1e3a5f]/50">Tecnologia não substitui preparo. Ela potencializa.</p>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeUp}
              className="p-8 rounded-2xl bg-white border border-black/[0.04]"
            >
              <h4 className="text-lg font-semibold text-[#1e3a5f] mb-4">Academia Fly</h4>
              <p className="text-[14px] text-[#1e3a5f]/50 font-light mb-6">
                Conteúdos e treinamentos práticos para elevar o nível do corretor:
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { icon: Camera, label: "Fotografia imobiliária profissional" },
                  { icon: Target, label: "Tráfego pago para imóveis" },
                  { icon: Handshake, label: "Atendimento e qualificação" },
                  { icon: Crown, label: "Postura comercial e fechamento" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#1e3a5f]/5 text-center">
                    <item.icon className="h-6 w-6 text-[#1e3a5f]/60 mx-auto mb-2" />
                    <p className="text-[13px] text-[#1e3a5f]/70 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-[14px] text-[#1e3a5f]/50 mt-6 font-light">
                O objetivo é simples: transformar ferramenta em resultado.
              </p>
            </motion.div>
          </motion.div>

          {/* Closing Statement */}
          <motion.div 
            className="text-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[clamp(1.1rem,3vw,1.5rem)] text-[#1e3a5f]/70 font-light leading-relaxed max-w-2xl mx-auto">
              O FlyImob não resolve apenas um ponto da operação.
              <br />
              <span className="text-[#1e3a5f] font-medium">Ele organiza toda a estrutura para que o corretor e a imobiliária operem em outro nível.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-32 px-6">
        <div className="max-w-screen-xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[13px] text-[#1e3a5f]/40 uppercase tracking-[0.2em] mb-4">
              Planos
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-[clamp(1.75rem,5vw,3rem)] font-semibold text-[#1e3a5f] leading-[1.1] tracking-tight mb-4">
              Simples e transparente
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[15px] text-[#1e3a5f]/50 font-light">
              Modelo baseado em leads únicos
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              { name: "Start", price: "294", leads: "100", features: ["IA 24/7", "Inventário Infinito", "Dashboard básico", "Suporte por email"] },
              { name: "Pro", price: "500", leads: "250", features: ["Tudo do Start", "Prioridade VIP", "Suporte dedicado", "Termômetro de demanda"], featured: true },
              { name: "Elite", price: "800", leads: "500", features: ["Tudo do Pro", "Prioridade máxima", "Gerente de conta", "Academia Fly completa"] },
              { name: "Enterprise", price: "Consulte", leads: "Ilimitados", features: ["Tudo do Elite", "IA personalizada", "API dedicada", "Suporte VIP 24/7"], enterprise: true }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className={`p-8 rounded-2xl transition-all duration-500 ${
                  plan.featured 
                    ? "bg-[#1e3a5f] text-white ring-1 ring-[#1e3a5f] lg:scale-[1.02]" 
                    : plan.enterprise
                      ? "bg-gradient-to-b from-[#1e3a5f]/5 to-white border border-[#1e3a5f]/20"
                      : "bg-white border border-black/[0.04]"
                }`}
              >
                {plan.featured && (
                  <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] mb-6">Recomendado</p>
                )}
                {plan.enterprise && (
                  <p className="text-[11px] text-[#1e3a5f]/50 uppercase tracking-[0.15em] mb-6">Para grandes operações</p>
                )}
                <h3 className={`text-2xl font-semibold mb-2 ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  {plan.price === "Consulte" ? (
                    <span className="text-3xl font-semibold text-[#1e3a5f]">Sob Consulta</span>
                  ) : (
                    <>
                      <span className={`text-4xl font-semibold ${plan.featured ? "text-white" : "text-[#1e3a5f]"}`}>
                        R$ {plan.price}
                      </span>
                      <span className={plan.featured ? "text-white/40" : "text-[#1e3a5f]/40"}>/mês</span>
                    </>
                  )}
                </div>
                <p className={`text-[13px] mb-8 ${plan.featured ? "text-white/50" : "text-[#1e3a5f]/50"}`}>
                  {plan.leads} leads únicos/mês
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-2 text-[14px] ${plan.featured ? "text-white/70" : "text-[#1e3a5f]/60"}`}>
                      <Check className={`h-4 w-4 flex-shrink-0 ${plan.featured ? "text-white/50" : "text-[#1e3a5f]/30"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full h-11 rounded-full text-[14px] font-medium transition-all duration-300 ${
                    plan.featured 
                      ? "bg-white text-[#1e3a5f] hover:bg-white/90" 
                      : "bg-[#1e3a5f] text-white hover:bg-[#0f1f33]"
                  }`}
                  asChild
                >
                  <Link to="/auth">{plan.enterprise ? "Falar com vendas" : "Começar"}</Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <motion.p 
            className="text-center text-[13px] text-[#1e3a5f]/40 mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Taxa única de implementação: R$ 1.000
          </motion.p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-screen-sm mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-[clamp(2rem,6vw,3.5rem)] font-semibold text-[#1e3a5f] leading-[1.1] tracking-tight mb-6">
              Pronto para
              <br />
              <span className="text-[#1e3a5f]/25">fechar mais?</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-[17px] text-[#1e3a5f]/50 mb-10 font-light">
              O Inventário Infinito já está transformando o mercado.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Button 
                size="lg" 
                className="h-14 px-10 text-[15px] bg-[#1e3a5f] hover:bg-[#0f1f33] text-white rounded-full font-medium transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-[#1e3a5f]/20" 
                asChild
              >
                <Link to="/auth">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-12 px-6 border-t border-black/[0.04]">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <Building2 className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-[#1e3a5f]">FlyImob</span>
          </div>

          <nav className="flex items-center gap-6">
            {["Produto", "Recursos", "Planos"].map((item, i) => (
              <button 
                key={i}
                onClick={() => scrollToSection(item.toLowerCase())} 
                className="text-[13px] text-[#1e3a5f]/40 hover:text-[#1e3a5f] transition-colors duration-300"
              >
                {item}
              </button>
            ))}
            <Link to="/auth" className="text-[13px] text-[#1e3a5f]/40 hover:text-[#1e3a5f] transition-colors duration-300">
              Login
            </Link>
          </nav>

          <p className="text-[12px] text-[#1e3a5f]/30">
            © 2025 FlyImob
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
