import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Shield, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Configuracoes() {
  const { user, clienteSaas, refreshClienteSaas } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState(clienteSaas?.nome_empresa || "");
  
  // Estado para alteração de senha
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [alterandoSenha, setAlterandoSenha] = useState(false);

  const handleSave = async () => {
    if (!clienteSaas?.id) return;
    
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("clientes_saas")
        .update({
          nome_empresa: nomeEmpresa,
        })
        .eq("id", clienteSaas.id);

      if (error) throw error;
      
      await refreshClienteSaas();
      toast.success("Configurações salvas com sucesso!");
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
      const { error } = await supabase.auth.updateUser({
        password: novaSenha
      });

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

  const planoLabel = clienteSaas?.plano === "free" ? "Gratuito" : 
                     clienteSaas?.plano === "starter" ? "Starter" :
                     clienteSaas?.plano === "professional" ? "Professional" :
                     clienteSaas?.plano === "enterprise" ? "Enterprise" : "Gratuito";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Configurações"
        subtitle="Gerencie as configurações da sua conta e do sistema"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Conta
            </CardTitle>
            <CardDescription>
              Informações da sua conta e perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa</Label>
                <Input 
                  id="nome" 
                  value={nomeEmpresa} 
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  placeholder="Sua imobiliária"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Alterar Senha
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
            <Button onClick={handleAlterarSenha} disabled={alterandoSenha || !novaSenha}>
              {alterandoSenha && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano e Faturamento
            </CardTitle>
            <CardDescription>
              Gerencie seu plano e formas de pagamento
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
                    <p className="font-semibold">Plano {planoLabel}</p>
                    <Badge className="bg-primary">
                      {clienteSaas?.status_pagamento === "ativo" ? "Ativo" : "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {clienteSaas?.plano === "free" ? "Funcionalidades básicas" : "Todas as funcionalidades"}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate("/upgrade")}>Upgrade</Button>
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
              Configure como você quer receber alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novos leads</p>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando novos leads forem captados
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios semanais</p>
                <p className="text-sm text-muted-foreground">
                  Resumo de performance por email
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp desconectado</p>
                <p className="text-sm text-muted-foreground">
                  Alertas quando a conexão cair
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
