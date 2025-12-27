import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Phone,
  MapPin,
  DollarSign,
  Bed,
  Send,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Lead, LeadStatus, ImovelUnico, ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-success/10 text-success border-success/20" },
  atendimento: { label: "Em conversa", className: "bg-primary/10 text-primary border-primary/20" },
  visita: { label: "Visita agendada", className: "bg-warning/10 text-warning border-warning/20" },
  fechado: { label: "Fechado", className: "bg-muted text-muted-foreground border-muted" },
};

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    lead_id: "1",
    content: "Olá! Estou interessado em apartamentos em Copacabana.",
    sender: "lead",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    lead_id: "1",
    content: "Olá Maria! Temos ótimas opções em Copacabana. Qual seu orçamento máximo e quantos quartos você precisa?",
    sender: "bot",
    timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    lead_id: "1",
    content: "Meu orçamento é até 850 mil e preciso de 2 quartos.",
    sender: "lead",
    timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    lead_id: "1",
    content: "Perfeito! Encontrei 5 imóveis que combinam com você. Posso enviar as opções?",
    sender: "bot",
    timestamp: new Date(Date.now() - 1.7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    lead_id: "1",
    content: "Sim, por favor!",
    sender: "lead",
    timestamp: new Date(Date.now() - 1.6 * 60 * 60 * 1000).toISOString(),
  },
];

const mockImoveis: ImovelUnico[] = [
  {
    id: "1",
    titulo: "Apartamento com vista para o mar",
    preco: 780000,
    bairro: "Copacabana",
    origem: "Lopes",
    quartos: 2,
    area_m2: 75,
    imagem_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    titulo: "Cobertura reformada",
    preco: 850000,
    bairro: "Copacabana",
    origem: "Prime",
    quartos: 2,
    area_m2: 90,
    imagem_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    titulo: "Apartamento próximo à praia",
    preco: 720000,
    bairro: "Copacabana",
    origem: "R3",
    quartos: 2,
    area_m2: 68,
    imagem_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTime(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function LeadDetailsSheet({ lead, open, onOpenChange }: LeadDetailsSheetProps) {
  const [newMessage, setNewMessage] = useState("");

  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
              {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold">{lead.nome}</SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusConfig[lead.status].className)}
                >
                  {statusConfig[lead.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">{lead.whatsapp}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="gap-2 bg-success hover:bg-success/90 flex-1">
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button size="sm" variant="outline" className="gap-2 flex-1">
              <Phone className="h-4 w-4" />
              Ligar
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="perfil" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mx-6 mt-4" style={{ width: 'calc(100% - 3rem)' }}>
            <TabsTrigger value="perfil">Perfil & Chat</TabsTrigger>
            <TabsTrigger value="imoveis">Match de Imóveis</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="flex-1 flex flex-col overflow-hidden m-0 p-6 pt-4">
            {/* Profile Info */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Bairro</p>
                <p className="font-medium text-sm">{lead.interesse_bairro}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Orçamento</p>
                <p className="font-medium text-sm">{formatCurrency(lead.orcamento_max)}</p>
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <Bed className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Quartos</p>
                <p className="font-medium text-sm">{lead.quartos}</p>
              </div>
            </div>

            {/* Edit Status */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Status do Lead</Label>
              <Select defaultValue={lead.status}>
                <SelectTrigger className="bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="atendimento">Em conversa</SelectItem>
                  <SelectItem value="visita">Visita agendada</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chat History */}
            <div className="flex-1 flex flex-col overflow-hidden rounded-lg border border-border">
              <div className="px-3 py-2 border-b border-border bg-muted/30">
                <p className="text-sm font-medium">Histórico de Conversa</p>
              </div>
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {mockMessages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        message.sender === "lead" ? "items-start" : "items-end ml-auto"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm",
                          message.sender === "lead"
                            ? "bg-muted"
                            : message.sender === "bot"
                            ? "bg-primary text-primary-foreground"
                            : "bg-success text-success-foreground"
                        )}
                      >
                        {message.content}
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon" className="bg-success hover:bg-success/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="imoveis" className="flex-1 overflow-hidden m-0 p-6 pt-4">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                <p className="text-sm text-muted-foreground mb-3">
                  {mockImoveis.length} imóveis encontrados com base no perfil do lead
                </p>
                {mockImoveis.map((imovel) => (
                  <Card key={imovel.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="w-28 h-24 flex-shrink-0">
                        <img
                          src={imovel.imagem_url}
                          alt={imovel.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{imovel.titulo}</p>
                            <p className="text-lg font-bold text-primary">
                              {formatCurrency(imovel.preco)}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {imovel.bairro}
                              </span>
                              <span>•</span>
                              <span>{imovel.quartos}q</span>
                              <span>•</span>
                              <span>{imovel.area_m2}m²</span>
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              {imovel.origem}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1 gap-1 bg-success hover:bg-success/90 text-xs h-7">
                            <Send className="h-3 w-3" />
                            Enviar via Zap
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
