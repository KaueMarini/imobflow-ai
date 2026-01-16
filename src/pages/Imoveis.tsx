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
import { MapPin, Bed, Car, Maximize2, ExternalLink, Building2, Loader2, Bath, Filter, X, Search, DollarSign, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImovelUnico } from "@/types";

const ITEMS_PER_PAGE = 12;

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  // Ref para o infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Filtro de Negócio (Venda ou Aluguel)
  const [negocioFilter, setNegocioFilter] = useState<string>("venda");

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [bairroFilter, setBairroFilter] = useState<string>("todos");
  const [cidadeFilter, setCidadeFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [origemFilter, setOrigemFilter] = useState<string>("todos");
  const [quartosFilter, setQuartosFilter] = useState<string>("todos");
  const [banheirosFilter, setBanheirosFilter] = useState<string>("todos");
  const [vagasFilter, setVagasFilter] = useState<string>("todos");
  
  // Estado de Ordenação
  const [orderBy, setOrderBy] = useState<string>("recentes");

  // Ranges numéricos
  const [precoMin, setPrecoMin] = useState<number | "">("");
  const [precoMax, setPrecoMax] = useState<number | "">("");
  const [areaMin, setAreaMin] = useState<number | "">("");
  const [areaMax, setAreaMax] = useState<number | "">("");

  const [filterOptions, setFilterOptions] = useState({
    bairros: [] as string[],
    cidades: [] as string[],
    tipos: [] as string[],
    origens: [] as string[]
  });

  // 1. Carregar opções de filtro
  useEffect(() => {
    async function fetchOptions() {
      try {
        const { data, error } = await (supabase.rpc as any)('get_filtros_unicos');

        if (error) {
          console.error("Erro ao carregar filtros:", error);
          return;
        }

        if (data) {
          const limpar = (arr: any[]) => 
            (arr || [])
            .filter(item => item && typeof item === 'string' && item.trim() !== '')
            .sort();

          setFilterOptions({
            bairros: limpar(data.bairros),
            cidades: limpar(data.cidades),
            tipos: limpar(data.tipos),
            origens: limpar(data.origens)
          });
        }
      } catch (err) {
        console.error("Erro inesperado nos filtros:", err);
      }
    }
    fetchOptions();
  }, []);

  // 2. Função Principal de Busca
  const fetchImoveis = async (pageNumber: number, isNewFilter: boolean = false) => {
    try {
      setLoading(true);
      
      let query = (supabase as any)
        .from("imoveis_santos")
        .select("*", { count: "exact" });

      // --- LÓGICA CORRIGIDA: FILTRO DE TIPO DE NEGÓCIO ---
      // Se for "venda", traz 'venda' OU nulos (para compatibilidade com legado)
      if (negocioFilter === "venda") {
        query = query.or('tipo_negocio.eq.venda,tipo_negocio.is.null');
      } else if (negocioFilter === "aluguel") {
        query = query.eq("tipo_negocio", "aluguel");
      }

      // --- Demais Filtros ---
      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%,bairro.ilike.%${searchTerm}%`);
      }

      if (bairroFilter !== "todos") query = query.eq("bairro", bairroFilter);
      if (cidadeFilter !== "todos") query = query.eq("cidade", cidadeFilter);
      if (tipoFilter !== "todos") query = query.eq("tipo", tipoFilter);
      if (origemFilter !== "todos") query = query.eq("origem", origemFilter);
      
      if (quartosFilter !== "todos") query = query.gte("quartos", Number(quartosFilter));
      if (banheirosFilter !== "todos") query = query.gte("banheiros", Number(banheirosFilter));
      if (vagasFilter !== "todos") query = query.gte("vagas", Number(vagasFilter));

      if (precoMin !== "") query = query.gte("preco", Number(precoMin));
      if (precoMax !== "") query = query.lte("preco", Number(precoMax));
      if (areaMin !== "") query = query.gte("area_m2", Number(areaMin));
      if (areaMax !== "") query = query.lte("area_m2", Number(areaMax));

      // --- Ordenação ---
      switch (orderBy) {
        case "preco_asc":
            query = query.order("preco", { ascending: true });
            break;
        case "preco_desc":
            query = query.order("preco", { ascending: false });
            break;
        case "area_desc":
            query = query.order("area_m2", { ascending: false });
            break;
        case "antigos":
            query = query.order("created_at", { ascending: true });
            break;
        default: 
            query = query.order("created_at", { ascending: false }).order("id", { ascending: true });
            break;
      }

      // --- Paginação ---
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
        bairro: item.bairro,
        cidade: item.cidade || 'Santos',
        quartos: item.quartos,
        banheiros: item.banheiros,
        vagas: item.vagas,
        area_m2: item.area_m2,
        link: item.link,
        tipo: item.tipo,
        imagem_url: item.imagem_url,
        origem: item.origem || 'Scraper',
        tipo_negocio: item.tipo_negocio || 'venda', // Fallback visual
        itens_lazer: item.itens_lazer,
        created_at: item.created_at
      }));

      setImoveis(prev => isNewFilter ? imoveisFormatados : [...prev, ...imoveisFormatados]);
      
      if (count !== null && (from + ITEMS_PER_PAGE) >= count) {
        setHasMore(false);
      } else {
        setHasMore(data.length > 0);
      }

    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Resetar e buscar quando filtros mudam
  useEffect(() => {
    const timer = setTimeout(() => {
        setPage(0);
        setHasMore(true);
        fetchImoveis(0, true);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, bairroFilter, cidadeFilter, tipoFilter, origemFilter, quartosFilter, banheirosFilter, vagasFilter, precoMin, precoMax, areaMin, areaMax, orderBy, negocioFilter]);

  // 4. Observer
  const lastImovelElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => {
            const nextPage = prevPage + 1;
            fetchImoveis(nextPage, false);
            return nextPage;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const limparFiltros = () => {
    setSearchTerm("");
    setBairroFilter("todos");
    setCidadeFilter("todos");
    setTipoFilter("todos");
    setOrigemFilter("todos");
    setQuartosFilter("todos");
    setBanheirosFilter("todos");
    setVagasFilter("todos");
    setPrecoMin("");
    setPrecoMax("");
    setAreaMin("");
    setAreaMax("");
    setOrderBy("recentes");
  };

  const activeFiltersCount = [
    searchTerm,
    bairroFilter !== "todos",
    cidadeFilter !== "todos",
    tipoFilter !== "todos",
    origemFilter !== "todos",
    quartosFilter !== "todos",
    banheirosFilter !== "todos",
    vagasFilter !== "todos",
    precoMin !== "",
    precoMax !== "",
    areaMin !== "",
    areaMax !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Imóveis Disponíveis" subtitle={`${imoveis.length} carregados`} />
      
      <div className="p-6 container mx-auto">
        
        {/* ABAS DE TIPO DE NEGÓCIO */}
        <div className="flex justify-center mb-6">
            <Tabs value={negocioFilter} onValueChange={setNegocioFilter} className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="venda">Comprar</TabsTrigger>
                    <TabsTrigger value="aluguel">Alugar</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>

        {/* === BARRA DE FILTROS === */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, descrição, bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                  {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filtros Avançados</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Preço</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs text-muted-foreground">Mínimo</Label><Input type="number" placeholder="0" value={precoMin} onChange={(e) => setPrecoMin(e.target.value ? Number(e.target.value) : "")} /></div>
                      <div><Label className="text-xs text-muted-foreground">Máximo</Label><Input type="number" placeholder="Máx" value={precoMax} onChange={(e) => setPrecoMax(e.target.value ? Number(e.target.value) : "")} /></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2"><Maximize2 className="h-4 w-4" /> Área (m²)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs text-muted-foreground">Mínimo</Label><Input type="number" placeholder="0" value={areaMin} onChange={(e) => setAreaMin(e.target.value ? Number(e.target.value) : "")} /></div>
                      <div><Label className="text-xs text-muted-foreground">Máximo</Label><Input type="number" placeholder="Máx" value={areaMax} onChange={(e) => setAreaMax(e.target.value ? Number(e.target.value) : "")} /></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Origem</Label>
                        <Select value={origemFilter} onValueChange={setOrigemFilter}>
                            <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas</SelectItem>
                                {filterOptions.origens.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Banheiros</Label>
                        <Select value={banheirosFilter} onValueChange={setBanheirosFilter}>
                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Qualquer</SelectItem>
                                {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}+</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Vagas</Label>
                        <Select value={vagasFilter} onValueChange={setVagasFilter}>
                            <SelectTrigger><SelectValue placeholder="Qualquer" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Qualquer</SelectItem>
                                {[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n}+</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={limparFiltros}><X className="h-4 w-4 mr-2" /> Limpar filtros</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recentes">Mais Recentes</SelectItem>
                    <SelectItem value="antigos">Mais Antigos</SelectItem>
                    <SelectItem value="preco_asc">Menor Preço</SelectItem>
                    <SelectItem value="preco_desc">Maior Preço</SelectItem>
                    <SelectItem value="area_desc">Maior Área</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Bairro" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos bairros</SelectItem>
                {filterOptions.bairros.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={quartosFilter} onValueChange={setQuartosFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Quartos" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Quartos</SelectItem>
                {[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n}+ quartos</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos tipos</SelectItem>
                {filterOptions.tipos.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* === GRID DE IMÓVEIS === */}
        {imoveis.length === 0 && !loading ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground mb-4">Tente ajustar os filtros.</p>
            <Button variant="outline" onClick={limparFiltros}>Limpar filtros</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {imoveis.map((imovel, index) => {
                if (imoveis.length === index + 1) {
                    return (
                        <div ref={lastImovelElementRef} key={imovel.id}>
                            <ImovelCardItem imovel={imovel} />
                        </div>
                    );
                } else {
                    return <ImovelCardItem key={imovel.id} imovel={imovel} />;
                }
            })}
          </div>
        )}

        {loading && (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        )}
        
        {!hasMore && imoveis.length > 0 && (
            <p className="text-center text-muted-foreground mt-8 text-sm">Você chegou ao fim da lista.</p>
        )}
      </div>
    </div>
  );
}

const ImovelCardItem = ({ imovel }: { imovel: ImovelUnico }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all border-border h-full flex flex-col">
    <div className="relative h-56 bg-muted">
        {imovel.imagem_url ? (
        <img 
            src={imovel.imagem_url} 
            alt={imovel.titulo || "Imóvel"} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => (e.currentTarget.style.display = 'none')} 
        />
        ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground"><Building2 size={40} /></div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-black/70 backdrop-blur-sm capitalize">{imovel.origem}</Badge>
            <Badge variant={imovel.tipo_negocio === 'aluguel' ? "secondary" : "default"} className="backdrop-blur-sm capitalize border border-white/20">
                {imovel.tipo_negocio === 'aluguel' ? 'Aluguel' : 'Venda'}
            </Badge>
        </div>

        <div className="absolute bottom-3 right-3 bg-background/95 px-3 py-1 rounded-md font-bold text-sm shadow-lg text-foreground">
        {imovel.preco ? `R$ ${imovel.preco.toLocaleString('pt-BR')}` : 'Sob Consulta'}
        </div>
    </div>
    <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground" title={imovel.titulo || "Imóvel"}>{imovel.titulo || "Imóvel sem título"}</h3>
        <div className="flex items-center text-sm text-muted-foreground mb-4 font-medium">
        <MapPin className="h-4 w-4 mr-1 text-primary" /> {imovel.bairro || "Bairro não informado"}
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mb-4 bg-muted/50 p-2 rounded-lg border">
        <div className="flex flex-col items-center gap-1"><Bed size={16} className="text-muted-foreground"/> <span>{imovel.quartos || '-'}</span></div>
        <div className="flex flex-col items-center gap-1"><Bath size={16} className="text-muted-foreground"/> <span>{imovel.banheiros || '-'}</span></div>
        <div className="flex flex-col items-center gap-1"><Car size={16} className="text-muted-foreground"/> <span>{imovel.vagas || '-'}</span></div>
        <div className="flex flex-col items-center gap-1"><Maximize2 size={16} className="text-muted-foreground"/> <span>{imovel.area_m2 || '-'} m²</span></div>
        </div>
        
        <div className="mt-auto">
            <Button variant="outline" className="w-full" asChild>
            <a href={imovel.link || '#'} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" /> Ver Anúncio
            </a>
            </Button>
        </div>
    </CardContent>
    </Card>
);