import { useEffect, useState } from "react";
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
  Filter,
  Building2,
  MapPin,
  Bed,
  Maximize2,
  ExternalLink,
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

  useEffect(() => {
    async function fetchImoveis() {
      const { data, error } = await supabase
        .from('imoveis_unique')
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
              />
            </div>
            <Select>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="copacabana">Copacabana</SelectItem>
                <SelectItem value="ipanema">Ipanema</SelectItem>
                <SelectItem value="leblon">Leblon</SelectItem>
                <SelectItem value="botafogo">Botafogo</SelectItem>
                <SelectItem value="barra">Barra da Tijuca</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="500">Até R$ 500 mil</SelectItem>
                <SelectItem value="1000">R$ 500 mil - 1M</SelectItem>
                <SelectItem value="2000">R$ 1M - 2M</SelectItem>
                <SelectItem value="3000">Acima de R$ 2M</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="lopes">Lopes</SelectItem>
                <SelectItem value="prime">Prime</SelectItem>
                <SelectItem value="r3">R3</SelectItem>
                <SelectItem value="century">Century 21</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando imóveis...
          </div>
        ) : imoveis.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum imóvel encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {imoveis.map((imovel) => (
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
                    {imovel.quartos && (
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
