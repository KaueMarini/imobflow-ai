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
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Personality = "friendly" | "professional" | "relaxed" | "direct";

const personalities = [
  { id: "friendly", label: "Amigável", description: "Acolhedor e usa emojis ocasionalmente" },
  { id: "professional", label: "Profissional", description: "Tom corporativo e respeitoso" },
  { id: "relaxed", label: "Descontraído", description: "Informal mas educado" },
  { id: "direct", label: "Direto", description: "Objetivo e vai direto ao ponto" },
] as const;

export default function RoboConfig() {
  const { clienteSaas, user, refreshClienteSaas } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  // Verifica se o robô já foi configurado (instance_name preenchido)
  const isRoboConfigured = Boolean(clienteSaas?.instance_name);
  
  // Verifica se é plano pro
  const isPlanoPro = clienteSaas?.plano === "pro" || clienteSaas?.plano === "profissional";

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [agentName, setAgentName] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [personality, setPersonality] = useState<Personality>("professional");

  // Carrega dados do cliente ao montar
  useEffect(() => {
    if (clienteSaas) {
      setCompanyName(clienteSaas.nome_empresa || "");
      setWhatsappNumber(clienteSaas.telefone_admin || "");
      setGreetingMessage(clienteSaas.mensagem_boas_vindas || "");
      setIsConnected(Boolean(clienteSaas.instance_name));
      setIsLoading(false);
    } else if (user) {
      setIsLoading(false);
    }
  }, [clienteSaas, user]);

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
7. Finalize as conversas de forma educada e profissional.`;

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

  // Salva apenas mensagem de saudação e personalidade (para clientes que já configuraram)
  const handleSaveEditableFields = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const sb = supabase as any;
      const { error } = await sb
        .from("clientes_saas")
        .update({
          mensagem_boas_vindas: greetingMessage,
          mensagem_saudacao: greetingMessage,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      await refreshClienteSaas();
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!companyName || !whatsappNumber) {
      toast.error("Preencha os campos obrigatórios: Nome da Imobiliária e WhatsApp");
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    setIsSaving(true);

    try {
      const generatedPrompt = generatePrompt();
      const instanceName = `robo_${companyName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
      const saudacao = greetingMessage || previewMessage;

      // Primeiro salva os dados no Supabase externo
      const sb = supabase as any;
      const { error: updateError } = await sb
        .from("clientes_saas")
        .update({
          nome_empresa: companyName,
          telefone_admin: whatsappNumber,
          mensagem_boas_vindas: saudacao,
          mensagem_saudacao: saudacao,
          instance_name: instanceName,
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Erro ao salvar no Supabase:", updateError);
        throw updateError;
      }

      // Chama o webhook para criar o agente
      try {
        const response = await fetch("https://webhook.saveautomatik.shop/webhook/criarWorkflow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empresa: companyName,
            prompt: generatedPrompt,
            telefone: whatsappNumber,
            instance_name: instanceName,
          }),
        });

        if (!response.ok) {
          console.warn("Webhook criarWorkflow não retornou sucesso, mas dados foram salvos");
        }
      } catch (webhookError) {
        console.warn("Erro ao chamar webhook criarWorkflow:", webhookError);
        // Continua mesmo se o webhook falhar - dados já foram salvos
      }

      await refreshClienteSaas();
      toast.success("Agente configurado! Agora conecte seu WhatsApp.");
      
      // Inicia automaticamente a geração do QR Code
      await handleGenerateQR();
    } catch (error) {
      console.error("Erro ao criar agente:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsSaving(false);
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
          empresa: companyName || clienteSaas?.nome_empresa,
          telefone: whatsappNumber || clienteSaas?.telefone_admin,
          instance_name: clienteSaas?.instance_name,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      
      if (data.url || data.qrcode || data.qr) {
        const qrUrl = data.url || data.qrcode || data.qr;
        setQrCodeUrl(qrUrl);
        setShowQR(true);
        setTimeRemaining(300);
        setTimerActive(true);
        toast.success("QR Code gerado! Escaneie em até 5 minutos.");
      } else if (data.base64) {
        setQrCodeUrl(`data:image/png;base64,${data.base64}`);
        setShowQR(true);
        setTimeRemaining(300);
        setTimerActive(true);
        toast.success("QR Code gerado! Escaneie em até 5 minutos.");
      } else {
        // Se não retornou QR, mostra o modal mesmo assim para tentar novamente
        setShowQR(true);
        toast.info("Aguardando QR Code... Clique em 'Gerar Novo QR' se não aparecer.");
      }
    } catch (error) {
      console.error("Erro ao gerar QR Code:", error);
      setShowQR(true);
      toast.error("Erro ao conectar. Tente gerar o QR Code novamente.");
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Não é plano pro
  if (!isPlanoPro) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title="Configuração do Agente"
          subtitle="Configure seu assistente imobiliário de IA"
        />
        <div className="p-6 max-w-2xl mx-auto">
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10">
                  <Lock className="h-7 w-7 text-warning" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Recurso Exclusivo do Plano Pro</h2>
                  <p className="text-muted-foreground mt-1">
                    O assistente de IA está disponível apenas para clientes do plano Profissional.
                    Entre em contato para fazer o upgrade do seu plano.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Já configurou o robô - mostra tela de edição limitada
  if (isRoboConfigured) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          title="Configuração do Agente"
          subtitle="Gerencie seu assistente imobiliário de IA"
        />

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Status do Robô */}
          <Card className="border-success/20 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
                  <Bot className="h-7 w-7 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-success">Robô Configurado</h2>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Ativo
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Seu assistente "{agentName || "IA"}" está atendendo na {companyName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Bloqueados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-muted-foreground" />
                Dados da Imobiliária
              </CardTitle>
              <CardDescription>
                Estes campos não podem ser alterados após a configuração inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Imobiliária</Label>
                  <Input value={companyName} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp de Atendimento</Label>
                  <Input value={whatsappNumber} disabled className="bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campos Editáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comunicação
              </CardTitle>
              <CardDescription>
                Você pode ajustar a mensagem de saudação e tonalidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="greetingMessage">Mensagem de Saudação</Label>
                <Textarea
                  id="greetingMessage"
                  placeholder="Ex: Olá! Bem-vindo à Imobiliária Central..."
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  className="min-h-[100px]"
                />
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

              <Button
                onClick={handleSaveEditableFields}
                disabled={isSaving}
                className="w-full gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Preview da Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-xl p-4">
                <div className="flex justify-start">
                  <div className="bg-card border rounded-2xl rounded-bl-md px-4 py-2 max-w-[85%]">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {agentName || "IA"} ({personalityLabel}):
                    </p>
                    <p className="text-sm">{previewMessage}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Primeira configuração do robô
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
                    <h2 className="text-xl font-bold">Configuração Inicial</h2>
                    <p className="text-muted-foreground">
                      Configure o assistente de IA para sua imobiliária. Após salvar, apenas a mensagem de saudação e tonalidade poderão ser alteradas.
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
                  Informações básicas sobre sua imobiliária (não poderão ser alteradas depois)
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

            {/* QR Code Section - Aparece após clicar em criar */}
            {showQR && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-primary" />
                    Conectar WhatsApp
                  </CardTitle>
                  <CardDescription>
                    Escaneie o QR Code com seu WhatsApp para ativar o robô
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {timerActive && timeRemaining > 0 && (
                    <div className="flex items-center justify-center gap-2 text-warning">
                      <Clock className="h-4 w-4" />
                      <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                      <span className="text-sm text-muted-foreground">restantes</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-background rounded-xl border">
                    {qrCodeUrl ? (
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code WhatsApp" 
                        className="w-64 h-64 object-contain"
                      />
                    ) : isGenerating ? (
                      <div className="w-64 h-64 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="w-64 h-64 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl">
                        <QrCode className="h-16 w-16 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground text-center">
                          Clique no botão abaixo para gerar o QR Code
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleGenerateQR}
                      disabled={isGenerating}
                      className="flex-1 gap-2"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      {isGenerating ? "Gerando..." : "Gerar Novo QR"}
                    </Button>
                    <Button
                      onClick={handleConfirmConnection}
                      className="flex-1 gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Já Escaneei
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Após escanear, clique em "Já Escaneei" para confirmar a conexão
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Create Agent Button */}
            {!showQR && (
              <Button
                size="lg"
                className="w-full gap-2 h-14 text-lg"
                onClick={handleCreateAgent}
                disabled={isSaving || !companyName || !whatsappNumber}
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                {isSaving ? "Criando Agente..." : "Criar Agente e Conectar WhatsApp"}
              </Button>
            )}
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
