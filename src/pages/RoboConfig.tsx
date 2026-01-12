import { useState, useMemo, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Loader2
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

  // Estados do Formulário
  const [companyName, setCompanyName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [personality, setPersonality] = useState<Personality>("professional");

  // Busca os dados do Supabase ao carregar
  useEffect(() => {
    async function loadConfig() {
      if (!user) return;
      try {
        setLoadingData(true);
        
        // --- 2. O TRUQUE DO CASTING (as any) E DEPOIS TIPAGEM MANUAL ---
        // Dizemos pro TS ignorar a busca, mas tratamos o resultado como nossa interface manual
        const { data: rawData, error } = await supabase
          .from('clientes_saas' as any)
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        // Aqui convertemos o dado "bruto" para nossa interface
        const data = rawData as unknown as ClienteSaasManual | null;

        if (data) {
          setCompanyName(data.evolution_instance_name || "");
          setGreetingMessage(data.mensagem_saudacao || "");
          
          // Verifica se a tonalidade salva é válida
          const savedPersonality = data.tonalidade as Personality;
          if (savedPersonality && personalities.some(p => p.id === savedPersonality)) {
            setPersonality(savedPersonality);
          }
          
          if (data.evolution_instance_id) {
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
    if (!companyName || !whatsappNumber) {
      toast.error("Preencha o Nome e o WhatsApp.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("https://webhook.saveautomatik.shop/webhook/d186bd57-3a34-4aa7-9067-50294c88bd3e", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: companyName,
          telefone: whatsappNumber,
        }),
      });

      if (!response.ok) throw new Error("Erro no webhook de criação");

      const dataWebhook = await response.json();
      
      if (user) {
         // Atualiza no banco
         const { error: dbError } = await supabase
          .from('clientes_saas' as any)
          .update({
            evolution_instance_name: companyName,
            // evolution_instance_id: dataWebhook.instanceId, // Se o webhook retornar ID, descomente
            mensagem_saudacao: greetingMessage,
            tonalidade: personality,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);
          
         if (dbError) throw dbError;
      }

      if (dataWebhook.url) {
        setQrCodeUrl(dataWebhook.url);
        setShowQR(true);
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
                  disabled={isConnected} 
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp (com DDD)</Label>
                <Input 
                  value={whatsappNumber} 
                  onChange={e => setWhatsappNumber(e.target.value)} 
                  disabled={isConnected} 
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
            {!isConnected ? (
              <Button onClick={handleCreateAgent} disabled={isSaving} size="lg" className="w-full md:w-auto bg-green-600 hover:bg-green-700">
                {isSaving ? <Loader2 className="animate-spin mr-2"/> : <QrCode className="mr-2 h-5 w-5"/>}
                Gerar QR Code e Conectar
              </Button>
            ) : (
              <Button onClick={handleUpdateConfig} disabled={isSaving} size="lg" className="w-full md:w-auto">
                {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-5 w-5"/>}
                Salvar Alterações
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {showQR && !isConnected && (
            <Card className="border-dashed border-2 border-green-400">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-lg">Escaneie no WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border rounded-lg" />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-lg text-slate-400">
                    <Loader2 className="animate-spin h-8 w-8" />
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={handleConfirmConnection} className="w-full">
                  Já Escaneiei
                </Button>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}