import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, UserPlus, LogIn } from "lucide-react";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false); // Começa na tela de Login
  const [loading, setLoading] = useState(false);

  // Campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState(""); // Essencial para sua tabela clientes_saas
  const [whatsapp, setWhatsapp] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // === CADASTRO ===
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Aqui enviamos os dados extras para o Gatilho (Trigger) pegar
            data: {
              nome_empresa: nomeEmpresa,
              whatsapp: whatsapp,
            },
            // Evita erro de redirect em confirmação de e-mail e funciona em qualquer domínio
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu e-mail para confirmar a conta antes de entrar.",
        });
        setIsSignUp(false); // Volta pro login
      } else {
        // === LOGIN ===
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate("/"); // Manda pro Dashboard
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description:
          error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message,
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
            {isSignUp 
              ? "Cadastre sua imobiliária para gerenciar leads e imóveis." 
              : "Entre com suas credenciais para continuar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            
            {/* Campos extras só aparecem no Cadastro */}
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <Input 
                    placeholder="Nome da Imobiliária" 
                    value={nomeEmpresa} 
                    onChange={(e) => setNomeEmpresa(e.target.value)} 
                    required 
                    className="pl-4"
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    placeholder="WhatsApp (com DDD)" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)} 
                    className="pl-4"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10" 
                type="email" 
                placeholder="seu@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                className="pl-10" 
                type="password" 
                placeholder="Sua senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">Carregando...</span>
              ) : isSignUp ? (
                <span className="flex items-center gap-2"><UserPlus size={18} /> Criar Conta Grátis</span>
              ) : (
                <span className="flex items-center gap-2"><LogIn size={18} /> Entrar no Sistema</span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? "Já tem uma conta?" : "Ainda não tem conta?"}
            </p>
            <Button 
              variant="link" 
              className="text-blue-600 font-semibold p-0 h-auto mt-1"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Fazer Login" : "Criar uma conta agora"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}