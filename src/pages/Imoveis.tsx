import { useEffect, useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Bed, Car, Maximize2, ExternalLink, Building2, Loader2, Bath, Filter, X, Search, Home, DollarSign, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImovelUnico } from "@/types"; 

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [bairroFilter, setBairroFilter] = useState<string>("todos");
  const [cidadeFilter, setCidadeFilter] = useState<string>("todos");
  const [tipoFilter, setTipoFilter] = useState<string>("todos");
  const [origemFilter, setOrigemFilter] = useState<string>("todos");
  const [quartosFilter, setQuartosFilter] = useState<string>("todos");
  const [banheirosFilter, setBanheirosFilter] = useState<string>("todos");
  const [vagasFilter, setVagasFilter] = useState<string>("todos");
  const [precoMin, setPrecoMin] = useState<number>(0);
  const [precoMax, setPrecoMax] = useState<number>(10000000);
  const [areaMin, setAreaMin] = useState<number>(0);
  const [areaMax, setAreaMax] = useState<number>(1000);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("imoveis_santos" as any) 
          .select("*")
          .order("created_at", { ascending: false });

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
          itens_lazer: item.itens_lazer,
          created_at: item.created_at
        }));

        setImoveis(imoveisFormatados);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImoveis();
  }, []);

  // Extrair opções únicas para os selects
  const filterOptions = useMemo(() => {
    const bairros = [...new Set(imoveis.map(i => i.bairro).filter(Boolean))].sort();
    const cidades = [...new Set(imoveis.map(i => i.cidade).filter(Boolean))].sort();
    const tipos = [...new Set(imoveis.map(i => i.tipo).filter(Boolean))].sort();
    const origens = [...new Set(imoveis.map(i => i.origem).filter(Boolean))].sort();
    const quartosOptions = [...new Set(imoveis.map(i => i.quartos).filter(q => q !== null && q !== undefined))].sort((a, b) => (a || 0) - (b || 0));
    const banheirosOptions = [...new Set(imoveis.map(i => i.banheiros).filter(b => b !== null && b !== undefined))].sort((a, b) => (a || 0) - (b || 0));
    const vagasOptions = [...new Set(imoveis.map(i => i.vagas).filter(v => v !== null && v !== undefined))].sort((a, b) => (a || 0) - (b || 0));
    
    const precos = imoveis.map(i => i.preco).filter(p => p !== null && p !== undefined) as number[];
    const areas = imoveis.map(i => i.area_m2).filter(a => a !== null && a !== undefined) as number[];
    
    return {
      bairros,
      cidades,
      tipos,
      origens,
      quartosOptions,
      banheirosOptions,
      vagasOptions,
      maxPreco: Math.max(...precos, 10000000),
      minPreco: Math.min(...precos, 0),
      maxArea: Math.max(...areas, 1000),
      minArea: Math.min(...areas, 0),
    };
  }, [imoveis]);

  // Filtrar imóveis
  const imoveisFiltrados = useMemo(() => {
    return imoveis.filter(imovel => {
      // Busca por texto
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchSearch = 
          imovel.titulo?.toLowerCase().includes(search) ||
          imovel.descricao?.toLowerCase().includes(search) ||
          imovel.bairro?.toLowerCase().includes(search) ||
          imovel.cidade?.toLowerCase().includes(search);
        if (!matchSearch) return false;
      }

      // Filtros de seleção
      if (bairroFilter !== "todos" && imovel.bairro !== bairroFilter) return false;
      if (cidadeFilter !== "todos" && imovel.cidade !== cidadeFilter) return false;
      if (tipoFilter !== "todos" && imovel.tipo !== tipoFilter) return false;
      if (origemFilter !== "todos" && imovel.origem !== origemFilter) return false;
      if (quartosFilter !== "todos" && imovel.quartos !== Number(quartosFilter)) return false;
      if (banheirosFilter !== "todos" && imovel.banheiros !== Number(banheirosFilter)) return false;
      if (vagasFilter !== "todos" && imovel.vagas !== Number(vagasFilter)) return false;

      // Filtros de range
      if (imovel.preco !== null && imovel.preco !== undefined) {
        if (imovel.preco < precoMin || imovel.preco > precoMax) return false;
      }
      if (imovel.area_m2 !== null && imovel.area_m2 !== undefined) {
        if (imovel.area_m2 < areaMin || imovel.area_m2 > areaMax) return false;
      }

      return true;
    });
  }, [imoveis, searchTerm, bairroFilter, cidadeFilter, tipoFilter, origemFilter, quartosFilter, banheirosFilter, vagasFilter, precoMin, precoMax, areaMin, areaMax]);

  const limparFiltros = () => {
    setSearchTerm("");
    setBairroFilter("todos");
    setCidadeFilter("todos");
    setTipoFilter("todos");
    setOrigemFilter("todos");
    setQuartosFilter("todos");
    setBanheirosFilter("todos");
    setVagasFilter("todos");
    setPrecoMin(0);
    setPrecoMax(10000000);
    setAreaMin(0);
    setAreaMax(1000);
  };

  const activeFiltersCount = [
    searchTerm,
    bairroFilter !== "todos" ? bairroFilter : null,
    cidadeFilter !== "todos" ? cidadeFilter : null,
    tipoFilter !== "todos" ? tipoFilter : null,
    origemFilter !== "todos" ? origemFilter : null,
    quartosFilter !== "todos" ? quartosFilter : null,
    banheirosFilter !== "todos" ? banheirosFilter : null,
    vagasFilter !== "todos" ? vagasFilter : null,
    precoMin > 0 ? precoMin : null,
    precoMax < 10000000 ? precoMax : null,
    areaMin > 0 ? areaMin : null,
    areaMax < 1000 ? areaMax : null,
  ].filter(Boolean).length;

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Imóveis Disponíveis" subtitle="Capturados automaticamente" />
      
      <div className="p-6 container mx-auto">
        {/* Barra de filtros principal */}
        <div className="mb-6 space-y-4">
          {/* Linha 1: Busca e botão de filtros */}
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
                  Filtros Avançados
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros Avançados
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Preço */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Faixa de Preço
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Mínimo</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={precoMin || ""}
                          onChange={(e) => setPrecoMin(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Máximo</Label>
                        <Input
                          type="number"
                          placeholder="10.000.000"
                          value={precoMax === 10000000 ? "" : precoMax}
                          onChange={(e) => setPrecoMax(Number(e.target.value) || 10000000)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Área */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4" />
                      Área (m²)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Mínimo</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={areaMin || ""}
                          onChange={(e) => setAreaMin(Number(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Máximo</Label>
                        <Input
                          type="number"
                          placeholder="1000"
                          value={areaMax === 1000 ? "" : areaMax}
                          onChange={(e) => setAreaMax(Number(e.target.value) || 1000)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bairro */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Bairro
                    </Label>
                    <Select value={bairroFilter} onValueChange={setBairroFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os bairros" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os bairros</SelectItem>
                        {filterOptions.bairros.map(bairro => (
                          <SelectItem key={bairro} value={bairro!}>{bairro}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cidade */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Cidade
                    </Label>
                    <Select value={cidadeFilter} onValueChange={setCidadeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as cidades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as cidades</SelectItem>
                        {filterOptions.cidades.map(cidade => (
                          <SelectItem key={cidade} value={cidade!}>{cidade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tipo */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Tipo
                    </Label>
                    <Select value={tipoFilter} onValueChange={setTipoFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os tipos</SelectItem>
                        {filterOptions.tipos.map(tipo => (
                          <SelectItem key={tipo} value={tipo!}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Origem */}
                  <div className="space-y-2">
                    <Label>Origem</Label>
                    <Select value={origemFilter} onValueChange={setOrigemFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas as origens" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todas as origens</SelectItem>
                        {filterOptions.origens.map(origem => (
                          <SelectItem key={origem} value={origem!}>{origem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quartos */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      Quartos
                    </Label>
                    <Select value={quartosFilter} onValueChange={setQuartosFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Qualquer</SelectItem>
                        {filterOptions.quartosOptions.map(q => (
                          <SelectItem key={q} value={String(q)}>{q} quarto{q !== 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Banheiros */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      Banheiros
                    </Label>
                    <Select value={banheirosFilter} onValueChange={setBanheirosFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Qualquer</SelectItem>
                        {filterOptions.banheirosOptions.map(b => (
                          <SelectItem key={b} value={String(b)}>{b} banheiro{b !== 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vagas */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vagas
                    </Label>
                    <Select value={vagasFilter} onValueChange={setVagasFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Qualquer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Qualquer</SelectItem>
                        {filterOptions.vagasOptions.map(v => (
                          <SelectItem key={v} value={String(v)}>{v} vaga{v !== 1 ? 's' : ''}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Botão limpar */}
                  <Button variant="outline" className="w-full" onClick={limparFiltros}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar todos os filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Linha 2: Filtros rápidos */}
          <div className="flex flex-wrap gap-2">
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger className="w-[160px]">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos bairros</SelectItem>
                {filterOptions.bairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro!}>{bairro}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={quartosFilter} onValueChange={setQuartosFilter}>
              <SelectTrigger className="w-[140px]">
                <Bed className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Quartos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Quartos</SelectItem>
                {filterOptions.quartosOptions.map(q => (
                  <SelectItem key={q} value={String(q)}>{q}+ quartos</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[160px]">
                <Home className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos tipos</SelectItem>
                {filterOptions.tipos.map(tipo => (
                  <SelectItem key={tipo} value={tipo!}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={limparFiltros} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Limpar ({activeFiltersCount})
              </Button>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {imoveisFiltrados.length} {imoveisFiltrados.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
              {activeFiltersCount > 0 && ` (de ${imoveis.length} total)`}
            </span>
          </div>
        </div>

        {/* Grid de imóveis */}
        {imoveisFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {imoveis.length === 0 
                ? "Sua tabela 'imoveis_santos' parece estar vazia ou sem permissão de leitura."
                : "Tente ajustar os filtros para encontrar mais resultados."
              }
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="outline" onClick={limparFiltros}>
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {imoveisFiltrados.map((imovel) => (
              <Card key={imovel.id} className="group overflow-hidden hover:shadow-xl transition-all border-border">
                <div className="relative h-56 bg-muted">
                  {imovel.imagem_url ? (
                    <img 
                      src={imovel.imagem_url} 
                      alt={imovel.titulo} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground"><Building2 size={40} /></div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm capitalize">{imovel.origem}</Badge>
                  <div className="absolute bottom-3 right-3 bg-background/95 px-3 py-1 rounded-md font-bold text-sm shadow-lg text-foreground">
                    {imovel.preco ? `R$ ${imovel.preco.toLocaleString('pt-BR')}` : 'Sob Consulta'}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 text-foreground" title={imovel.titulo}>{imovel.titulo}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-4 font-medium">
                    <MapPin className="h-4 w-4 mr-1 text-primary" /> {imovel.bairro || "Bairro não informado"}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mb-4 bg-muted/50 p-2 rounded-lg border">
                    <div className="flex flex-col items-center gap-1"><Bed size={16} className="text-muted-foreground"/> <span>{imovel.quartos || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Bath size={16} className="text-muted-foreground"/> <span>{imovel.banheiros || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Car size={16} className="text-muted-foreground"/> <span>{imovel.vagas || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Maximize2 size={16} className="text-muted-foreground"/> <span>{imovel.area_m2 || '-'} m²</span></div>
                  </div>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a href={imovel.link || '#'} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Ver Anúncio
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
