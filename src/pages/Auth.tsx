import { useState, useEffect, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, Loader2, Shield, Zap, Users, Rocket, TrendingUp, Clock } from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const motivationalPhrases = [
  "Este sistema é a tecnologia que faltava para você se destacar.",
  "Seus clientes esperam agilidade, e você não pode decepcionar.",
  "Não perca mais tempo, o mercado está em constante evolução.",
  "Seja pioneiro, não ultrapassado.",
  "O avanço tecnológico é a chave para o sucesso no mercado imobiliário.",
  "A lentidão custa dinheiro, e o mercado imobiliário não perdoa.",
  "Quem não inova, fica obsoleto."
];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Rotate motivational phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % motivationalPhrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Banco externo usa "clientes_saas" (com S no final)
    const sb = supabase as any;

    try {
      if (isSignUp) {
        // === CADASTRO ===
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              nome_empresa: nomeEmpresa,
              whatsapp: whatsapp,
            },
          },
        });

        if (authError) throw authError;

        // === Inserção Manual na tabela clientes_saas ===
        if (authData.user) {
          const { data: existingClient } = await sb
            .from("clientes_saas")
            .select("id")
            .eq("user_id", authData.user.id)
            .maybeSingle();

          if (!existingClient) {
            console.log("Inserindo clientes_saas manualmente...");
            const { error: dbError } = await sb
              .from("clientes_saas")
              .insert({
                user_id: authData.user.id,
                nome_empresa: nomeEmpresa,
                telefone_admin: whatsapp, 
                plano: 'starter'
              });
            
            if (dbError) {
              console.error("Erro ao criar perfil da empresa:", dbError);
            }
          }
        }

        toast({
          title: "Conta criada!",
          description: "Você já pode fazer login.",
        });
        setIsSignUp(false);

      } else {
        // === LOGIN ===
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/home");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={heroBuilding} 
          alt="Modern Building" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/95 via-[#1e3a5f]/85 to-[#0a1929]/98" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight block">FlyImob</span>
              <span className="text-xs text-white/50 uppercase tracking-widest">Inteligência Imobiliária</span>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <span className="text-white/90">A tecnologia que faltava para você</span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                O futuro do mercado imobiliário
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-emerald-300 bg-clip-text text-transparent">
                  está na palma da sua mão.
                </span>
              </h1>
              
              {/* Rotating motivational phrase */}
              <div className="h-16 overflow-hidden">
                <p 
                  key={currentPhrase}
                  className="text-lg text-white/70 max-w-md animate-fade-in"
                >
                  "{motivationalPhrases[currentPhrase]}"
                </p>
              </div>
            </div>
            
            {/* Features with better styling */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="font-semibold text-white">Leads 100% blindados</span>
                  <p className="text-sm text-white/50">Proteção total da sua comissão</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border border-blue-500/30">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <span className="font-semibold text-white">IA atendendo 24/7</span>
                  <p className="text-sm text-white/50">Seus clientes esperam agilidade</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/10 hover:border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
                  <Building2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <span className="font-semibold text-white">40.000+ imóveis</span>
                  <p className="text-sm text-white/50">Inventário Infinito mapeado</p>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-8 pt-4 border-t border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">40k+</div>
                <div className="text-xs text-white/50">Imóveis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/50">Atendimento</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">100%</div>
                <div className="text-xs text-white/50">Blindado</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-white/40 text-sm">
            © 2025 FlyImob. A revolução da inteligência imobiliária.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#1e3a5f]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1e3a5f]/30">
              <Building2 className="w-9 h-9 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1e3a5f]">FlyImob</span>
            <p className="text-sm text-slate-500 text-center">O futuro do mercado imobiliário</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-slate-300/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1e3a5f]/30 relative">
                <Building2 className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                  {isSignUp ? "Comece sua jornada" : "Bem-vindo de volta"}
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {isSignUp 
                    ? "Seja pioneiro. Não fique para trás." 
                    : "Entre para acessar seu painel de controle."}
                </CardDescription>
              </div>
              
              {/* Motivational badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1e3a5f]/5 to-emerald-500/5 border border-[#1e3a5f]/10 text-xs">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-slate-600">O mercado não espera. Você também não deveria.</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nome do Corretor</label>
                      <Input 
                        placeholder="Ex: João Silva" 
                        value={nomeEmpresa} 
                        onChange={(e) => setNomeEmpresa(e.target.value)} 
                        required 
                        className="h-12 bg-slate-50/50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">WhatsApp</label>
                      <Input 
                        placeholder="(11) 99999-9999" 
                        value={whatsapp} 
                        onChange={(e) => {
                          // Aplica máscara de telefone
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 11) {
                            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                            value = value.replace(/(\d{5})(\d)/, '$1-$2');
                          }
                          setWhatsapp(value);
                        }}
                        maxLength={15}
                        className="h-12 bg-slate-50/50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all rounded-xl"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all rounded-xl" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-11 h-12 bg-slate-50/50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all rounded-xl" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] hover:from-[#2d5a8a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg shadow-[#1e3a5f]/30 transition-all duration-500 rounded-xl text-base" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      {isSignUp ? (
                        <>
                          <Rocket className="mr-2 h-5 w-5" />
                          Começar Agora
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Entrar
                        </>
                      )}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-2">
                  {isSignUp ? "Já tem uma conta?" : "Ainda não tem conta?"}
                </p>
                <Button 
                  variant="ghost" 
                  className="text-[#1e3a5f] hover:text-[#2d5a8a] hover:bg-[#1e3a5f]/5 font-semibold" 
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Fazer Login" : "Criar Conta Grátis"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-6">
            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
          
          {/* Mobile motivational phrase */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-sm text-slate-500 italic">
              "{motivationalPhrases[currentPhrase]}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}