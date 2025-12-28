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
  Maximize2,
  ExternalLink,
  X,
} from "lucide-react";
import { ImovelUnico } from "@/types";
import { supabase } from "@/lib/supabase";

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

      <div className="p-6 space-y-4">
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
          <div className="text-center py-12 text-muted-foreground">
            Carregando imóveis...
          </div>
        ) : filteredImoveis.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum imóvel encontrado com os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredImoveis.map((imovel) => (
              <Card key={imovel.id} className="overflow-hidden card-hover">
                <div className="relative h-48 bg-secondary flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-muted-foreground" />
                  <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground backdrop-blur-sm">
                    <Building2 className="h-3 w-3 mr-1" />
                    {imovel.origem}
                  </Badge>
                  {imovel.tipo && (
                    <Badge variant="secondary" className="absolute top-3 right-3">
                      {imovel.tipo}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                    {imovel.titulo}
                  </h3>
                  <p className="text-2xl font-bold text-primary mb-3">
                    {formatCurrency(imovel.preco)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {imovel.bairro}, {imovel.cidade}
                    </span>
                    {imovel.quartos && imovel.quartos > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {imovel.quartos} quartos
                      </span>
                    )}
                    {imovel.area_m2 && (
                      <span className="flex items-center gap-1">
                        <Maximize2 className="h-4 w-4" />
                        {imovel.area_m2}m²
                      </span>
                    )}
                  </div>
                  <a
                    href={imovel.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Ver no Site
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
