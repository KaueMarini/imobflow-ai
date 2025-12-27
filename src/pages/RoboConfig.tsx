import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Smartphone,
  QrCode,
  CheckCircle,
  XCircle,
  RefreshCw,
  Save,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoboConfig() {
  const [isConnected, setIsConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQR = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowQR(true);
    }, 1500);
  };

  const handleConnect = () => {
    setIsConnected(true);
    setShowQR(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Configurar Robô"
        subtitle="Configure sua integração com WhatsApp via Evolution API"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Configurações do Robô
            </CardTitle>
            <CardDescription>
              Personalize as mensagens automáticas do seu assistente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da Empresa</Label>
              <Input
                id="empresa"
                placeholder="Ex: Imobiliária Prime"
                defaultValue="Imobiliária João da Imob"
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boas-vindas">Mensagem de Boas-vindas</Label>
              <Textarea
                id="boas-vindas"
                placeholder="Digite a mensagem que será enviada automaticamente para novos leads..."
                className="min-h-[100px]"
                defaultValue="Olá! 👋 Sou o assistente virtual da Imobiliária João da Imob. Estou aqui para ajudar você a encontrar o imóvel dos seus sonhos! Me conta, você está procurando um imóvel para comprar ou alugar?"
              />
              <p className="text-sm text-muted-foreground">
                Use variáveis como {"{nome}"} para personalizar a mensagem.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fallback">Mensagem de Fallback</Label>
              <Textarea
                id="fallback"
                placeholder="Mensagem quando o robô não entender..."
                className="min-h-[80px]"
                defaultValue="Desculpe, não entendi bem. Você poderia reformular sua pergunta? Ou se preferir, posso transferir você para um de nossos corretores."
              />
            </div>

            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        {/* WhatsApp Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Conexão WhatsApp
            </CardTitle>
            <CardDescription>
              Conecte sua instância do WhatsApp para ativar o robô
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Status */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      isConnected ? "bg-success/10" : "bg-destructive/10"
                    )}
                  >
                    {isConnected ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">
                      Status:{" "}
                      <Badge
                        variant="outline"
                        className={cn(
                          isConnected
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {isConnected ? "Conectado" : "Desconectado"}
                      </Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isConnected
                        ? "Seu WhatsApp está online e pronto para uso"
                        : "Escaneie o QR Code para conectar"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Nome da Instância</Label>
                  <Input
                    placeholder="Ex: imob-joao-principal"
                    defaultValue="imob-joao-principal"
                    className="max-w-sm"
                  />
                </div>

                <div className="flex gap-2">
                  {!isConnected && (
                    <Button
                      onClick={handleGenerateQR}
                      disabled={isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <QrCode className="h-4 w-4" />
                      )}
                      {isGenerating ? "Gerando..." : "Gerar QR Code"}
                    </Button>
                  )}
                  {isConnected && (
                    <Button
                      variant="outline"
                      onClick={() => setIsConnected(false)}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Desconectar
                    </Button>
                  )}
                </div>
              </div>

              {/* QR Code Area */}
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "w-64 h-64 rounded-xl border-2 border-dashed flex items-center justify-center",
                    showQR ? "border-primary bg-card" : "border-border bg-muted/30"
                  )}
                >
                  {showQR ? (
                    <div className="text-center space-y-3">
                      {/* Simulated QR Code */}
                      <div className="w-48 h-48 bg-foreground mx-auto rounded-lg p-2">
                        <div className="w-full h-full bg-background rounded grid grid-cols-8 gap-0.5 p-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "rounded-sm",
                                Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleConnect}
                        className="gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Simular Conexão
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2 p-4">
                      <QrCode className="h-12 w-12 mx-auto text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        {isConnected
                          ? "WhatsApp conectado!"
                          : "QR Code aparecerá aqui"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <MessageSquare className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1.247</p>
                  <p className="text-sm text-muted-foreground">Mensagens hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Resolvidos pelo robô</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <RefreshCw className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.3s</p>
                  <p className="text-sm text-muted-foreground">Tempo médio resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
