import { useEffect, useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Building2,
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  ExternalLink,
  X,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { ImovelUnico } from "@/types";
import { supabase } from "@/integrations/supabase/client";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [bairroFilter, setBairroFilter] = useState("all");
  const [precoFilter, setPrecoFilter] = useState("all");
  const [origemFilter, setOrigemFilter] = useState("all");

  useEffect(() => {
    async function fetchImoveis() {
      const { data, error } = await supabase
        .from('imoveis_santos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar imóveis:', error);
      } else {
        setImoveis(data || []);
      }
      setLoading(false);
    }

    fetchImoveis();
  }, []);

  // Extract unique values for filters
  const bairros = useMemo(() => {
    const unique = [...new Set(imoveis.map(i => i.bairro).filter(Boolean))];
    return unique.sort();
  }, [imoveis]);

  const origens = useMemo(() => {
    const unique = [...new Set(imoveis.map(i => i.origem).filter(Boolean))];
    return unique.sort();
  }, [imoveis]);

  // Filter logic
  const filteredImoveis = useMemo(() => {
    return imoveis.filter(imovel => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          imovel.titulo?.toLowerCase().includes(search) ||
          imovel.bairro?.toLowerCase().includes(search) ||
          imovel.cidade?.toLowerCase().includes(search) ||
          imovel.descricao?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Bairro filter
      if (bairroFilter !== "all" && imovel.bairro !== bairroFilter) {
        return false;
      }

      // Origem filter
      if (origemFilter !== "all" && imovel.origem !== origemFilter) {
        return false;
      }

      // Preço filter
      if (precoFilter !== "all") {
        const preco = imovel.preco;
        switch (precoFilter) {
          case "500":
            if (preco > 500000) return false;
            break;
          case "1000":
            if (preco < 500000 || preco > 1000000) return false;
            break;
          case "2000":
            if (preco < 1000000 || preco > 2000000) return false;
            break;
          case "3000":
            if (preco < 2000000) return false;
            break;
        }
      }

      return true;
    });
  }, [imoveis, searchTerm, bairroFilter, precoFilter, origemFilter]);

  const hasActiveFilters = searchTerm || bairroFilter !== "all" || precoFilter !== "all" || origemFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setBairroFilter("all");
    setPrecoFilter("all");
    setOrigemFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Imóveis"
        subtitle="Catálogo de imóveis disponíveis das suas fontes"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar imóveis..."
                className="pl-9 bg-card border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={bairroFilter} onValueChange={setBairroFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bairros</SelectItem>
                {bairros.map(bairro => (
                  <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={precoFilter} onValueChange={setPrecoFilter}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="500">Até R$ 500 mil</SelectItem>
                <SelectItem value="1000">R$ 500 mil - 1M</SelectItem>
                <SelectItem value="2000">R$ 1M - 2M</SelectItem>
                <SelectItem value="3000">Acima de R$ 2M</SelectItem>
              </SelectContent>
            </Select>
            <Select value={origemFilter} onValueChange={setOrigemFilter}>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fontes</SelectItem>
                {origens.map(origem => (
                  <SelectItem key={origem} value={origem}>{origem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          {loading ? "Carregando..." : `${filteredImoveis.length} imóveis encontrados`}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <p className="text-muted-foreground">Carregando imóveis...</p>
            </div>
          </div>
        ) : filteredImoveis.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground max-w-md">
              Não encontramos imóveis com os filtros selecionados. Tente ajustar seus critérios de busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredImoveis.map((imovel) => (
              <Card key={imovel.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/50">
                {/* Image Section */}
                <div className="relative h-52 bg-gradient-to-br from-secondary to-secondary/50 overflow-hidden">
                  {imovel.imagem_url ? (
                    <img 
                      src={imovel.imagem_url} 
                      alt={imovel.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                      {imovel.origem}
                    </Badge>
                  </div>
                  {imovel.tipo && (
                    <Badge variant="secondary" className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm shadow-lg">
                      {imovel.tipo}
                    </Badge>
                  )}
                  
                  {/* Price on image */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      {formatCurrency(imovel.preco)}
                    </p>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Title */}
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-3 min-h-[3rem]">
                    {imovel.titulo}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{imovel.bairro}, {imovel.cidade}</span>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {imovel.quartos !== undefined && imovel.quartos > 0 && (
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50 text-center">
                        <Bed className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs font-medium">{imovel.quartos}</span>
                        <span className="text-[10px] text-muted-foreground">Quartos</span>
                      </div>
                    )}
                    {imovel.banheiros !== undefined && imovel.banheiros > 0 && (
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50 text-center">
                        <Bath className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs font-medium">{imovel.banheiros}</span>
                        <span className="text-[10px] text-muted-foreground">Banheiros</span>
                      </div>
                    )}
                    {imovel.vagas !== undefined && imovel.vagas > 0 && (
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50 text-center">
                        <Car className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs font-medium">{imovel.vagas}</span>
                        <span className="text-[10px] text-muted-foreground">Vagas</span>
                      </div>
                    )}
                    {imovel.area_m2 && (
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/50 text-center">
                        <Maximize2 className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs font-medium">{imovel.area_m2}</span>
                        <span className="text-[10px] text-muted-foreground">m²</span>
                      </div>
                    )}
                  </div>

                  {/* Monthly costs */}
                  {(imovel.condominio || imovel.iptu) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <div className="flex gap-3">
                        {imovel.condominio && (
                          <span>Cond: {formatCurrency(imovel.condominio)}</span>
                        )}
                        {imovel.iptu && (
                          <span>IPTU: {formatCurrency(imovel.iptu)}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Leisure items */}
                  {(() => {
                    const lazerItems = Array.isArray(imovel.itens_lazer) 
                      ? imovel.itens_lazer 
                      : typeof imovel.itens_lazer === 'string' && imovel.itens_lazer
                        ? (imovel.itens_lazer as string).split(',').map(s => s.trim()).filter(Boolean)
                        : [];
                    
                    if (lazerItems.length === 0) return null;
                    
                    return (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {lazerItems.slice(0, 4).map((item, index) => (
                          <Badge key={index} variant="outline" className="text-[10px] py-0.5 px-2">
                            <Sparkles className="h-2.5 w-2.5 mr-1" />
                            {item}
                          </Badge>
                        ))}
                        {lazerItems.length > 4 && (
                          <Badge variant="outline" className="text-[10px] py-0.5 px-2">
                            +{lazerItems.length - 4}
                          </Badge>
                        )}
                      </div>
                    );
                  })()}

                  {/* CTA Button */}
                  <a
                    href={imovel.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full gap-2 transition-all duration-300 hover:gap-3">
                      <ExternalLink className="h-4 w-4" />
                      Ver Detalhes
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}