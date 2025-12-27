import { useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Smartphone,
  QrCode,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShoppingCart,
  Briefcase,
  Heart,
  GraduationCap,
  MapPin,
  MoreHorizontal,
  Sparkles,
  MessageSquare,
  Lightbulb,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type BusinessType = "ecommerce" | "services" | "health" | "education" | "local" | "other" | null;
type Personality = "friendly" | "professional" | "relaxed" | "direct";
type Objective = "sales" | "support" | "scheduling" | "leads";

const businessTypes = [
  { id: "ecommerce", label: "E-commerce", icon: ShoppingCart },
  { id: "services", label: "Serviços", icon: Briefcase },
  { id: "health", label: "Saúde & Beleza", icon: Heart },
  { id: "education", label: "Educação", icon: GraduationCap },
  { id: "local", label: "Negócio Local", icon: MapPin },
  { id: "other", label: "Outro", icon: MoreHorizontal },
] as const;

const personalities = [
  { id: "friendly", label: "Amigável" },
  { id: "professional", label: "Profissional" },
  { id: "relaxed", label: "Descontraído" },
  { id: "direct", label: "Direto" },
] as const;

const objectives = [
  { id: "sales", label: "Aumentar Vendas / Recuperar Carrinho" },
  { id: "support", label: "Suporte Técnico / Tirar Dúvidas" },
  { id: "scheduling", label: "Agendamentos / Reservas" },
  { id: "leads", label: "Qualificação de Leads (Filtro)" },
] as const;

const nicheTips: Record<string, string[]> = {
  ecommerce: ["Status de pedidos", "Rastreamento de entregas", "Trocas e devoluções", "Disponibilidade de produtos"],
  services: ["Horários disponíveis", "Orçamentos automáticos", "Agendamento online", "Dúvidas sobre serviços"],
  health: ["Agendamento de consultas", "Preparos para exames", "Horários de atendimento", "Convênios aceitos"],
  education: ["Grade de cursos", "Matrículas online", "Dúvidas sobre mensalidade", "Material didático"],
  local: ["Horário de funcionamento", "Localização e como chegar", "Reservas de mesa", "Cardápio/Produtos"],
  other: ["Apresentação geral", "Contatos úteis", "Missão da empresa", "Fluxo de ajuda"],
};

export default function RoboConfig() {
  const [isConnected, setIsConnected] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [agentCreated, setAgentCreated] = useState(false);

  // Form state
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [companyName, setCompanyName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [productsServices, setProductsServices] = useState("");
  const [objective, setObjective] = useState<Objective | "">("");
  const [faq, setFaq] = useState("");
  const [personality, setPersonality] = useState<Personality>("professional");
  const [forbiddenTopics, setForbiddenTopics] = useState("");

  const currentTips = useMemo(() => {
    return nicheTips[businessType || "other"] || nicheTips.other;
  }, [businessType]);

  const personalityLabel = useMemo(() => {
    return personalities.find(p => p.id === personality)?.label || "Profissional";
  }, [personality]);

  const generatePrompt = () => {
    const objectiveText = objectives.find(o => o.id === objective)?.label || "";
    
    let prompt = `Você é o assistente virtual da ${companyName || "empresa"}, uma empresa do segmento de ${
      businessTypes.find(b => b.id === businessType)?.label || "negócios"
    }.

SOBRE A EMPRESA:
${businessDescription || "Descrição não fornecida."}

PRODUTOS/SERVIÇOS PRINCIPAIS:
${productsServices || "Não especificados."}

OBJETIVO PRINCIPAL:
${objectiveText || "Atendimento geral ao cliente."}

PERSONALIDADE:
Você deve ser ${personalityLabel.toLowerCase()} em todas as interações. ${
      personality === "friendly" ? "Use emojis ocasionalmente e seja acolhedor." :
      personality === "professional" ? "Mantenha um tom corporativo e respeitoso." :
      personality === "relaxed" ? "Seja informal mas educado, use gírias leves." :
      "Seja objetivo e vá direto ao ponto sem rodeios."
    }

FAQ - DÚVIDAS FREQUENTES:
${faq || "Responda com base no contexto fornecido."}

${forbiddenTopics ? `ASSUNTOS PROIBIDOS (NUNCA DISCUTA):
${forbiddenTopics}

Se o cliente perguntar sobre esses assuntos, educadamente diga que não pode ajudar nesse tema específico e redirecione a conversa.` : ""}

INSTRUÇÕES GERAIS:
1. Sempre cumprimente o cliente de forma ${personalityLabel.toLowerCase()}.
2. Identifique rapidamente a necessidade do cliente.
3. Forneça respostas claras e úteis.
4. Se não souber algo, diga que vai encaminhar para um atendente humano.
5. Colete informações de contato quando apropriado.
6. Finalize as conversas de forma educada.`;

    return prompt;
  };

  const previewMessage = useMemo(() => {
    const greetings: Record<Personality, string> = {
      friendly: `Olá! 😊 Que bom ter você aqui! Sou o assistente da ${companyName || "nossa empresa"}. Como posso ajudar você hoje?`,
      professional: `Olá, agradecemos o contato. Sou assistente da ${companyName || "nossa empresa"}. Em que posso ajudá-lo?`,
      relaxed: `E aí! Tudo bem? Sou o assistente da ${companyName || "nossa empresa"}. Bora resolver sua dúvida?`,
      direct: `Olá. Assistente da ${companyName || "empresa"}. Como posso ajudar?`,
    };
    return greetings[personality];
  }, [personality, companyName]);

  const handleCreateAgent = async () => {
    if (!companyName || !whatsappNumber || !businessType) {
      toast.error("Preencha os campos obrigatórios: Nome da Empresa, WhatsApp e Tipo de Empresa");
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
    toast.success("WhatsApp conectado com sucesso!");
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
                    Seu agente para {companyName} está pronto. Agora conecte seu WhatsApp.
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

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setAgentCreated(false)}
            className="gap-2"
          >
            Voltar para Configuração
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Configuração de Inteligência"
        subtitle="Crie o cérebro do seu atendimento"
      />

      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-muted-foreground mb-8">
          Escolha seu nicho e preencha as informações para uma IA sob medida.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 - Business Type */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    1
                  </span>
                  Qual o tipo da sua empresa?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {businessTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setBusinessType(type.id as BusinessType)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          businessType === type.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Step 2 - Business Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    2
                  </span>
                  Detalhes do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa *</Label>
                    <Input
                      id="companyName"
                      placeholder="Ex: Loja Virtual ABC"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp de Atendimento *</Label>
                    <Input
                      id="whatsapp"
                      placeholder="Ex: 11999999999"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Negócio</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o que sua empresa faz..."
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="products">Principais Produtos/Serviços</Label>
                  <Textarea
                    id="products"
                    placeholder="Liste os principais produtos ou serviços oferecidos..."
                    value={productsServices}
                    onChange={(e) => setProductsServices(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Qual o objetivo da automação?</Label>
                  <Select value={objective} onValueChange={(val) => setObjective(val as Objective)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um objetivo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      {objectives.map((obj) => (
                        <SelectItem key={obj.id} value={obj.id}>
                          {obj.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 - Knowledge & Tone */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    3
                  </span>
                  Conhecimento & Tom de Voz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faq">Dúvidas Frequentes (FAQ)</Label>
                  <Textarea
                    id="faq"
                    placeholder="Liste as perguntas mais comuns e suas respostas..."
                    value={faq}
                    onChange={(e) => setFaq(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Dica: Tente abordar Apresentação geral, Contatos úteis, Missão da empresa, Fluxo de ajuda.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Personalidade do Atendimento</Label>
                  <div className="flex flex-wrap gap-2">
                    {personalities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPersonality(p.id)}
                        className={cn(
                          "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                          personality === p.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forbidden">Assuntos Proibidos</Label>
                  <Textarea
                    id="forbidden"
                    placeholder="Liste assuntos que o robô NÃO deve discutir..."
                    value={forbiddenTopics}
                    onChange={(e) => setForbiddenTopics(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleCreateAgent}
              disabled={isCreatingAgent}
            >
              {isCreatingAgent ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              {isCreatingAgent ? "Gerando Agente..." : "Gerar Agente e Ir para Conexão"}
            </Button>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card className="bg-accent/30 border-accent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Dicas para {businessTypes.find(b => b.id === businessType)?.label || "seu nicho"}
                </CardTitle>
                <CardDescription>
                  Empresas do seu nicho costumam automatizar estas dores para ganhar tempo:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentTips.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-5 w-5 text-success" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-success text-success-foreground px-4 py-2 rounded-2xl rounded-br-md max-w-[85%] text-sm">
                      "Oi! Gostaria de saber mais sobre os produtos."
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-card border px-4 py-2 rounded-2xl rounded-bl-md max-w-[85%]">
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        IA ({personalityLabel}):
                      </p>
                      <p className="text-sm">{previewMessage}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Summary */}
            {companyName && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5" />
                    Resumo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Empresa:</span> {companyName}</p>
                  {whatsappNumber && (
                    <p><span className="text-muted-foreground">WhatsApp:</span> {whatsappNumber}</p>
                  )}
                  {businessType && (
                    <p><span className="text-muted-foreground">Nicho:</span> {businessTypes.find(b => b.id === businessType)?.label}</p>
                  )}
                  {objective && (
                    <p><span className="text-muted-foreground">Objetivo:</span> {objectives.find(o => o.id === objective)?.label}</p>
                  )}
                  <p><span className="text-muted-foreground">Tom:</span> {personalityLabel}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
