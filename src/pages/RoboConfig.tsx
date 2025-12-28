import { useState, useMemo, useEffect, useCallback } from "react";
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
  Sparkles,
  MessageSquare,
  Building2,
  Clock,
  AlertCircle,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Personality = "friendly" | "professional" | "relaxed" | "direct";

const personalities = [
  { id: "friendly", label: "Amigável", description: "Acolhedor e usa emojis ocasionalmente" },
  { id: "professional", label: "Profissional", description: "Tom corporativo e respeitoso" },
  { id: "relaxed", label: "Descontraído", description: "Informal mas educado" },
  { id: "direct", label: "Direto", description: "Objetivo e vai direto ao ponto" },
] as const;

export default function RoboConfig() {
  const [isConnected, setIsConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer effect for 5 minutes countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setShowQR(false);
            setQrCodeUrl(null);
            toast.error("Tempo expirado! Gere um novo QR Code para conectar.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Form state - Simplified for real estate
  const [companyName, setCompanyName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [personality, setPersonality] = useState<Personality>("professional");

  const personalityLabel = useMemo(() => {
    return personalities.find(p => p.id === personality)?.label || "Profissional";
  }, [personality]);

  const generatePrompt = () => {
    const prompt = `Você é ${agentName || "o assistente virtual"} da imobiliária ${companyName || "nossa imobiliária"}.

SEGMENTO: Imobiliário (Compra, Venda e Aluguel de Imóveis)

MENSAGEM DE SAUDAÇÃO:
${greetingMessage || `Olá! Sou ${agentName || "o assistente"} da ${companyName || "imobiliária"}. Como posso ajudá-lo hoje?`}

PERSONALIDADE:
Você deve ser ${personalityLabel.toLowerCase()} em todas as interações. ${
      personality === "friendly" ? "Use emojis ocasionalmente e seja acolhedor." :
      personality === "professional" ? "Mantenha um tom corporativo e respeitoso." :
      personality === "relaxed" ? "Seja informal mas educado, use gírias leves." :
      "Seja objetivo e vá direto ao ponto sem rodeios."
    }

ESPECIALIDADES:
- Atendimento para compra de imóveis
- Atendimento para venda de imóveis
- Atendimento para aluguel de imóveis
- Agendamento de visitas
- Informações sobre imóveis disponíveis
- Qualificação de leads interessados

INSTRUÇÕES GERAIS:
1. Sempre cumprimente o cliente usando a mensagem de saudação configurada.
2. Identifique rapidamente a necessidade do cliente (comprar, vender ou alugar).
3. Colete informações importantes: tipo de imóvel, região de interesse, faixa de preço, número de quartos.
4. Ofereça agendar uma visita quando apropriado.
5. Se não souber algo específico, diga que vai encaminhar para um corretor especializado.
6. Colete informações de contato (nome, telefone, e-mail) para follow-up.
7. Finalize as conversas de forma educada e profissional.

PERGUNTAS FREQUENTES DO RAMO IMOBILIÁRIO:
- Quais documentos preciso para comprar/alugar?
- Vocês trabalham com financiamento?
- Qual a comissão de vocês?
- Posso agendar uma visita?
- Vocês têm imóveis na região X?`;

    return prompt;
  };

  const previewMessage = useMemo(() => {
    if (greetingMessage) {
      return greetingMessage;
    }
    
    const greetings: Record<Personality, string> = {
      friendly: `Olá! 😊 Que bom ter você aqui! Sou ${agentName || "o assistente"} da ${companyName || "nossa imobiliária"}. Está procurando um imóvel? Posso ajudar!`,
      professional: `Olá, seja bem-vindo. Sou ${agentName || "o assistente"} da ${companyName || "nossa imobiliária"}. Em que posso ajudá-lo?`,
      relaxed: `E aí! Tudo bem? Sou ${agentName || "o assistente"} da ${companyName || "imobiliária"}. Bora encontrar o imóvel ideal pra você?`,
      direct: `Olá. ${agentName || "Assistente"} da ${companyName || "imobiliária"}. Compra, venda ou aluguel?`,
    };
    return greetings[personality];
  }, [personality, companyName, agentName, greetingMessage]);

  const handleCreateAgent = async () => {
    if (!companyName || !whatsappNumber) {
      toast.error("Preencha os campos obrigatórios: Nome da Imobiliária e WhatsApp");
      return;
    }

    setIsCreatingAgent(true);

    try {
      const generatedPrompt = generatePrompt();

      const response = await fetch("https://webhook.saveautomatik.shop/webhook/criarWorkflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empresa: companyName,
          prompt: generatedPrompt,
          telefone: whatsappNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar agente");
      }

      setAgentCreated(true);
      toast.success("Agente de IA criado com sucesso! Agora conecte seu WhatsApp.");
    } catch (error) {
      console.error("Erro ao criar agente:", error);
      toast.error("Erro ao criar agente. Tente novamente.");
    } finally {
      setIsCreatingAgent(false);
    }
  };

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch("https://webhook.saveautomatik.shop/webhook/criarInstancia", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empresa: companyName,
          telefone: whatsappNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar QR Code");
      }

      const data = await response.json();
      
      if (data.url) {
        setQrCodeUrl(data.url);
        setShowQR(true);
        setTimeRemaining(300); // 5 minutes = 300 seconds
        setTimerActive(true);
        toast.success("QR Code gerado! Escaneie em até 5 minutos.");
      } else {
        throw new Error("URL do QR Code não retornada");
      }
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      toast.error("Erro ao gerar QR Code. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmConnection = () => {
    setIsConnected(true);
    setShowQR(false);
    setTimerActive(false);
    setQrCodeUrl(null);
    toast.success("WhatsApp conectado com sucesso! Seu robô está ativo.");
  };

  // If agent is created, show connection screen
  if (agentCreated) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title="Conectar WhatsApp"
          subtitle="Conecte seu WhatsApp para ativar o agente de IA"
        />

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Success Banner */}
          <Card className="border-success/20 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-success">Agente de IA Criado!</p>
                  <p className="text-sm text-muted-foreground">
                    Seu agente "{agentName || "Assistente"}" para {companyName} está pronto. Agora conecte seu WhatsApp.
                  </p>
                </div>
              </div>
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
                Escaneie o QR Code com o WhatsApp Business para ativar o robô
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
                          ? "Seu WhatsApp está online e o robô está ativo!"
                          : "Escaneie o QR Code para conectar"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Número WhatsApp</Label>
                    <Input
                      value={whatsappNumber}
                      disabled
                      className="max-w-sm bg-muted"
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
                <div className="flex-shrink-0 space-y-4">
                  <div
                    className={cn(
                      "w-64 h-64 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden",
                      showQR ? "border-primary bg-card" : "border-border bg-muted/30"
                    )}
                  >
                    {showQR && qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code WhatsApp" 
                        className="w-full h-full object-contain p-2"
                      />
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

                  {/* Timer */}
                  {showQR && timerActive && (
                    <div className="text-center space-y-3">
                      <div className={cn(
                        "flex items-center justify-center gap-2 text-lg font-mono font-bold",
                        timeRemaining <= 60 ? "text-destructive" : "text-primary"
                      )}>
                        <Clock className="h-5 w-5" />
                        <span>{formatTime(timeRemaining)}</span>
                      </div>
                      {timeRemaining <= 60 && (
                        <p className="text-xs text-destructive flex items-center justify-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Tempo quase esgotando!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Connection Instructions */}
                  {showQR && !isConnected && (
                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="pt-4 space-y-3">
                        <p className="text-sm font-medium">Como conectar:</p>
                        <ol className="text-xs text-muted-foreground space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                            Abra o WhatsApp Business no seu celular
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                            Vá em Configurações → Dispositivos Conectados
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                            Clique em "Conectar um Dispositivo"
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                            Escaneie este QR Code
                          </li>
                        </ol>
                        
                        <Separator className="my-3" />
                        
                        <Button 
                          onClick={handleConfirmConnection} 
                          className="w-full gap-2"
                          variant="default"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Já Conectei
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connected Success */}
          {isConnected && (
            <Card className="border-success/20 bg-success/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                    <Bot className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-success">Robô Ativo!</p>
                    <p className="text-sm text-muted-foreground">
                      Seu assistente imobiliário está pronto para atender seus clientes 24/7.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Configuração do Agente"
        subtitle="Configure seu assistente imobiliário de IA"
      />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Home className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Configuração de Inteligência</h2>
                    <p className="text-muted-foreground">
                      Configure o assistente de IA para sua imobiliária
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dados da Imobiliária
                </CardTitle>
                <CardDescription>
                  Informações básicas sobre sua imobiliária
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Imobiliária *</Label>
                    <Input
                      id="companyName"
                      placeholder="Ex: Imobiliária Central"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp de Atendimento *</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="Ex: 11999999999"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agentName">Nome do Agente de IA</Label>
                  <Input
                    id="agentName"
                    placeholder="Ex: Sofia, Carlos, Assistente..."
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Este será o nome que a IA usará para se apresentar aos clientes
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Greeting & Personality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comunicação
                </CardTitle>
                <CardDescription>
                  Defina como o agente irá se comunicar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="greetingMessage">Mensagem de Saudação</Label>
                  <Textarea
                    id="greetingMessage"
                    placeholder="Ex: Olá! Bem-vindo à Imobiliária Central. Sou a Sofia, sua assistente virtual. Como posso ajudá-lo hoje?"
                    value={greetingMessage}
                    onChange={(e) => setGreetingMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Esta será a primeira mensagem que os clientes receberão
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Tonalidade da IA</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {personalities.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setPersonality(p.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          personality === p.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Agent Button */}
            <Button
              size="lg"
              className="w-full gap-2 h-14 text-lg"
              onClick={handleCreateAgent}
              disabled={isCreatingAgent || !companyName || !whatsappNumber}
            >
              {isCreatingAgent ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {isCreatingAgent ? "Criando Agente..." : "Criar Agente e Conectar WhatsApp"}
            </Button>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Preview ao Vivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-xl p-4 space-y-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2 max-w-[85%]">
                      <p className="text-sm">Oi! Gostaria de saber mais sobre imóveis disponíveis.</p>
                    </div>
                  </div>

                  {/* Bot Response */}
                  <div className="flex justify-start">
                    <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-2 max-w-[85%]">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        {agentName || "IA"} ({personalityLabel}):
                      </p>
                      <p className="text-sm">{previewMessage}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Tips */}
                <div className="space-y-3">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-primary" />
                    O agente poderá ajudar com:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Atendimento para compra de imóveis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Atendimento para aluguel
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Agendamento de visitas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Qualificação de leads
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
