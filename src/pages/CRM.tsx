import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, MapPin, DollarSign, Bed, Loader2, Building2, ExternalLink, Bath, Car, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

// Interfaces
interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  interesse_bairro: string | null;
  orcamento_max: number | null;
  quartos: number | null;
  status: string | null;
  created_at: string;
}

interface ImovelSugestao {
  id: string;
  titulo: string;
  bairro: string;
  preco: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  imagem: string;
}

// Configuração de Cores e Labels
const statusColors: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  atendimento: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  visita: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  fechado: "bg-green-500/10 text-green-500 border-green-500/20",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  atendimento: "Em Atendimento",
  visita: "Visita Agendada",
  fechado: "Fechado",
};

// DADOS MOCKADOS (Exemplo)
const MOCK_LEADS: Lead[] = [
  {
    id: "mock-1",
    nome: "Roberto Silva",
    whatsapp: "13999998888",
    interesse_bairro: "Gonzaga",
    orcamento_max: 850000,
    quartos: 3,
    status: "novo",
    created_at: new Date().toISOString()
  },
  {
    id: "mock-2",
    nome: "Ana Clara Souza",
    whatsapp: "13988887777",
    interesse_bairro: "Embaré",
    orcamento_max: 600000,
    quartos: 2,
    status: "atendimento",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "mock-3",
    nome: "Carlos Eduardo",
    whatsapp: "13977776666",
    interesse_bairro: "Boqueirão",
    orcamento_max: 1200000,
    quartos: 4,
    status: "visita",
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "mock-4",
    nome: "Mariana Oliveira",
    whatsapp: "13966665555",
    interesse_bairro: "Ponta da Praia",
    orcamento_max: 950000,
    quartos: 3,
    status: "novo",
    created_at: new Date(Date.now() - 250000000).toISOString()
  }
];

// Função para gerar 50 imóveis baseados no perfil do lead
const gerarImoveisCompativeis = (lead: Lead): ImovelSugestao[] => {
  return Array.from({ length: 50 }).map((_, index) => {
    const variacaoPreco = (Math.random() * 0.4) - 0.2; // -20% a +20%
    const precoBase = lead.orcamento_max || 500000;
    const precoFinal = precoBase * (1 + variacaoPreco);
    
    const quartos = lead.quartos || 2;
    // Alguns imóveis podem ter 1 quarto a mais ou a menos
    const quartosFinal = Math.max(1, quartos + (Math.random() > 0.8 ? 1 : 0)); 

    return {
      id: `imovel-${index}`,
      titulo: `Apartamento incrível no ${lead.interesse_bairro || 'Centro'}`,
      bairro: lead.interesse_bairro || "Santos",
      preco: precoFinal,
      quartos: quartosFinal,
      banheiros: Math.max(1, Math.floor(quartosFinal * 0.7)),
      vagas: Math.floor(Math.random() * 3) + 1,
      area: 60 + (quartosFinal * 25) + (Math.random() * 40),
      imagem: `https://source.unsplash.com/random/800x600/?apartment,living-room&sig=${index}`
    };
  });
};

export default function CRM() {
  const { clienteSaas } = useAuth();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS); // Inicia com Mocks
  const [loading, setLoading] = useState(true);
  
  // Estados para o Drawer (Sheet) de detalhes
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [imoveisCompativeis, setImoveisCompativeis] = useState<ImovelSugestao[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    async function fetchLeads() {
      // Se tiver cliente logado, tenta buscar do banco e mesclar
      if (clienteSaas?.id) {
        const sb = supabase as any;
        const { data, error } = await sb
          .from("leads")
          .select("*")
          .eq("cliente_saas_id", clienteSaas.id)
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          // Combina reais com mocks ou substitui, conforme preferência.
          // Aqui vou adicionar os reais antes dos mocks
          setLeads([...data, ...MOCK_LEADS]);
        }
      }
      setLoading(false);
    }
    fetchLeads();
  }, [clienteSaas?.id]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    const sugestoes = gerarImoveisCompativeis(lead);
    setImoveisCompativeis(sugestoes);
    setIsSheetOpen(true);
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Leads"
        subtitle="Gerencie seus leads e veja imóveis compatíveis"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{leads.length}</p>
                <p className="text-sm text-muted-foreground">Total de leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum lead ainda</h3>
                <p className="text-muted-foreground max-w-md">
                  Seus leads aparecerão aqui.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Bairro Interesse</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Quartos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <TableCell className="font-medium">{lead.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {lead.whatsapp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {lead.interesse_bairro || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {formatCurrency(lead.orcamento_max)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          {lead.quartos || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[lead.status || "novo"] || statusColors.novo}
                        >
                          {statusLabels[lead.status || "novo"] || "Novo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sheet de Detalhes e Imóveis Compatíveis */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-2xl w-full flex flex-col h-full">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {selectedLead?.nome}
            </SheetTitle>
            <SheetDescription>
              Perfil do cliente e imóveis recomendados
            </SheetDescription>
            
            {selectedLead && (
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-muted/30 rounded-lg border">
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Orçamento</p>
                    <p className="font-medium text-lg text-green-600">{formatCurrency(selectedLead.orcamento_max)}</p>
                 </div>
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Bairro</p>
                    <p className="font-medium text-lg">{selectedLead.interesse_bairro || "Qualquer"}</p>
                 </div>
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Quartos</p>
                    <p className="font-medium">{selectedLead.quartos ? `${selectedLead.quartos}+` : "Indiferente"}</p>
                 </div>
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">WhatsApp</p>
                    <p className="font-medium">{selectedLead.whatsapp}</p>
                 </div>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Imóveis Compatíveis ({imoveisCompativeis.length})
            </h3>
            
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-4 pb-4">
                {imoveisCompativeis.map((imovel) => (
                  <Card key={imovel.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="sm:w-32 h-32 bg-gray-200 shrink-0 relative">
                        {/* Placeholder da Imagem */}
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                             <Building2 size={30} />
                        </div>
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold line-clamp-1 mb-1">{imovel.titulo}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                            <MapPin size={12} /> {imovel.bairro}
                          </p>
                          <div className="flex gap-3 text-xs text-slate-600 mb-2">
                            <span className="flex items-center gap-1"><Bed size={12}/> {imovel.quartos}</span>
                            <span className="flex items-center gap-1"><Bath size={12}/> {imovel.banheiros}</span>
                            <span className="flex items-center gap-1"><Car size={12}/> {imovel.vagas}</span>
                            <span className="flex items-center gap-1"><Maximize2 size={12}/> {Math.floor(imovel.area)}m²</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                           <span className="font-bold text-lg text-slate-900">
                             {formatCurrency(imovel.preco)}
                           </span>
                           <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                             <ExternalLink size={12} /> Ver
                           </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}