import { useEffect, useState, useRef, useCallback } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Bed, Car, Maximize2, ExternalLink, Loader2, 
  Filter, X, Search, SlidersHorizontal, ArrowUpDown, Check, ChevronsUpDown, Globe, Building
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ImovelUnico } from "@/types";

const ITEMS_PER_PAGE = 12;

const capitalize = (str: string) => {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  
  // --- FILTROS ---
  const [negocioFilter, setNegocioFilter] = useState<string>("venda");
  const [searchTerm, setSearchTerm] = useState("");
  
  // FILTRO UNIFICADO DE LOCALIZAÇÃO (Cidade + Bairro)
  const [localizacaoOpen, setLocalizacaoOpen] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<string>(""); // Formato: "Cidade - Bairro"
  
  // Filtros internos para a query
  const [cidadeQuery, setCidadeQuery] = useState<string>("todas");
  const [bairroQuery, setBairroQuery] = useState<string>("todos");

  // Outros Filtros
  const [origemFilter, setOrigemFilter] = useState<string>("todas");
  const [quartosFilter, setQuartosFilter] = useState<string>("todos");
  const [precoMin, setPrecoMin] = useState<number | "">("");
  const [precoMax, setPrecoMax] = useState<number | "">("");
  const [orderBy, setOrderBy] = useState<string>("recentes");

  // Dados Carregados
  const [listaLocais, setListaLocais] = useState<{cidade: string, bairro: string, label: string}[]>([]);
  const [availableOrigins, setAvailableOrigins] = useState<string[]>([]);

  // 1. CARREGAR DADOS DOS FILTROS
  useEffect(() => {
    async function fetchFilterData() {
      // Busca locais únicos (Cidade + Bairro)
      const { data: locais, error: errLocais } = await (supabase.rpc as any)('get_mapa_locais_santos');
      
      if (!errLocais && locais) {
        // Cria uma lista plana para o Combobox: "Santos - Gonzaga", "Praia Grande - Boqueirão"
        const listaFormatada = locais
            .filter((i: any) => i.cidade && i.bairro)
            .map((i: any) => {
                const cid = capitalize(i.cidade);
                const bai = capitalize(i.bairro);
                return {
                    cidade: cid,
                    bairro: bai,
                    label: `${cid} - ${bai}` // O que o usuário vê e digita
                };
            })
            .sort((a: any, b: any) => a.label.localeCompare(b.label));

        setListaLocais(listaFormatada);
      }

      // Busca Origens
      const { data: origens, error: errOrigens } = await (supabase.rpc as any)('get_filtros_imoveis_santos');
      if (!errOrigens && origens && origens.length > 0) {
          setAvailableOrigins(origens[0].origens || []);
      }
    }
    fetchFilterData();
  }, []);

  // 2. BUSCA PRINCIPAL
  const fetchImoveis = async (pageNumber: number, isNewFilter: boolean = false) => {
    setLoading(true);
    try {
      let query = (supabase as any)
        .from("imoveis_santos")
        .select("*", { count: "exact" });

      // Filtro Negócio
      if (negocioFilter === "venda") query = query.or('tipo_negocio.eq.venda,tipo_negocio.is.null');
      else if (negocioFilter === "aluguel") query = query.eq("tipo_negocio", "aluguel");

      // Busca Texto Livre
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`);
      }

      // === A MÁGICA DA LOCALIZAÇÃO ===
      // Se selecionou algo no combobox, filtra exatamente aquela combinação
      if (cidadeQuery !== "todas") query = query.ilike("cidade", cidadeQuery);
      if (bairroQuery !== "todos") query = query.ilike("bairro", bairroQuery);
      
      // Outros Filtros
      if (origemFilter !== "todas") query = query.eq("origem", origemFilter);
      if (quartosFilter !== "todos") query = query.gte("quartos", Number(quartosFilter));
      if (precoMin !== "") query = query.gte("preco", Number(precoMin));
      if (precoMax !== "") query = query.lte("preco", Number(precoMax));

      // Ordenação
      switch (orderBy) {
        case "preco_asc": query = query.order("preco", { ascending: true }); break;
        case "preco_desc": query = query.order("preco", { ascending: false }); break;
        case "area_desc": query = query.order("area_m2", { ascending: false }); break;
        default: query = query.order("created_at", { ascending: false }).order("id", { ascending: true }); break;
      }

      const from = pageNumber * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      const imoveisFormatados: ImovelUnico[] = (data || []).map((item: any) => ({
        id: String(item.id),
        titulo: item.titulo,
        descricao: item.descricao,
        preco: item.preco,
        condominio: item.condominio,
        iptu: item.iptu,
        bairro: capitalize(item.bairro),
        cidade: capitalize(item.cidade),
        quartos: item.quartos,
        banheiros: item.banheiros,
        vagas: item.vagas,
        area_m2: item.area_m2,
        link: item.link,
        tipo: item.tipo,
        imagem_url: item.imagem_url,
        origem: item.origem || 'Sistema',
        tipo_negocio: item.tipo_negocio || 'venda',
        created_at: item.created_at
      }));

      setImoveis(prev => isNewFilter ? imoveisFormatados : [...prev, ...imoveisFormatados]);
      
      if (count !== null && (from + ITEMS_PER_PAGE) >= count) {
        setHasMore(false);
      } else {
        setHasMore(data.length > 0);
      }

    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce e Watchers
  useEffect(() => {
    const timer = setTimeout(() => {
        setPage(0);
        setHasMore(true);
        fetchImoveis(0, true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, cidadeQuery, bairroQuery, origemFilter, quartosFilter, precoMin, precoMax, orderBy, negocioFilter]);

  const lastImovelElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
            const next = prev + 1;
            fetchImoveis(next, false);
            return next;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const limparFiltros = () => {
    setSearchTerm("");
    setSelectedLocal(""); // Limpa visual
    setCidadeQuery("todas"); // Limpa lógica
    setBairroQuery("todos"); // Limpa lógica
    setOrigemFilter("todas");
    setQuartosFilter("todos");
    setPrecoMin("");
    setPrecoMax("");
    setOrderBy("recentes");
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Carteira de Imóveis" subtitle={`${imoveis.length} ativos`} />
      
      <div className="p-6 container mx-auto">
        
        {/* ABAS */}
        <div className="flex justify-center mb-6">
            <Tabs value={negocioFilter} onValueChange={setNegocioFilter} className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="venda">Comprar</TabsTrigger>
                    <TabsTrigger value="aluguel">Alugar</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {/* === FILTROS === */}
        <div className="mb-6 bg-card p-4 rounded-xl border shadow-sm space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
             
             {/* 1. Busca por ID/Texto */}
             <div className="md:col-span-3 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="ID, Título, Condomínio..." 
                 className="pl-9"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
             </div>

             {/* 2. LOCALIZAÇÃO INTELIGENTE (O Grande Truque) */}
             <div className="md:col-span-4">
                 <Popover open={localizacaoOpen} onOpenChange={setLocalizacaoOpen}>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       role="combobox"
                       aria-expanded={localizacaoOpen}
                       className="w-full justify-between font-normal text-muted-foreground hover:text-foreground"
                     >
                       <div className="flex items-center gap-2 truncate">
                           <MapPin className={cn("h-4 w-4", selectedLocal ? "text-primary" : "text-muted-foreground")} />
                           <span className={cn("truncate", selectedLocal ? "text-foreground font-medium" : "")}>
                               {selectedLocal || "Cidade ou Bairro..."}
                           </span>
                       </div>
                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-[300px] p-0" align="start">
                     <Command>
                       <CommandInput placeholder="Digite cidade ou bairro..." />
                       <CommandList>
                         <CommandEmpty>Local não encontrado.</CommandEmpty>
                         <CommandGroup heading="Locais Disponíveis">
                           {/* Opção para limpar */}
                           <CommandItem
                             value="todos"
                             onSelect={() => {
                               setSelectedLocal("");
                               setCidadeQuery("todas");
                               setBairroQuery("todos");
                               setLocalizacaoOpen(false);
                             }}
                           >
                             <Globe className="mr-2 h-4 w-4" />
                             Todas as Localizações
                           </CommandItem>

                           {/* Lista Filtrada */}
                           {listaLocais.map((local, idx) => (
                             <CommandItem
                               key={`${local.cidade}-${local.bairro}-${idx}`}
                               value={local.label} // Isso permite buscar "Gonzaga" e achar "Santos - Gonzaga"
                               onSelect={(currentValue) => {
                                 setSelectedLocal(local.label);
                                 setCidadeQuery(local.cidade);
                                 setBairroQuery(local.bairro);
                                 setLocalizacaoOpen(false);
                               }}
                             >
                               <Check
                                 className={cn(
                                   "mr-2 h-4 w-4",
                                   selectedLocal === local.label ? "opacity-100" : "opacity-0"
                                 )}
                               />
                               {local.label}
                             </CommandItem>
                           ))}
                         </CommandGroup>
                       </CommandList>
                     </Command>
                   </PopoverContent>
                 </Popover>
             </div>

             {/* 3. Sistema/Origem */}
             <div className="md:col-span-3">
                <Select value={origemFilter} onValueChange={setOrigemFilter}>
                    <SelectTrigger>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span className="text-foreground truncate">{origemFilter === 'todas' ? 'Todos os Sistemas' : origemFilter}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todas">Todos os Sistemas</SelectItem>
                        {availableOrigins.map(origin => (
                            <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>

             {/* 4. Filtros Avançados */}
             <div className="md:col-span-2 flex gap-2">
                 <Sheet>
                   <SheetTrigger asChild>
                     <Button variant="outline" className="w-full gap-2">
                       <SlidersHorizontal className="h-4 w-4" /> Filtros
                     </Button>
                   </SheetTrigger>
                   <SheetContent>
                       <SheetHeader><SheetTitle>Refinar Busca</SheetTitle></SheetHeader>
                       <div className="mt-6 space-y-6">
                           <div className="space-y-3">
                             <Label>Preço (R$)</Label>
                             <div className="flex gap-2">
                                <Input placeholder="Min" type="number" value={precoMin} onChange={e => setPrecoMin(Number(e.target.value))} />
                                <Input placeholder="Max" type="number" value={precoMax} onChange={e => setPrecoMax(Number(e.target.value))} />
                             </div>
                           </div>
                           <div className="space-y-3">
                             <Label>Quartos</Label>
                             <Select value={quartosFilter} onValueChange={setQuartosFilter}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Qualquer</SelectItem>
                                    <SelectItem value="1">1+</SelectItem>
                                    <SelectItem value="2">2+</SelectItem>
                                    <SelectItem value="3">3+</SelectItem>
                                    <SelectItem value="4">4+</SelectItem>
                                </SelectContent>
                             </Select>
                           </div>
                           <Button onClick={limparFiltros} variant="destructive" className="w-full mt-4">Limpar Tudo</Button>
                       </div>
                   </SheetContent>
                 </Sheet>
             </div>

             {/* LINHA 2: Ordenação e Chips */}
             <div className="md:col-span-12 flex flex-wrap items-center gap-3 pt-2 border-t mt-2">
                 <Select value={orderBy} onValueChange={setOrderBy}>
                    <SelectTrigger className="h-8 w-[180px] text-xs">
                        <ArrowUpDown className="h-3 w-3 mr-2 text-muted-foreground" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recentes">Mais Recentes</SelectItem>
                        <SelectItem value="preco_asc">Menor Preço</SelectItem>
                        <SelectItem value="preco_desc">Maior Preço</SelectItem>
                        <SelectItem value="area_desc">Maior Área</SelectItem>
                    </SelectContent>
                 </Select>

                 {/* Chips visuais do que está filtrado */}
                 {selectedLocal && (
                    <Badge variant="secondary" className="h-7 px-2 flex items-center gap-1 cursor-pointer" onClick={() => { setSelectedLocal(""); setCidadeQuery("todas"); setBairroQuery("todos"); }}>
                        {selectedLocal} <X className="h-3 w-3" />
                    </Badge>
                 )}
                 {precoMin && <Badge variant="outline" className="h-7">Min: R$ {precoMin}</Badge>}
                 
                 <div className="flex-1" />
                 
                 {(searchTerm || selectedLocal || origemFilter !== "todas") && (
                    <Button variant="ghost" size="sm" onClick={limparFiltros} className="h-7 text-xs text-muted-foreground">
                        Limpar Filtros
                    </Button>
                 )}
             </div>
          </div>
        </div>

        {/* === GRID === */}
        {imoveis.length === 0 && !loading ? (
             <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
                <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-medium">Nenhum imóvel encontrado.</h3>
                <Button variant="link" onClick={limparFiltros}>Limpar Filtros</Button>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {imoveis.map((imovel, index) => (
                    <div ref={index === imoveis.length - 1 ? lastImovelElementRef : null} key={imovel.id}>
                        <ImovelCardItem imovel={imovel} />
                    </div>
                ))}
            </div>
        )}

        {loading && <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}
      </div>
    </div>
  );
}

// CARD ATUALIZADO
const ImovelCardItem = ({ imovel }: { imovel: ImovelUnico }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all border-border/60 h-full flex flex-col bg-card">
       <div className="h-56 bg-muted relative overflow-hidden">
          <img 
            src={imovel.imagem_url || ""} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" 
            alt={imovel.titulo} 
            onError={e => e.currentTarget.style.display = 'none'} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[90%]">
             {/* ORIGEM DO SISTEMA */}
             <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md border-0 text-white font-semibold shadow-sm">
                {imovel.origem}
             </Badge>
             <Badge variant={imovel.tipo_negocio === 'aluguel' ? "secondary" : "outline"} className="bg-white/20 text-white border-white/30 backdrop-blur-md">
                {capitalize(imovel.tipo_negocio || 'venda')}
             </Badge>
          </div>

          <div className="absolute bottom-3 left-3 text-white">
             <p className="text-xl font-bold shadow-black drop-shadow-md">
                {imovel.preco ? `R$ ${imovel.preco.toLocaleString('pt-BR')}` : 'Sob Consulta'}
             </p>
          </div>
       </div>
       
       <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
             <h3 className="font-bold truncate text-base" title={imovel.titulo}>{imovel.titulo}</h3>
             <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1 text-primary" /> 
                {imovel.bairro} - {imovel.cidade}
             </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t text-xs text-muted-foreground">
             <div className="flex items-center gap-1 justify-center bg-muted/40 p-1 rounded">
                <Bed className="h-3.5 w-3.5" /> {imovel.quartos || '-'} <span className="hidden sm:inline">Qts</span>
             </div>
             <div className="flex items-center gap-1 justify-center bg-muted/40 p-1 rounded">
                <Car className="h-3.5 w-3.5" /> {imovel.vagas || '-'} <span className="hidden sm:inline">Vgs</span>
             </div>
             <div className="flex items-center gap-1 justify-center bg-muted/40 p-1 rounded">
                <Maximize2 className="h-3.5 w-3.5" /> {imovel.area_m2 || '-'} m²
             </div>
          </div>

          <Button className="w-full mt-4" variant="outline" asChild>
             <a href={imovel.link} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> Ver Detalhes
             </a>
          </Button>
       </CardContent>
    </Card>
);