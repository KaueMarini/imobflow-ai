import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Shield, Loader2, Lock, Building2, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Configuracoes() {
  const { user, clienteSaas, refreshClienteSaas } = useAuth();
  const navigate = useNavigate();
  
  // Estados Gerais
  const [saving, setSaving] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  
  // Estado Senha
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  // Estado Imobiliária (Enterprise)
  const [codigoVinculo, setCodigoVinculo] = useState("");
  const [linking, setLinking] = useState(false);
  const [imobiliariaNome, setImobiliariaNome] = useState("");

  // Sincronizar estado local com dados do contexto
  useEffect(() => {
    if (clienteSaas) {
      setNomeEmpresa(clienteSaas.nome_empresa || "");
      
      // TRUQUE 1: Acessar propriedade que o TS não conhece usando (clienteSaas as any)
      const imobId = (clienteSaas as any).imobiliaria_id;
      
      if (imobId) {
         fetchImobiliariaNome(imobId);
      }
    }
  }, [clienteSaas]);

  const fetchImobiliariaNome = async (id: string) => {
    try {
      // TRUQUE 2: (supabase as any) libera acesso a tabela 'imobiliarias' que não tá no types.ts
      const { data, error } = await (supabase as any)
        .from('imobiliarias')
        .select('nome')
        .eq('id', id)
        .single();
      
      if (!error && data) {
        setImobiliariaNome(data.nome);
      }
    } catch (err) {
      console.error("Erro ao buscar imobiliária", err);
    }
  };

  const handleSave = async () => {
    if (!clienteSaas?.id) return;
    
    setSaving(true);
    try {
      // TRUQUE 3: Já estávamos usando aqui, mantemos.
      const { error } = await (supabase as any)
        .from("clientes_saas")
        .update({ nome_empresa: nomeEmpresa })
        .eq("id", clienteSaas.id);

      if (error) throw error;
      
      await refreshClienteSaas();
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  const handleAlterarSenha = async () => {
    if (novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    setAlterandoSenha(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      
      toast.success("Senha alterada com sucesso!");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao alterar senha");
    } finally {
      setAlterandoSenha(false);
    }
  };

  const handleVincularImobiliaria = async () => {
    if (!codigoVinculo) return;
    setLinking(true);
    try {
        // TRUQUE 4: (supabase as any) permite chamar a função RPC nova
        const { data, error } = await (supabase as any).rpc('vincular_imobiliaria', { 
            codigo_input: codigoVinculo.trim() 
        });

        if (error) throw error;

        // TRUQUE 5: Forçamos o data ser 'any' para ler .success e .message sem erro
        const response = data as any;

        if (response && response.success) {
            toast.success(response.message);
            await refreshClienteSaas(); 
            setCodigoVinculo("");
        } else {
            toast.error(response?.message || "Código inválido");
        }
    } catch (error: any) {
        console.error(error);
        toast.error("Erro ao vincular imobiliária. Verifique o código.");
    } finally {
        setLinking(false);
    }
  };

  const planoLabel = clienteSaas?.plano === "free" ? "Gratuito" : 
                     clienteSaas?.plano === "starter" ? "Starter" :
                     clienteSaas?.plano === "professional" ? "Professional" : "Enterprise";

  // TRUQUE 6: Acessando role e imobiliaria_id via any
  const userRole = (clienteSaas as any)?.role || 'corretor';
  const isLinked = !!(clienteSaas as any)?.imobiliaria_id;

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader
        title="Configurações"
        subtitle="Gerencie sua conta e preferências do sistema"
      />

      <div className="p-6 space-y-6 max-w-4xl container mx-auto">
        
        {/* === CARD IMOBILIÁRIA === */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Building2 className="h-5 w-5" />
              Imobiliária & Equipe
            </CardTitle>
            <CardDescription>
              Vincule sua conta a uma imobiliária para compartilhar dados com a gerência.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLinked ? (
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{imobiliariaNome || "Minha Imobiliária"}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="capitalize">{userRole}</Badge>
                                <span className="text-xs text-muted-foreground">Vinculado</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
                        Você ainda não faz parte de nenhuma equipe. Solicite o <strong>Código de Vínculo</strong> ao seu gerente.
                    </div>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="codigo">Código da Imobiliária (ID)</Label>
                            <Input 
                                id="codigo" 
                                placeholder="Ex: LOPES-SP-2026" 
                                value={codigoVinculo}
                                onChange={e => setCodigoVinculo(e.target.value.toUpperCase())}
                            />
                        </div>
                        <Button onClick={handleVincularImobiliaria} disabled={linking || !codigoVinculo}>
                            {linking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Entrar na Equipe
                        </Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Pessoais
            </CardTitle>
            <CardDescription>
              Informações básicas do seu perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome de Exibição / Empresa</Label>
                <Input 
                  id="nome" 
                  value={nomeEmpresa} 
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  placeholder="Seu nome ou da sua marca"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email de Acesso</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
             <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>
              Atualize sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input 
                  id="novaSenha" 
                  type="password"
                  value={novaSenha} 
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmarSenha" 
                  type="password"
                  value={confirmarSenha} 
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mt-4">
                <Button variant="outline" onClick={handleAlterarSenha} disabled={alterandoSenha || !novaSenha}>
                {alterandoSenha && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Atualizar Senha
                </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano Atual
            </CardTitle>
            <CardDescription>
              Gerencie sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{planoLabel}</p>
                    <Badge className={clienteSaas?.status_pagamento === "ativo" ? "bg-emerald-500" : "bg-yellow-500"}>
                      {clienteSaas?.status_pagamento === "ativo" ? "Ativo" : "Pendente/Gratuito"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {clienteSaas?.plano === "free" 
                        ? "Upgrade para desbloquear robô ilimitado" 
                        : "Você tem acesso total ao sistema"}
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate("/upgrade")}>Ver Planos</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Personalize seus alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novos Leads (Push)</p>
                <p className="text-sm text-muted-foreground">Alertar na tela quando chegar lead novo</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Status do Robô</p>
                <p className="text-sm text-muted-foreground">Alertar se o WhatsApp desconectar</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}