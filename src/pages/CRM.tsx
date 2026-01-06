import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Search, 
  MapPin, 
  Car, 
  DollarSign, 
  Home,
  BedDouble,
  Ruler,
  ExternalLink,
  MessageCircle,
  User,
  Phone,
  Bath,
  Palmtree,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- Interfaces ---

interface Imovel {
  id: string;
  titulo: string | null;
  descricao: string | null;
  preco: number | null;
  condominio: number | null;
  bairro: string | null;
  cidade: string | null;
  quartos: number | null;
  banheiros: number | null;
  vagas: number | null;
  area_m2: number | null;
  imagem_url: string | null;
  itens_lazer: string | null;
  link: string | null;
}

interface Lead {
  id: string;
  created_at: string;
  nome: string | null;
  whatsapp: string | null;
  interesse_bairro: string | null;
  cidade: string | null;
  orcamento_max: number | null;
  orcamento_minimo: number | null;
  quartos: number | null;
  banheiros: string | null; 
  vagas: string | null;
  itens_lazer: string | null;
  matches?: ScoredImovel[]; 
}

interface ScoredImovel extends Imovel {
  score: number; 
  matchReasons: string[];
}

export default function CRM() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [imoveisCache, setImoveisCache] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const sb = supabase as any;

        // 1. Buscar Imóveis
        const { data: imoveisData, error: imoveisError } = await sb
          .from("imoveis_santos")
          .select("id, titulo, descricao, preco, condominio, bairro, cidade, quartos, banheiros, vagas, area_m2, imagem_url, itens_lazer, link");
        
        if (imoveisError) throw imoveisError;
        const listaImoveis = imoveisData as Imovel[];
        setImoveisCache(listaImoveis);

        // 2. Buscar Leads
        const { data: leadsData, error: leadsError } = await sb
          .from("leads")
          .select("*") 
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (leadsError) throw leadsError;
        const listaLeads = leadsData as Lead[];

        // 3. Matchmaking
        const leadsProcessados = listaLeads.map(lead => {
          const matches = calcularMatches(lead, listaImoveis);
          return { ...lead, matches };
        });

        setLeads(leadsProcessados);

      } catch (error) {
        console.error("Erro ao carregar CRM:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  function parseNumber(val: string | number | null): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const nums = val.replace(/\D/g, ""); 
    return nums ? parseInt(nums) : 0;
  }

  // --- ALGORITMO DE MATCH (Ajustado) ---
  function calcularMatches(lead: Lead, imoveis: Imovel[]): ScoredImovel[] {
    const scored = imoveis.map(imovel => {
      let score = 0;
      const reasons: string[] = [];

      // Normalização
      const leadBairro = (lead.interesse_bairro || "").toLowerCase().trim();
      const leadCidade = (lead.cidade || "").toLowerCase().trim();
      const leadMaxPrice = lead.orcamento_max || 0;
      const leadMinPrice = lead.orcamento_minimo || 0; // Se não tiver, usaremos lógica de piso automático
      const leadQuartos = lead.quartos || 0;
      const leadVagas = parseNumber(lead.vagas);
      const leadBanheiros = parseNumber(lead.banheiros);

      // 1. LOCALIZAÇÃO (Peso 40 - Aumentado)
      const imovelBairro = (imovel.bairro || "").toLowerCase();
      const imovelCidade = (imovel.cidade || "").toLowerCase();
      
      let locMatch = false;

      if (leadBairro) {
        // Se cliente PEDIU bairro, tem que ser no bairro ou penaliza forte
        if (imovelBairro.includes(leadBairro) || imovelCidade.includes(leadBairro)) {
          score += 40;
          locMatch = true;
          // reasons.push("Bairro exato");
        } else {
          // Se for na mesma cidade mas bairro errado
          if (leadCidade && imovelCidade.includes(leadCidade)) {
             score += 10; // Dá poucos pontos só por ser na cidade
             // Não marca locMatch como true para não inflar nota
          } else {
             score -= 50; // Bairro errado e cidade errada (ou não especificada)
          }
        }
      } else if (leadCidade) {
        // Cliente só pediu cidade
        if (imovelCidade.includes(leadCidade)) {
          score += 40;
          locMatch = true;
        } else {
          score -= 50;
        }
      } else {
        score += 40; // Cliente não especificou local
      }

      // 2. PREÇO (Peso 25)
      const price = imovel.preco || 0;
      if (price > 0 && leadMaxPrice > 0) {
        // Teto Máximo
        if (price <= leadMaxPrice) {
          
          // Lógica de Piso Automático: 
          // Se o imóvel custar menos que 60% do orçamento do cliente, penaliza (muito barato/padrão baixo)
          // Ex: Cliente tem 1M. Imóvel de 500k entra aqui.
          const pisoAceitavel = leadMinPrice > 0 ? leadMinPrice : (leadMaxPrice * 0.6);
          
          if (price >= pisoAceitavel) {
            score += 25;
            reasons.push("Preço ideal");
          } else {
            score += 10; // Ganha pontos por caber no orçamento, mas menos pq é muito barato
            reasons.push("Abaixo do padrão");
          }

        } else if (price <= leadMaxPrice * 1.1) { // 10% acima
          score += 15;
          reasons.push("Pouco acima");
        } else {
          score -= 30; // Muito caro
        }
      } else {
        score += 25; // Sem preço definido
      }

      // 3. QUARTOS (Peso 20)
      const imovelQuartos = imovel.quartos || 0;
      if (leadQuartos > 0) {
        if (imovelQuartos >= leadQuartos) {
          score += 20;
          reasons.push(`${imovelQuartos} quartos`);
        } else if (imovelQuartos === leadQuartos - 1) {
          score += 5; 
        } else {
          score -= 20;
        }
      } else {
        score += 20;
      }

      // 4. VAGAS (Peso 10)
      const imovelVagas = imovel.vagas || 0;
      if (leadVagas > 0) {
        if (imovelVagas >= leadVagas) {
          score += 10;
        } else {
          // Não penaliza muito, vagas é negociável ou resolvível
        }
      } else {
        score += 10;
      }

      // 5. EXTRAS (Banheiros e Elevador)
      if (leadBanheiros > 0) {
         const imovelBanheiros = imovel.banheiros || 0;
         if (imovelBanheiros >= leadBanheiros) score += 5;
      }

      // Lazer / Elevador
      if (lead.itens_lazer) {
        const keywords = lead.itens_lazer.split(',').map(k => k.trim().toLowerCase());
        const imovelDesc = (imovel.descricao + " " + imovel.itens_lazer).toLowerCase();
        
        // Verifica se encontra alguma das palavras chaves (ex: elevador)
        const found = keywords.some(k => k && imovelDesc.includes(k));
        if (found) {
          score += 5;
          reasons.push("Item desejado");
        }
      }

      // Score final: garante que não passa de 100 nem fica negativo
      return { ...imovel, score: Math.min(100, Math.max(0, Math.round(score))), matchReasons: reasons };
    });

    // Filtra e Ordena
    return scored
      .filter(imovel => imovel.score >= 50)
      .sort((a, b) => b.score - a.score);
  }

  const formatCurrency = (val: number | null) => {
    if (!val) return "R$ -";
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  const filteredLeads = leads.filter(lead => 
    lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.interesse_bairro?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AppHeader
        title="CRM & Leads"
        subtitle="Gestão completa da carteira de clientes"
      />

      <Card className="border-border shadow-soft">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Meus Leads</CardTitle>
            <CardDescription>
              {leads.length} clientes ativos na base
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Busca Principal</TableHead>
                  <TableHead className="text-center">Potencial</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.nome || "Cliente sem nome"}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                           <Phone className="h-3 w-3" />
                           {lead.whatsapp}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{lead.interesse_bairro || lead.cidade || "Qualquer região"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Até {formatCurrency(lead.orcamento_max)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={lead.matches && lead.matches.length > 0 ? "default" : "outline"}
                      >
                        {lead.matches?.length || 0} Matches
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        onClick={() => { setSelectedLead(lead); setIsDialogOpen(true); }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Ver Ficha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* --- DIALOG FICHA DO CLIENTE --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedLead?.nome ? selectedLead.nome.substring(0,2).toUpperCase() : <User />}
              </div>
              <div>
                <DialogTitle>{selectedLead?.nome || "Detalhes do Lead"}</DialogTitle>
                <DialogDescription>
                  Cliente desde {selectedLead?.created_at && new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="matches" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2 border-b border-border">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="matches">
                   Imóveis Compatíveis ({selectedLead?.matches?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="dados">Dados do Cliente</TabsTrigger>
              </TabsList>
            </div>

            {/* ABA 1: LISTA DE MATCHES (Principal) */}
            <TabsContent value="matches" className="flex-1 overflow-hidden flex flex-col mt-0">
              <ScrollArea className="flex-1 p-6 bg-muted/10">
                {selectedLead?.matches && selectedLead.matches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLead.matches.map((imovel) => (
                      <div 
                        key={imovel.id} 
                        className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-all group"
                      >
                        <div className="h-40 bg-muted relative overflow-hidden">
                          {imovel.imagem_url ? (
                            <img 
                              src={imovel.imagem_url} 
                              alt={imovel.titulo || "Imóvel"} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Home className="h-10 w-10 opacity-10" />
                            </div>
                          )}
                          <Badge className={`absolute top-2 right-2 ${
                            imovel.score >= 90 ? 'bg-green-600' : 
                            imovel.score >= 70 ? 'bg-blue-600' : 'bg-yellow-600'
                          }`}>
                            {imovel.score}% Match
                          </Badge>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-6">
                            <p className="text-white text-xs font-medium truncate">
                              {imovel.bairro} - {imovel.cidade}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-semibold text-sm line-clamp-1 mb-1" title={imovel.titulo || ""}>
                            {imovel.titulo || "Imóvel"}
                          </h4>
                          <p className="text-lg font-bold text-primary mb-2">
                            {formatCurrency(imovel.preco)}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><BedDouble className="h-3 w-3"/> {imovel.quartos}</span>
                            <span className="flex items-center gap-1"><Car className="h-3 w-3"/> {imovel.vagas}</span>
                            <span className="flex items-center gap-1"><Ruler className="h-3 w-3"/> {imovel.area_m2}m²</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {imovel.matchReasons.slice(0, 3).map((reason, idx) => (
                              <span key={idx} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                                {reason}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-auto grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={imovel.link || "#"} target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                Site
                              </a>
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                              <a 
                                href={`https://wa.me/${selectedLead.whatsapp}?text=Olá ${selectedLead.nome}, separei este imóvel no ${imovel.bairro} que tem tudo a ver com você: ${imovel.link}`} 
                                target="_blank" 
                                rel="noreferrer"
                              >
                                <MessageCircle className="mr-2 h-3 w-3" />
                                Enviar
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
                    <Home className="h-12 w-12 mb-4 opacity-20" />
                    <p>Nenhum imóvel compatível encontrado.</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* ABA 2: DADOS DO CLIENTE */}
            <TabsContent value="dados" className="flex-1 overflow-auto p-6 space-y-6 mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                    <User className="h-4 w-4" /> Dados Pessoais
                  </h4>
                  <div className="grid grid-cols-1 gap-4 p-4 rounded-lg border border-border bg-card">
                    <div>
                      <span className="text-xs text-muted-foreground block">Nome Completo</span>
                      <span className="text-sm font-medium">{selectedLead?.nome || "-"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">WhatsApp</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedLead?.whatsapp || "-"}</span>
                        {selectedLead?.whatsapp && (
                          <a 
                            href={`https://wa.me/${selectedLead.whatsapp}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-green-600 hover:text-green-700"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                    <Search className="h-4 w-4" /> Preferências de Busca
                  </h4>
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border border-border bg-card">
                    <div>
                      <span className="text-xs text-muted-foreground block">Cidade</span>
                      <span className="text-sm font-medium">{selectedLead?.cidade || "-"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Bairro de Interesse</span>
                      <span className="text-sm font-medium">{selectedLead?.interesse_bairro || "-"}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Orçamento Mínimo</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedLead?.orcamento_minimo)}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Orçamento Máximo</span>
                      <span className="text-sm font-medium text-green-600">{formatCurrency(selectedLead?.orcamento_max)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                  <Home className="h-4 w-4" /> Características Desejadas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center text-center">
                    <BedDouble className="h-5 w-5 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Quartos</span>
                    <span className="font-bold">{selectedLead?.quartos || "Indif."}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center text-center">
                    <Bath className="h-5 w-5 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Banheiros</span>
                    <span className="font-bold">{selectedLead?.banheiros || "Indif."}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center text-center">
                    <Car className="h-5 w-5 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Vagas</span>
                    <span className="font-bold">{selectedLead?.vagas || "Indif."}</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col items-center justify-center text-center">
                    <Palmtree className="h-5 w-5 mb-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Lazer</span>
                    <span className="font-bold text-xs line-clamp-2">{selectedLead?.itens_lazer || "Nenhum"}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}