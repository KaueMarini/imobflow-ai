import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, Loader2, Shield, Zap, Users } from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

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
        navigate("/");
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/90 via-[#1e3a5f]/80 to-[#0f1f33]/95" />
        
        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">FlyImob</span>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Blindagem de Lead.<br />
                <span className="text-blue-300">Comissão Protegida.</span>
              </h1>
              <p className="text-lg text-white/70 max-w-md">
                O sistema que transforma corretores em máquinas de fechamento com IA e Inventário Infinito.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span>Leads 100% blindados</span>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <span>IA atendendo 24/7</span>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span>40.000+ imóveis mapeados</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-white/50 text-sm">
            © 2025 FlyImob. A revolução da inteligência imobiliária.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1e3a5f]">FlyImob</span>
          </div>

          <Card className="border-0 shadow-2xl shadow-slate-200/50">
            <CardHeader className="text-center space-y-3 pb-8">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1e3a5f]/30">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                {isSignUp ? "Criar Conta" : "Bem-vindo de volta"}
              </CardTitle>
              <CardDescription className="text-slate-500">
                {isSignUp 
                  ? "Cadastre sua imobiliária e proteja suas comissões." 
                  : "Entre para acessar seu painel de controle."}
              </CardDescription>
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
                        className="h-12 bg-slate-50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all"
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
                        className="h-12 bg-slate-50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <Input 
                      className="pl-11 h-12 bg-slate-50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all" 
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
                      className="pl-11 h-12 bg-slate-50 border-slate-200 focus:border-[#1e3a5f] focus:ring-[#1e3a5f]/20 transition-all" 
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
                  className="w-full h-12 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8a] hover:from-[#2d5a8a] hover:to-[#1e3a5f] text-white font-semibold shadow-lg shadow-[#1e3a5f]/30 transition-all duration-300" 
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    isSignUp ? "Criar Conta" : "Entrar"
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
        </div>
      </div>
    </div>
  );
}
