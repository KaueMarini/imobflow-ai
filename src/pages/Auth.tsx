import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            {isSignUp ? "Criar Conta ImobFlow" : "Acessar Painel"}
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Cadastre sua imobiliária e centralize seus leads." : "Entre com suas credenciais."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <Input 
                    placeholder="Nome da Imobiliária" 
                    value={nomeEmpresa} 
                    onChange={(e) => setNomeEmpresa(e.target.value)} 
                    required 
                    className="h-11"
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    placeholder="WhatsApp (ex: 11999999999)" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    className="h-11"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input className="pl-10 h-11" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input className="pl-10 h-11" type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-semibold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Criar Conta" : "Entrar")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="link" className="text-blue-600 font-semibold" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Já tenho conta" : "Criar conta agora"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
