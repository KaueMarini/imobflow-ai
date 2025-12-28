import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  CreditCard,
  Bell,
  Shield,
} from "lucide-react";

export default function Configuracoes() {
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
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" defaultValue="João da Imob" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="joao@imob.com.br" />
              </div>
            </div>
            <Button>Salvar Alterações</Button>
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
                    <p className="font-semibold">Plano Professional</p>
                    <Badge className="bg-primary">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    R$ 297/mês • Renovação em 15/02/2025
                  </p>
                </div>
              </div>
              <Button variant="outline">Upgrade</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">500</p>
                <p className="text-xs text-muted-foreground">Leads/mês</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">247</p>
                <p className="text-xs text-muted-foreground">Usados</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">∞</p>
                <p className="text-xs text-muted-foreground">Mensagens</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">5</p>
                <p className="text-xs text-muted-foreground">Usuários</p>
              </div>
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