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
import { useToast } from "@/hooks/use-toast"; // Import do Toast
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
  CirclePause, // Ícone de Pausa
  Bot // Ícone de Robô
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

  matches?: ScoredImovel[]; 
  recommendedList?: Imovel[]; 
}

interface ScoredImovel extends Imovel {
  score: number; 
  matchReasons: string[];
}

export default function CRM() {
  const { user } = useAuth();
  const { toast } = useToast(); // Hook de notificação
  const [leads, setLeads] = useState<Lead[]>([]);
  const [imoveisCache, setImoveisCache] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para controlar qual botão está carregando o webhook
  const [pausingId, setPausingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setLoading(true);
      try {
        const sb = supabase as any;

        // 1. Buscar Todos os Imóveis
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

        // 3. Processamento
        const leadsProcessados = listaLeads.map(lead => {
          let recommendedList: Imovel[] = [];
          if (lead.imoveis_recomendados && lead.imoveis_recomendados.length > 0) {
            const recIdsString = lead.imoveis_recomendados.map(id => String(id));
            recommendedList = listaImoveis.filter(imovel => 
              recIdsString.includes(String(imovel.id))
            );
          }
          const matches = calcularMatches(lead, listaImoveis);
          return { ...lead, matches, recommendedList };
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

  // --- Função para Pausar Robô (Webhook n8n) ---
  const handlePauseRobot = async (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que abra a ficha do cliente ao clicar no botão
    setPausingId(lead.id);

    // 👇 COLOQUE AQUI O SEU URL DO N8N
    const N8N_WEBHOOK_URL = "https://seu-n8n.com/webhook/pausar-robo"; 

    try {
      // Simulação do envio (Remova o setTimeout e descomente o fetch quando tiver a URL)
      // const response = await fetch(N8N_WEBHOOK_URL, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     lead_id: lead.id,
      //     nome: lead.nome,
      //     whatsapp: lead.whatsapp,
      //     action: "PAUSE_AUTOMATION"
      //   })
      // });
      
      // Simulação de delay para você ver o loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "⛔ Robô Pausado",
        description: `Automação interrompida para ${lead.nome}. Dados enviados ao n8n.`,
        variant: "destructive", // Vermelho
      });

      console.log("Webhook enviado para:", { 
        nome: lead.nome, 
        whatsapp: lead.whatsapp 
      });

    } catch (error) {
      toast({
        title: "Erro ao pausar",
        description: "Não foi possível comunicar com o robô.",
        variant: "destructive",
      });
    } finally {
      setPausingId(null);
    }
  };

  function parseNumber(val: string | number | null): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const nums = val.replace(/\D/g, ""); 
    return nums ? parseInt(nums) : 0;
  }

  function calcularMatches(lead: Lead, imoveis: Imovel[]): ScoredImovel[] {
    const recIdsString = lead.imoveis_recomendados?.map(id => String(id)) || [];

    const scored = imoveis.map(imovel => {
      if (recIdsString.includes(String(imovel.id))) {
        return { ...imovel, score: -1, matchReasons: [] }; 
      }

      let score = 0;
      const reasons: string[] = [];

      const leadBairro = (lead.interesse_bairro || "").toLowerCase().trim();
      const leadCidade = (lead.cidade || "").toLowerCase().trim();
      const leadMaxPrice = lead.orcamento_max || 0;
      const leadMinPrice = lead.orcamento_minimo || 0;
      const leadQuartos = lead.quartos || 0;
      const leadVagas = parseNumber(lead.vagas);
      const leadBanheiros = parseNumber(lead.banheiros);

      // Algoritmo de Match (Mantido igual)
      const imovelBairro = (imovel.bairro || "").toLowerCase();
      const imovelCidade = (imovel.cidade || "").toLowerCase();
      
      if (leadBairro) {
        if (imovelBairro.includes(leadBairro) || imovelCidade.includes(leadBairro)) score += 40;
        else if (leadCidade && imovelCidade.includes(leadCidade)) score += 10;
        else score -= 50;
      } else if (leadCidade) {
        if (imovelCidade.includes(leadCidade)) score += 40;
        else score -= 50;
      } else {
        score += 40;
      }

      const price = imovel.preco || 0;
      if (price > 0 && leadMaxPrice > 0) {
        if (price <= leadMaxPrice) {
          const piso = leadMinPrice > 0 ? leadMinPrice : (leadMaxPrice * 0.6);
          if (price >= piso) {
             score += 25; 
             reasons.push("Preço ideal");
          } else {
             score += 10;
             reasons.push("Abaixo do padrão");
          }
        } else if (price <= leadMaxPrice * 1.1) {
          score += 15;
          reasons.push("Pouco acima");
        } else {
          score -= 30;
        }
      } else {
        score += 25;
      }

      const imovelQuartos = imovel.quartos || 0;
      if (leadQuartos > 0) {
        if (imovelQuartos >= leadQuartos) {
          score += 20;
          reasons.push(`${imovelQuartos} quartos`);
        } else if (imovelQuartos === leadQuartos - 1) score += 5;
        else score -= 20;
      } else score += 20;

      if (leadVagas > 0 && (imovel.vagas || 0) >= leadVagas) score += 10;
      else if (!leadVagas) score += 10;

      if (leadBanheiros > 0 && (imovel.banheiros || 0) >= leadBanheiros) score += 5;

      if (lead.itens_lazer) {
        const keywords = lead.itens_lazer.split(',').map(k => k.trim().toLowerCase());
        const imovelDesc = (imovel.descricao + " " + imovel.itens_lazer).toLowerCase();
        if (keywords.some(k => k && imovelDesc.includes(k))) {
          score += 5;
          reasons.push("Item desejado");
        }
      }

      return { ...imovel, score: Math.min(100, Math.max(0, Math.round(score))), matchReasons: reasons };
    });

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

  const ImovelCard = ({ imovel, lead, isRecommended = false }: { imovel: Imovel, lead: Lead, isRecommended?: boolean }) => {
    const score = (imovel as ScoredImovel).score;
    
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
              {isRecommended && (
                <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white shadow-sm flex gap-1 items-center px-2 py-1">
                  <Star className="h-3 w-3 fill-white" /> Recomendado
                </Badge>
              )}
              {!isRecommended && (
                <Badge className={`shadow-sm border-none text-white ${
                  (score >= 90) ? 'bg-green-600' : 
                  (score >= 70) ? 'bg-blue-600' : 'bg-yellow-600'
                }`}>
                  {score}% Match
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

          {!isRecommended && (imovel as ScoredImovel).matchReasons && (
            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[24px]">
              {(imovel as ScoredImovel).matchReasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="text-[10px] bg-secondary/80 px-2 py-0.5 rounded-full text-secondary-foreground font-medium border border-secondary">
                  {reason}
                </span>
              ))}
            </div>
          )}

          {isRecommended && (
             <div className="flex items-center gap-1.5 mb-4 min-h-[24px] text-amber-700 bg-amber-50 px-2 py-1 rounded-md text-[11px] font-medium border border-amber-100">
                <Sparkles className="h-3 w-3" /> Seleção Exclusiva
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
              <a 
                href={`https://wa.me/${lead.whatsapp}?text=Olá ${lead.nome}, ${isRecommended ? 'separei este imóvel exclusivo para você' : 'olha essa oportunidade que encontrei'}: ${imovel.link}`} 
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
            <CardTitle>Meus Leads</CardTitle>
            <CardDescription>
              {leads.length} clientes ativos na base
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, bairro..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Perfil de Busca</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedLead(lead); setIsDialogOpen(true); }}>
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
                      <div className="flex flex-col items-center gap-1">
                        {lead.recommendedList && lead.recommendedList.length > 0 && (
                           <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 text-[10px] px-2">
                              <Star className="h-3 w-3 mr-1 fill-amber-600 text-amber-600" />
                              {lead.recommendedList.length} Recomendados
                           </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {lead.matches?.length || 0} matches auto
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Agrupamento de Botões de Ação */}
                      <div className="flex items-center justify-end gap-2">
                        {/* Botão de Pausar Robô */}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="h-8 px-2.5"
                          onClick={(e) => handlePauseRobot(lead, e)}
                          disabled={pausingId === lead.id}
                          title="Pausar automação do robô para este lead"
                        >
                          {pausingId === lead.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Bot className="h-4 w-4 mr-1.5" />
                              <CirclePause className="h-4 w-4" />
                            </>
                          )}
                        </Button>

                        {/* Botão de Ver Ficha */}
                        <Button size="sm" variant="ghost" className="h-8">
                          <User className="mr-2 h-4 w-4" /> Ficha
                        </Button>
                      </div>
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

          <Tabs defaultValue="matches" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-2 border-b border-border bg-background flex-shrink-0 z-10">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2">
                <TabsTrigger value="matches">Imóveis & Oportunidades</TabsTrigger>
                <TabsTrigger value="dados">Dados Completos</TabsTrigger>
              </TabsList>
            </div>

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

                  {/* SEÇÃO 2: MATCHES */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 pb-2 border-b border-border">
                        <div className="p-1.5 bg-primary/10 rounded-md">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">Sugestões do Sistema</h3>
                          <p className="text-xs text-muted-foreground">Baseado em inteligência artificial</p>
                        </div>
                     </div>
                     
                     {selectedLead?.matches && selectedLead.matches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {selectedLead.matches.map((imovel) => (
                          <ImovelCard key={imovel.id} imovel={imovel} lead={selectedLead} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-muted/20">
                        <Home className="h-10 w-10 opacity-20 mb-2" />
                        <p>Nenhum match automático encontrado.</p>
                      </div>
                    )}
                  </div>

                </div>
              </ScrollArea>
            </TabsContent>

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