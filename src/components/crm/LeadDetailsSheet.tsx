import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

interface LeadDetailsSheetProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function LeadDetailsSheet({ lead, open, onOpenChange }: LeadDetailsSheetProps) {
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchImoveisCompativeis() {
      if (!lead) return;
      
      setLoading(true);
      // Buscar imóveis compatíveis baseado no bairro e orçamento do lead
      const { data, error } = await supabase
        .from('imoveis_unique')
        .select('*')
        .ilike('bairro', `%${lead.interesse_bairro}%`)
        .lte('preco', lead.orcamento_max)
        .order('preco', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar imóveis:', error);
      } else {
        setImoveis(data || []);
      }
      setLoading(false);
    }

    if (open && lead) {
      fetchImoveisCompativeis();
    }
  }, [open, lead]);

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
          {loading ? (
            <p className="text-sm text-muted-foreground">Buscando imóveis...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">
                {imoveis.length} imóveis encontrados com base no perfil do lead
              </p>
              <ScrollArea className="h-[calc(100%-4rem)]">
                <div className="space-y-3 pr-4">
                  {imoveis.map((imovel) => (
                    <Card key={imovel.id} className="overflow-hidden">
                      <div className="flex">
                        <div className="w-28 h-24 flex-shrink-0 bg-secondary flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
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
                                {imovel.quartos && (
                                  <>
                                    <span>•</span>
                                    <span>{imovel.quartos}q</span>
                                  </>
                                )}
                                {imovel.area_m2 && (
                                  <>
                                    <span>•</span>
                                    <span>{imovel.area_m2}m²</span>
                                  </>
                                )}
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
                  {imoveis.length === 0 && !loading && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum imóvel compatível encontrado.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
