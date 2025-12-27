import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  MapPin,
  DollarSign,
  Bed,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Lead, ImovelUnico } from "@/types";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockImoveis: ImovelUnico[] = [
  {
    id: "1",
    titulo: "Apartamento com vista para o mar",
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
    titulo: "Cobertura reformada",
    preco: 850000,
    bairro: "Copacabana",
    origem: "Prime",
    quartos: 2,
    area_m2: 90,
    imagem_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    link: "https://www.primeimoveis.com.br/imovel/2",
  },
  {
    id: "3",
    titulo: "Apartamento próximo à praia",
    preco: 720000,
    bairro: "Copacabana",
    origem: "R3",
    quartos: 2,
    area_m2: 68,
    imagem_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    link: "https://www.r3imoveis.com.br/imovel/3",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function LeadDetailsSheet({ lead, open, onOpenChange }: LeadDetailsSheetProps) {
  if (!lead) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg">
              {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1">
              <SheetTitle className="text-lg font-semibold">{lead.nome}</SheetTitle>
              <span className="text-sm text-muted-foreground">{lead.whatsapp}</span>
            </div>
          </div>

          {/* Interest Summary Card */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <MapPin className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Bairro</p>
              <p className="font-medium text-sm">{lead.interesse_bairro}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Orçamento</p>
              <p className="font-medium text-sm">{formatCurrency(lead.orcamento_max)}</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-center">
              <Bed className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Quartos</p>
              <p className="font-medium text-sm">{lead.quartos}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" className="gap-2 flex-1">
              <Phone className="h-4 w-4" />
              Ligar
            </Button>
          </div>
        </SheetHeader>

        {/* Compatible Properties */}
        <div className="flex-1 overflow-hidden p-6 pt-4">
          <h3 className="text-sm font-semibold mb-3">Imóveis Compatíveis</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {mockImoveis.length} imóveis encontrados com base no perfil do lead
          </p>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="space-y-3 pr-4">
              {mockImoveis.map((imovel) => (
                <Card key={imovel.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-28 h-24 flex-shrink-0">
                      <img
                        src={imovel.imagem_url}
                        alt={imovel.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{imovel.titulo}</p>
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(imovel.preco)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {imovel.bairro}
                            </span>
                            <span>•</span>
                            <span>{imovel.quartos}q</span>
                            <span>•</span>
                            <span>{imovel.area_m2}m²</span>
                          </div>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            <Building2 className="h-3 w-3 mr-1" />
                            {imovel.origem}
                          </Badge>
                        </div>
                      </div>
                      <a
                        href={imovel.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-3"
                      >
                        <Button size="sm" className="w-full gap-1 text-xs h-7">
                          <ExternalLink className="h-3 w-3" />
                          Ver no Site
                        </Button>
                      </a>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
