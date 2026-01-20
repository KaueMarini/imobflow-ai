import { useState, useMemo, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Smartphone,
  QrCode,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Building2,
  Save,
  Loader2,
  Settings,
  Wifi,
  Clock,
  AlertTriangle,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- 1. DEFINIÇÃO MANUAL DA TABELA (Resolve o erro de Typescript) ---
interface ClienteSaasManual {
  id: string;
  user_id: string | null;
  evolution_instance_name: string | null;
  evolution_instance_id: string | null;
  mensagem_saudacao: string | null;
  tonalidade: string | null;
  created_at: string;
}

type Personality = "friendly" | "professional" | "relaxed" | "direct";

const personalities = [
  { id: "friendly", label: "Amigável", description: "Acolhedor e usa emojis ocasionalmente" },
  { id: "professional", label: "Profissional", description: "Tom corporativo e respeitoso" },
  { id: "relaxed", label: "Descontraído", description: "Informal mas educado" },
  { id: "direct", label: "Direto", description: "Objetivo e vai direto ao ponto" },
] as const;

export default function RoboConfig() {
  const { user } = useAuth();
  
  // Estados de controle
  const [loadingData, setLoadingData] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados do QR Code
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados do Timer
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos em segundos
  const [timerActive, setTimerActive] = useState(false);

  // Estados do Formulário
  const [companyName, setCompanyName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [personality, setPersonality] = useState<Personality>("professional");

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setShowQR(false);
            toast.warning("QR Code expirado. Clique em 'Atualizar' para gerar um novo.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Formata o tempo restante
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Dados do banco de dados (para enviar aos webhooks)
  const [dbCompanyName, setDbCompanyName] = useState("");
  const [dbWhatsapp, setDbWhatsapp] = useState("");

  // Busca os dados do Supabase ao carregar
  useEffect(() => {
    async function loadConfig() {
      if (!user) return;
      try {
        setLoadingData(true);
        
        const { data: rawData, error } = await supabase
          .from('clientes_saas' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        const data = rawData as any;

        if (data) {
          // Dados do banco para exibição e webhooks
          setDbCompanyName(data.nome_empresa || "");
          setDbWhatsapp(data.whatsapp || "");
          setCompanyName(data.nome_empresa || "");
          setWhatsappNumber(data.whatsapp || "");
          setGreetingMessage(data.mensagem_saudacao || "");
          
          const savedPersonality = data.tonalidade as Personality;
          if (savedPersonality && personalities.some(p => p.id === savedPersonality)) {
            setPersonality(savedPersonality);
          }
          
          if (data.evolution_instance_id || data.evolution_status === "online") {
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar dados do robô.");
      } finally {
        setLoadingData(false);
      }
    }

    loadConfig();
  }, [user]);

  const previewMessage = useMemo(() => {
    if (greetingMessage) return greetingMessage;
    const greetings: Record<Personality, string> = {
      friendly: `Olá! 😊 Sou o assistente virtual da ${companyName || "imobiliária"}. Como posso ajudar?`,
      professional: `Olá. Sou o assistente virtual da ${companyName || "imobiliária"}. Em que posso ajudar?`,
      relaxed: `Oi! Tudo bem? Sou o assistente da ${companyName || "imobiliária"}. Manda aí, como ajudo?`,
      direct: `Olá. Assistente da ${companyName || "imobiliária"}. Como posso ajudar?`,
    };
    return greetings[personality];
  }, [personality, companyName, greetingMessage]);

  const handleCreateAgent = async () => {
    // Usa dados do banco de dados
    if (!dbCompanyName || !dbWhatsapp) {
      toast.error("Dados da empresa não encontrados no cadastro.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("https://webhook.saveautomatik.shop/webhook/criarInstancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: dbCompanyName,
          telefone: dbWhatsapp,
        }),
      });

      if (!response.ok) throw new Error("Erro no webhook de criação");

      const dataWebhook = await response.json();
      
      if (user) {
         const { error: dbError } = await supabase
          .from('clientes_saas' as any)
          .update({
            evolution_instance_name: dbCompanyName,
            tonalidade: personality,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
         if (dbError) throw dbError;
      }

      // O webhook retorna a URL no campo "message"
      const qrUrl = dataWebhook?.message || (typeof dataWebhook === 'string' ? dataWebhook : dataWebhook.url);
      
      if (qrUrl) {
        setQrCodeUrl(qrUrl);
        setShowQR(true);
        setTimeRemaining(300); // Reset para 5 minutos
        setTimerActive(true);
        toast.success("QR Code gerado! Conecte seu WhatsApp.");
      } else {
        toast.warning("Instância criada, mas sem QR Code retornado.");
      }

    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao criar agente: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshQRCode = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("https://webhook.saveautomatik.shop/webhook/recarregarInstancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: dbCompanyName,
          telefone: dbWhatsapp,
        }),
      });

      if (!response.ok) throw new Error("Erro ao recarregar QR Code");

      const dataWebhook = await response.json();
      const qrUrl = dataWebhook?.message || (typeof dataWebhook === 'string' ? dataWebhook : dataWebhook.url);

      if (qrUrl) {
        setQrCodeUrl(qrUrl);
        setTimeRemaining(300); // Reset para 5 minutos
        setTimerActive(true);
        toast.success("QR Code atualizado!");
      } else {
        toast.error("Não foi possível obter novo QR Code.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar QR Code: " + error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateConfig = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('clientes_saas' as any)
        .update({
          mensagem_saudacao: greetingMessage,
          tonalidade: personality,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmConnection = () => {
    setIsConnected(true);
    setShowQR(false);
    setTimerActive(false);
    toast.success("WhatsApp conectado com sucesso!");
  };

  const handleCancelConnection = () => {
    setShowQR(false);
    setTimerActive(false);
    setQrCodeUrl(null);
    setTimeRemaining(300);
  };

  if (loadingData) {
    return <div className="flex h-screen justify-center items-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader
        title="Configuração do Agente"
        subtitle={isConnected ? "Gerencie o comportamento do seu robô" : "Conecte seu WhatsApp para iniciar"}
      />

      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal: Formulário */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Card */}
          <Card className={cn("border-l-4", isConnected ? "border-l-green-500" : "border-l-orange-500")}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnected ? <CheckCircle className="text-green-500 h-8 w-8" /> : <Bot className="text-orange-500 h-8 w-8" />}
                <div>
                  <h3 className="font-bold text-lg">{isConnected ? "Robô Ativo" : "Configuração Inicial"}</h3>
                  <p className="text-muted-foreground text-sm">
                    {isConnected ? "Seu agente está respondendo clientes." : "Defina o perfil e conecte o WhatsApp."}
                  </p>
                </div>
              </div>
              <Badge variant={isConnected ? "default" : "outline"} className={isConnected ? "bg-green-600" : ""}>
                {isConnected ? "ONLINE" : "OFFLINE"}
              </Badge>
            </CardContent>
          </Card>

          {/* Dados da Empresa */}
          <Card className={cn(isConnected && "opacity-80 bg-muted/20")}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Building2 size={18}/> Identidade</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome do Corretor</Label>
                <Input 
                  value={companyName} 
                  onChange={e => setCompanyName(e.target.value)} 
                  disabled={isConnected || showQR} 
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (com DDD)</Label>
                <Input 
                  value={whatsappNumber} 
                  onChange={e => setWhatsappNumber(e.target.value)} 
                  disabled={isConnected || showQR} 
                  placeholder="Ex: 5511999999999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Comportamento */}
          <Card className="border-blue-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><MessageSquare size={18}/> Comportamento da IA</CardTitle>
              <CardDescription>Você pode alterar isso a qualquer momento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <Label>Tonalidade / Personalidade</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {personalities.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPersonality(p.id)}
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 text-center transition-all hover:bg-accent",
                        personality === p.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200"
                      )}
                    >
                      <div className="font-semibold text-sm">{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            {!isConnected && !showQR ? (
              <Button onClick={handleCreateAgent} disabled={isSaving} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                {isSaving ? <Loader2 className="animate-spin mr-2"/> : <QrCode className="mr-2 h-5 w-5"/>}
                Gerar QR Code e Conectar
              </Button>
            ) : isConnected ? (
              <Button onClick={handleUpdateConfig} disabled={isSaving} size="lg" className="w-full md:w-auto">
                {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-5 w-5"/>}
                Salvar Alterações
              </Button>
            ) : null}
          </div>
        </div>

        {/* Coluna Lateral: QR Code e Instruções */}
        <div className="space-y-6">
          {showQR && !isConnected && (
            <Card className="border-2 border-green-400 bg-gradient-to-b from-green-50/50 to-background">
              <CardHeader className="pb-3 text-center border-b">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg text-green-700">Conectar WhatsApp</CardTitle>
                </div>
                <CardDescription>
                  Siga os passos abaixo para vincular seu número à plataforma Fly.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-4">
                {/* Aviso Importante */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">ATENÇÃO:</p>
                      <p className="text-xs text-amber-700 mt-1">
                        Mantenha o WhatsApp aberto em seu celular até que a conexão seja 100% concluída. 
                        Não feche o aplicativo ou bloqueie a tela durante o processo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instruções Passo a Passo */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground">Instruções:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                      <span className="text-sm">Abra o WhatsApp no seu celular</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                      <span className="text-sm">Vá em Configurações {">"} Aparelhos conectados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                      <span className="text-sm">Toque em Conectar um aparelho</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                      <span className="text-sm">Aponte para o QR Code abaixo</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center py-4">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48 border-2 border-gray-200 rounded-lg shadow-sm bg-white p-2" 
                    />
                  ) : (
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                      <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Timer e Status */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className={cn(
                      "h-5 w-5",
                      timeRemaining <= 60 ? "text-red-500" : "text-blue-500"
                    )} />
                    <span className={cn(
                      "text-xl font-mono font-bold",
                      timeRemaining <= 60 ? "text-red-500" : "text-foreground"
                    )}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-muted-foreground">Servidor Online</span>
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  O QR Code expira em 5 minutos por segurança.
                </p>

                {/* Botões de Ação */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button 
                    onClick={handleConfirmConnection} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tudo pronto! Já conectei
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleRefreshQRCode}
                      disabled={isRefreshing}
                      className="flex-1"
                    >
                      {isRefreshing ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Atualizar
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      onClick={handleCancelConnection}
                      className="flex-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
