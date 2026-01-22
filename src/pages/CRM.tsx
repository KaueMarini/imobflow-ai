import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom"; // Hook para ler URL
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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
  Calendar, 
  Star, 
  Sparkles, 
  CirclePause, 
  Bot, 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Satellite // <--- ÍCONE DO RADAR
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- Interfaces ---

interface Imovel {
  id: number | string; 
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
  origem?: string | null;
  tipo_negocio?: string | null; // Venda ou Aluguel
}

// Interface para Captação (Vem da tabela imoveis_captacao)
interface CaptacaoImovel {
  id: string;
  titulo: string;
  preco: number;
  bairro: string;
  cidade: string;
  quartos: number;
  area_m2: number;
  link_original: string;
  nome_proprietario: string;
  telefone_proprietario: string;
  created_at: string;
  score: number;
}

interface ScoredImovel extends Imovel {
  score: number; 
  matchReasons: string[];
  faixa_preco?: string;
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
  
  imoveis_recomendados: (string | number)[] | null; 
  
  // Matches carregados sob demanda (Lazy Loading)
  matches?: ScoredImovel[]; 
  captacaoMatches?: CaptacaoImovel[]; // <--- NOVO: Matches de captação
  recommendedList?: Imovel[]; 
}

export default function CRM() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams(); // Hook para ler a URL
  
  // --- Estados de Dados ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingList, setLoadingList] = useState(true); 
  const [loadingMatches, setLoadingMatches] = useState(false); 
  
  // --- Paginação ---
  const [page, setPage] = useState(0);
  const ROWS_PER_PAGE = 20; 
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Lead Selecionado (Detalhes) ---
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pausingId, setPausingId] = useState<string | null>(null);

  // --- Filtros de Fontes (SaaS) ---
  const [availableSources, setAvailableSources] = useState<string[]>([]); 
  const [selectedSources, setSelectedSources] = useState<string[]>([]);   

  // Helpers
  function parseNumber(val: string | number | null): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const nums = val.replace(/\D/g, ""); 
    return nums ? parseInt(nums) : 0;
  }

  const formatCurrency = (val: number | null | string) => {
    if (!val) return "R$ -";
    const num = Number(val);
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  // 1. Carregar Configurações e Lista (Paginada)
  const fetchLeads = useCallback(async () => {
    if (!user?.id) return;
    setLoadingList(true);

    try {
      // A. Buscar Fontes (apenas uma vez)
      if (availableSources.length === 0) {
        let saasResponse = await (supabase as any)
          .from("clientes_saas")
          .select("fontes_preferenciais, fontes_secundarias")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (!saasResponse.data) {
           saasResponse = await (supabase as any).from("cliente_saas").select("*").eq("user_id", user.id).maybeSingle();
        }
        if (!saasResponse.data) {
           saasResponse = await (supabase as any).from("clientes_saas").select("*").eq("id", user.id).maybeSingle();
        }

        if (saasResponse.data) {
          const todas = [
            ...(saasResponse.data.fontes_preferenciais || []),
            ...(saasResponse.data.fontes_secundarias || [])
          ];
          setAvailableSources([...new Set(todas)]);
        }
      }

      // B. Buscar Leads Pagindados
      let query = (supabase as any)
        .from("leads")
        .select("*", { count: "exact" }) 
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,interesse_bairro.ilike.%${searchTerm}%`);
      }

      const from = page * ROWS_PER_PAGE;
      const to = from + ROWS_PER_PAGE - 1;
      
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      setLeads(data as Lead[]);
      if (count !== null) setTotalLeads(count);

    } catch (error) {
      console.error("Erro ao buscar leads:", error);
      toast({ title: "Erro", description: "Falha ao carregar lista.", variant: "destructive" });
    } finally {
      setLoadingList(false);
    }
  }, [user?.id, page, searchTerm, availableSources.length, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // 2. Carregar Matches para Lead Selecionado (Sob Demanda)
  const fetchMatchesForLead = async (lead: Lead) => {
    if (!user?.id) return;
    setLoadingMatches(true);

    try {
      let recommendedList: Imovel[] = [];
      let matches: ScoredImovel[] = [];
      let captacaoMatches: CaptacaoImovel[] = [];

      // A. Manuais
      if (lead.imoveis_recomendados && lead.imoveis_recomendados.length > 0) {
        const idsParaBuscar = lead.imoveis_recomendados.map((id: string | number) => String(id));
        const { data: manuais } = await (supabase as any)
          .from("imoveis_santos")
          .select("*")
          .in("id", idsParaBuscar);
        if (manuais) recommendedList = manuais as Imovel[];
      }

      // B. Automáticos (RPC SQL - Estoque da Imobiliária)
      const params = {
        p_user_id: user.id,
        p_orcamento: lead.orcamento_max || 0,
        p_quartos: lead.quartos || 0,
        p_banheiros: parseNumber(lead.banheiros),
        p_vagas: parseNumber(lead.vagas),
        p_bairro: lead.interesse_bairro || null,
        p_cidade: lead.cidade || null,
        p_filtro_fontes: selectedSources.length > 0 ? selectedSources : null
      };

      const { data: matchesData } = await (supabase as any).rpc(
        'buscar_matches_imoveis', 
        params
      );

      if (matchesData) {
        matches = (matchesData as any[]).map(m => {
          const reasons: string[] = [];
          
          if (m.faixa_preco === 'ZONA IDEAL') {
             reasons.push("Preço Ideal");
          } else {
             reasons.push("Oportunidade");
          }

          if (lead.interesse_bairro && m.bairro?.toLowerCase().includes(lead.interesse_bairro.toLowerCase())) {
             reasons.push("Bairro Exato");
          }
          
          return { ...m, matchReasons: reasons };
        });
      }

      // C. Captação (RPC SQL - Radar de Proprietários) - NOVO!
      const paramsCaptacao = {
          p_orcamento: lead.orcamento_max || 0,
          p_quartos: lead.quartos || 0,
          p_bairro: lead.interesse_bairro || null
      };

      const { data: captacaoData } = await (supabase as any).rpc('buscar_match_captacao', paramsCaptacao);
      if (captacaoData) {
          captacaoMatches = captacaoData as CaptacaoImovel[];
      }

      // Atualiza o estado com TODAS as listas
      setSelectedLead({ ...lead, matches, recommendedList, captacaoMatches });

    } catch (error) {
      console.error("Erro matches:", error);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (selectedLead && isDialogOpen) {
      fetchMatchesForLead(selectedLead);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSources]);

  // --- DEEP LINK DO DASHBOARD ---
  useEffect(() => {
    const leadIdParaAbrir = searchParams.get("abrir");
    if (leadIdParaAbrir && !isDialogOpen) {
        const leadEncontrado = leads.find(l => l.id === leadIdParaAbrir);
        if (leadEncontrado) {
            setSelectedLead(leadEncontrado);
            setIsDialogOpen(true);
            fetchMatchesForLead(leadEncontrado);
        } else {
            (supabase as any).from('leads').select('*').eq('id', leadIdParaAbrir).single()
                .then(({ data }: { data: any }) => {
                    if (data) {
                        const leadUnico = data as Lead;
                        setSelectedLead(leadUnico);
                        setIsDialogOpen(true);
                        fetchMatchesForLead(leadUnico);
                    }
                });
        }
    }
  }, [searchParams, leads]);


  const handlePauseRobot = async (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setPausingId(lead.id);
    try {
      const telefone = lead.whatsapp ?? "";
      const nome = lead.nome ?? "";

      await fetch("https://webhook.saveautomatik.shop/webhook/bloqueiaIAFLY", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({ telefone, nome }).toString(),
      });

      toast({
        title: "⛔ Robô Pausado",
        description: `Automação interrompida para ${lead.nome}.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Erro ao pausar robô:", error);
      toast({ title: "Erro", description: "Falha ao pausar.", variant: "destructive" });
    } finally {
      setPausingId(null);
    }
  };

  // Componente Card de Imóvel (Estoque da Imobiliária)
  const ImovelCard = ({ imovel, lead, isRecommended = false }: { imovel: Imovel, lead: Lead, isRecommended?: boolean }) => {
    const score = (imovel as ScoredImovel).score || 0;
    const reasons = (imovel as ScoredImovel).matchReasons || [];
    
    return (
      <div className={`bg-card rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all group h-full border ${isRecommended ? 'border-amber-400 shadow-md shadow-amber-100' : 'border-border'}`}>
        <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
          {imovel.imagem_url ? (
            <img 
              src={imovel.imagem_url} 
              alt={imovel.titulo || "Imóvel"} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
              <Home className="h-10 w-10 opacity-20" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              {isRecommended ? (
                <Badge className="bg-amber-500 border-none text-white px-2 py-1">
                  <Star className="h-3 w-3 mr-1 fill-white" /> Recomendado
                </Badge>
              ) : (
                <Badge className={`shadow-sm border-none text-white ${
                  (score >= 1000) ? 'bg-green-600' : 'bg-blue-600'
                }`}>
                  {score >= 1000 ? "Match Ideal" : "Oportunidade"}
                </Badge>
              )}
          </div>

          <div className="absolute top-2 left-2 flex gap-1 flex-col items-start">
             {imovel.origem && (
                <Badge variant="secondary" className="text-[10px] bg-black/50 text-white backdrop-blur-md border-none">
                   {imovel.origem}
                </Badge>
             )}
             {imovel.tipo_negocio && (
                <Badge variant={imovel.tipo_negocio === 'aluguel' ? "secondary" : "default"} className="text-[10px] backdrop-blur-md border-none opacity-90">
                   {imovel.tipo_negocio === 'aluguel' ? 'Aluguel' : 'Venda'}
                </Badge>
             )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
            <p className="text-white text-xs font-medium truncate flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-white/90" />
              {imovel.bairro} - {imovel.cidade}
            </p>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h4 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 h-10" title={imovel.titulo || ""}>
            {imovel.titulo || "Imóvel sem título disponível"}
          </h4>
          
          <p className="text-lg font-bold text-primary mb-3">
            {formatCurrency(imovel.preco)}
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-muted-foreground border border-border/60 rounded-md py-2 bg-muted/20">
            <div className="flex flex-col items-center justify-center gap-0.5 border-r border-border/60">
              <BedDouble className="h-4 w-4 text-primary/70" />
              <span>{imovel.quartos || "-"} qtos</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5 border-r border-border/60">
              <Car className="h-4 w-4 text-primary/70" />
              <span>{imovel.vagas || "-"} vgs</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-0.5">
              <Ruler className="h-4 w-4 text-primary/70" />
              <span>{imovel.area_m2 || "-"} m²</span>
            </div>
          </div>

          {!isRecommended && reasons.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
              {reasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full text-secondary-foreground font-medium border border-secondary">
                  {reason}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full text-xs h-9" asChild>
              <a href={imovel.link || "#"} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-3 w-3" />
                Ver Site
              </a>
            </Button>
            <Button size="sm" className={`w-full text-white text-xs h-9 ${isRecommended ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`} asChild>
              <a href={`https://wa.me/${lead.whatsapp}?text=Olá ${lead.nome}, encontrei este imóvel: ${imovel.link}`} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-3 w-3" />
                Enviar
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // --- NOVO COMPONENTE: CARD DE CAPTAÇÃO ---
  const CaptacaoCard = ({ imovel }: { imovel: CaptacaoImovel }) => {
     return (
       <div className="bg-card rounded-xl border border-dashed border-primary/40 flex flex-col hover:border-primary transition-all group h-full">
         <div className="p-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
            <Badge variant="outline" className="bg-white border-primary/20 text-primary font-bold shadow-sm">
                Radar Particular
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center">
               <Calendar className="h-3 w-3 mr-1" /> 
               {new Date(imovel.created_at).toLocaleDateString('pt-BR')}
            </span>
         </div>
         <div className="p-4 flex-1 flex flex-col">
            <h4 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 text-foreground/90">{imovel.titulo}</h4>
            
            <p className="text-lg font-bold text-foreground mb-3">{formatCurrency(imovel.preco)}</p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
               <MapPin className="h-3.5 w-3.5" /> {imovel.bairro} - {imovel.cidade}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground bg-muted/40 p-2 rounded-md">
               <div className="flex items-center gap-2"><BedDouble className="h-3.5 w-3.5" /> {imovel.quartos} quartos</div>
               <div className="flex items-center gap-2"><Ruler className="h-3.5 w-3.5" /> {imovel.area_m2} m²</div>
            </div>

            <div className="mt-auto space-y-2">
                <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 rounded-md border border-green-100">
                    <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold shrink-0">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-xs text-green-800 font-medium truncate">{imovel.nome_proprietario || "Proprietário"}</p>
                        <p className="text-[10px] text-green-600">Anunciante Particular</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full text-xs h-9" asChild>
                        <a href={imovel.link_original || "#"} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-3 w-3" /> Anúncio
                        </a>
                    </Button>
                    {imovel.telefone_proprietario ? (
                        <Button size="sm" className="w-full text-white text-xs h-9 bg-green-600 hover:bg-green-700" asChild>
                            <a href={`https://wa.me/55${imovel.telefone_proprietario.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">
                                <MessageCircle className="mr-2 h-3 w-3" /> Ligar
                            </a>
                        </Button>
                    ) : (
                         <Button size="sm" variant="ghost" disabled className="w-full text-xs h-9 opacity-50">Sem tel.</Button>
                    )}
                </div>
            </div>
         </div>
       </div>
     );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <AppHeader
        title="CRM & Leads"
        subtitle="Gestão inteligente da carteira de clientes"
      />

      <Card className="border-border shadow-soft flex-1 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle>Meus Leads ({totalLeads})</CardTitle>
            <CardDescription>
              Gerencie seus atendimentos e visualze os matches.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, bairro..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto flex flex-col">
          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
            <div className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Perfil de Busca</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => { 
                        setSelectedLead(lead); 
                        setIsDialogOpen(true); 
                        fetchMatchesForLead(lead);
                    }}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.nome || "Cliente sem nome"}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                             <Phone className="h-3 w-3" />
                             {lead.whatsapp}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>{lead.interesse_bairro || lead.cidade || "Qualquer região"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>Até {formatCurrency(lead.orcamento_max)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                         <div className="flex items-center justify-center gap-2">
                             <Button size="sm" variant="ghost" className="h-8 text-primary">
                                <Eye className="h-4 w-4 mr-2" /> Abrir CRM
                             </Button>
                             
                             <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => handlePauseRobot(lead, e)}
                                disabled={pausingId === lead.id}
                             >
                                {pausingId === lead.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CirclePause className="h-4 w-4" />
                                )}
                             </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             </div>

             {/* --- Paginação --- */}
             <div className="flex items-center justify-end gap-2 py-4 border-t mt-auto">
                <span className="text-xs text-muted-foreground mr-2">
                  Página {page + 1} de {Math.max(1, Math.ceil(totalLeads / ROWS_PER_PAGE))}
                </span>
                <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * ROWS_PER_PAGE >= totalLeads}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
             </div>
             </>
          )}
        </CardContent>
      </Card>

      {/* --- DIALOG FICHA DO CLIENTE --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl">
          
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/10 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                {selectedLead?.nome ? selectedLead.nome.substring(0,2).toUpperCase() : <User />}
              </div>
              <div>
                <DialogTitle className="text-xl">{selectedLead?.nome || "Detalhes do Lead"}</DialogTitle>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {selectedLead?.created_at && new Date(selectedLead.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedLead?.cidade}</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* --- BARRA DE FILTRO DE FONTES --- */}
          <div className="px-6 py-3 bg-muted/30 border-b border-border flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground uppercase tracking-wider mr-2">
              <Filter className="h-3.5 w-3.5" />
              Filtrar Fontes:
            </div>
            
            {availableSources.length === 0 && (
               <span className="text-xs text-red-400">Nenhuma fonte configurada. Contate o suporte.</span>
            )}

            {availableSources.map(source => {
              const isSelected = selectedSources.includes(source);
              return (
                <Button
                  key={source}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`h-7 text-xs rounded-full border-dashed ${isSelected ? "bg-primary text-white border-solid" : "text-muted-foreground"}`}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedSources(prev => prev.filter(s => s !== source));
                    } else {
                      setSelectedSources(prev => [...prev, source]);
                    }
                  }}
                >
                  {source}
                  {isSelected && <X className="ml-1 h-3 w-3" />}
                </Button>
              )
            })}
            
            {selectedSources.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => setSelectedSources([])}
              >
                Limpar
              </Button>
            )}
          </div>
          {/* --------------------------------------- */}

          <Tabs defaultValue="matches" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2 border-b border-border bg-background flex-shrink-0 z-10">
              <TabsList className="grid w-full max-w-[600px] grid-cols-3">
                <TabsTrigger value="matches">Imóveis & Oportunidades</TabsTrigger>
                
                {/* --- ABA NOVA: CAPTAÇÃO --- */}
                <TabsTrigger value="captacao" className="text-amber-600 data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50">
                    <Satellite className="h-4 w-4 mr-2" /> Radar Captação
                </TabsTrigger>

                <TabsTrigger value="dados">Dados Completos</TabsTrigger>
              </TabsList>
            </div>

            {/* --- CONTEÚDO 1: ESTOQUE E MATCHES (MANTIDO IGUAL) --- */}
            <TabsContent value="matches" className="flex-1 overflow-hidden relative mt-0">
              <ScrollArea className="h-full w-full">
                <div className="p-6 pb-20 space-y-8">
                  
                  {/* SEÇÃO 1: RECOMENDADOS */}
                  {selectedLead?.recommendedList && selectedLead.recommendedList.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                          <div className="p-1.5 bg-amber-100 rounded-md">
                            <Star className="h-5 w-5 fill-amber-600 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-amber-900">Imóveis Recomendados</h3>
                            <p className="text-xs text-amber-700/80">Seleção manual ideal para este perfil</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {selectedLead.recommendedList.map((imovel) => (
                            <ImovelCard key={imovel.id} imovel={imovel} lead={selectedLead} isRecommended={true} />
                          ))}
                        </div>
                    </div>
                  )}

                  {/* SEÇÃO 2: MATCHES SQL */}
                  <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-border">
                          <div className="p-1.5 bg-primary/10 rounded-md">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-foreground">Sugestões do Sistema</h3>
                            <p className="text-xs text-muted-foreground">
                                {selectedSources.length > 0 
                                  ? `Filtrando por: ${selectedSources.join(", ")}` 
                                  : "Exibindo todas as fontes permitidas"}
                            </p>
                          </div>
                      </div>
                      
                      {loadingMatches ? (
                         <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
                            <p className="text-muted-foreground">Buscando as melhores oportunidades...</p>
                         </div>
                      ) : (
                        <>
                          {selectedLead?.matches && selectedLead.matches.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {selectedLead.matches.map((imovel) => (
                                <ImovelCard key={imovel.id} imovel={imovel} lead={selectedLead} />
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/20">
                              <Home className="h-10 w-10 opacity-20 mb-2" />
                              <p>Nenhum match encontrado com os filtros atuais.</p>
                              {selectedSources.length > 0 && (
                                  <Button variant="link" onClick={() => setSelectedSources([])}>Limpar filtros de imobiliária</Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                  </div>

                </div>
              </ScrollArea>
            </TabsContent>

            {/* --- CONTEÚDO 2: CAPTAÇÃO (NOVO) --- */}
            <TabsContent value="captacao" className="flex-1 overflow-hidden relative mt-0">
                <ScrollArea className="h-full w-full">
                    <div className="p-6 pb-20 space-y-8">
                        
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <Satellite className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">Oportunidades de Captação (Particular)</h4>
                                <p className="text-xs text-amber-800/80 mt-1">
                                    Estes imóveis são de proprietários anunciando direto na internet. 
                                    Use esta lista para oferecer seus serviços ou agendar visitas para o seu lead.
                                </p>
                            </div>
                        </div>

                        {loadingMatches ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-amber-600 mb-2" />
                                <p className="text-muted-foreground">Varrendo o mercado...</p>
                            </div>
                        ) : (
                            <>
                                {selectedLead?.captacaoMatches && selectedLead.captacaoMatches.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {selectedLead.captacaoMatches.map((item) => (
                                            <CaptacaoCard key={item.id} imovel={item} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                        <Satellite className="h-10 w-10 opacity-20 mb-2" />
                                        <p>Nenhuma oportunidade de captação encontrada neste perfil (Bairro/Preço).</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </ScrollArea>
            </TabsContent>

            {/* --- CONTEÚDO 3: DADOS DO LEAD (MANTIDO IGUAL) --- */}
            <TabsContent value="dados" className="flex-1 overflow-hidden mt-0 relative">
              <ScrollArea className="h-full w-full">
                <div className="p-8 space-y-8 max-w-4xl mx-auto">
                  <section className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary uppercase tracking-wider">
                      <Search className="h-4 w-4" /> O que o cliente busca?
                    </h4>
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Cidade</span>
                        <p className="text-sm font-medium mt-1 flex items-center gap-1">
                           <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> 
                           {selectedLead?.cidade || "-"}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Bairro</span>
                        <p className="text-sm font-medium mt-1">{selectedLead?.interesse_bairro || "Todos"}</p>
                      </div>
                      <div className="col-span-2 md:col-span-2 bg-muted/30 -m-2 p-3 rounded-lg border border-border/50 flex justify-between items-center px-6">
                        <div>
                           <span className="text-xs text-muted-foreground block">Orçamento Mín.</span>
                           <span className="font-medium text-sm">{formatCurrency(selectedLead?.orcamento_minimo)}</span>
                        </div>
                        <div className="h-8 w-px bg-border mx-4"></div>
                        <div className="text-right">
                           <span className="text-xs text-muted-foreground block">Orçamento Máx.</span>
                           <span className="font-bold text-base text-green-600">{formatCurrency(selectedLead?.orcamento_max)}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary uppercase tracking-wider">
                      <Home className="h-4 w-4" /> Configuração Ideal
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center gap-2">
                        <BedDouble className="h-6 w-6 text-primary/80" />
                        <span className="text-xs text-muted-foreground font-bold">QUARTOS</span>
                        <span className="text-lg font-bold">{selectedLead?.quartos || "Indif."}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center gap-2">
                        <Bath className="h-6 w-6 text-primary/80" />
                        <span className="text-xs text-muted-foreground font-bold">BANHEIROS</span>
                        <span className="text-lg font-bold">{selectedLead?.banheiros || "Indif."}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center gap-2">
                        <Car className="h-6 w-6 text-primary/80" />
                        <span className="text-xs text-muted-foreground font-bold">VAGAS</span>
                        <span className="text-lg font-bold">{selectedLead?.vagas || "Indif."}</span>
                      </div>
                      <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center gap-2">
                        <Palmtree className="h-6 w-6 text-primary/80" />
                        <span className="text-xs text-muted-foreground font-bold">LAZER</span>
                        <span className="text-xs font-medium line-clamp-2">{selectedLead?.itens_lazer || "-"}</span>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-primary uppercase tracking-wider">
                      <User className="h-4 w-4" /> Contato
                    </h4>
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wide">Nome</span>
                        <p className="text-base font-medium mt-1">{selectedLead?.nome || "-"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wide">WhatsApp</span>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <p className="text-base font-medium">{selectedLead?.whatsapp || "-"}</p>
                          {selectedLead?.whatsapp && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 bg-green-50 hover:bg-green-100" asChild>
                              <a href={`https://wa.me/${selectedLead.whatsapp}`} target="_blank" rel="noreferrer">
                                <MessageCircle className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}