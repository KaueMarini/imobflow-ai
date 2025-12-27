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

const mockImoveis: ImovelUnico[] = [
  {
    id: "1",
    titulo: "Apartamento com vista para o mar em Copacabana",
    preco: 780000,
    bairro: "Copacabana",
    origem: "Lopes",
    quartos: 2,
    area_m2: 75,
    imagem_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    link: "https://www.lopes.com.br/imovel/1",
  },
  {
    id: "2",
    titulo: "Cobertura duplex reformada no Leblon",
    preco: 2500000,
    bairro: "Leblon",
    origem: "Prime",
    quartos: 4,
    area_m2: 220,
    imagem_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    link: "https://www.primeimoveis.com.br/imovel/2",
  },
  {
    id: "3",
    titulo: "Studio moderno em Ipanema",
    preco: 650000,
    bairro: "Ipanema",
    origem: "R3",
    quartos: 1,
    area_m2: 45,
    imagem_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    link: "https://www.r3imoveis.com.br/imovel/3",
  },
  {
    id: "4",
    titulo: "Apartamento familiar em Botafogo",
    preco: 890000,
    bairro: "Botafogo",
    origem: "Century 21",
    quartos: 3,
    area_m2: 95,
    imagem_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    link: "https://www.century21.com.br/imovel/4",
  },
  {
    id: "5",
    titulo: "Penthouse de luxo na Barra",
    preco: 3200000,
    bairro: "Barra da Tijuca",
    origem: "Lopes",
    quartos: 5,
    area_m2: 350,
    imagem_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    link: "https://www.lopes.com.br/imovel/5",
  },
  {
    id: "6",
    titulo: "Apartamento aconchegante no Flamengo",
    preco: 520000,
    bairro: "Flamengo",
    origem: "RE/MAX",
    quartos: 2,
    area_m2: 65,
    imagem_url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    link: "https://www.remax.com.br/imovel/6",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Imoveis() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockImoveis.map((imovel) => (
            <Card key={imovel.id} className="overflow-hidden card-hover">
              <div className="relative h-48">
                <img
                  src={imovel.imagem_url}
                  alt={imovel.titulo}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground backdrop-blur-sm">
                  <Building2 className="h-3 w-3 mr-1" />
                  {imovel.origem}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                  {imovel.titulo}
                </h3>
                <p className="text-2xl font-bold text-primary mb-3">
                  {formatCurrency(imovel.preco)}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {imovel.bairro}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {imovel.quartos} quartos
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-4 w-4" />
                    {imovel.area_m2}m²
                  </span>
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
      </div>
    </div>
  );
}
