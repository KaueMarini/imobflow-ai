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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Search, 
  MapPin, 
  ExternalLink, 
  MessageCircle, 
  User,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CaptacaoItem {
  id: string;
  titulo: string;
  preco: number;
  bairro: string;
  cidade: string;
  link_original: string;
  nome_proprietario: string;
  telefone_proprietario: string;
  created_at: string;
}

export default function Captacao() {
  const [items, setItems] = useState<CaptacaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Busca os imóveis de captação (Apenas leitura)
  const fetchCaptacao = async () => {
    setLoading(true);
    try {
      // Usamos (supabase as any) para evitar erro de tipagem se os types não foram atualizados
      let query = (supabase as any)
        .from("imoveis_captacao")
        .select("*")
        .order("created_at", { ascending: false }) // Mais recentes primeiro
        .limit(100); 

      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,bairro.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Conversão forçada (Type Casting) para garantir compatibilidade
      setItems(data as unknown as CaptacaoItem[]);
      
    } catch (error) {
      console.error("Erro captação:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptacao();
  }, [searchTerm]);

  const formatCurrency = (val: number) => {
    return val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <AppHeader
        title="Radar de Captação"
        subtitle="Proprietários anunciando direto (Feed em Tempo Real)"
      />

      <Card className="border-border shadow-soft flex-1 flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b">
          <div>
            <CardTitle>Oportunidades Recentes ({items.length})</CardTitle>
            <CardDescription>
              Lista de imóveis particulares encontrados pelo robô. Entre em contato antes da concorrência.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por bairro..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-auto">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Data</TableHead>
                  <TableHead className="w-[300px]">Imóvel</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Proprietário (Provável)</TableHead>
                  <TableHead className="text-right">Contato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                            Nenhuma oportunidade encontrada no momento.
                        </TableCell>
                    </TableRow>
                ) : items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.created_at)}
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium truncate max-w-[280px]" title={item.titulo}>{item.titulo}</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" /> {item.bairro} - {item.cidade}
                        </div>
                        {item.link_original && (
                            <a href={item.link_original} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1 w-fit">
                                <ExternalLink className="h-3 w-3" /> Ver anúncio original
                            </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {formatCurrency(item.preco)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.nome_proprietario || "Anônimo"}</span>
                            <span className="text-xs text-muted-foreground">Via OLX Particular</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                        {item.telefone_proprietario ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white shadow-sm" asChild>
                                <a href={`https://wa.me/55${item.telefone_proprietario.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">
                                    <MessageCircle className="h-4 w-4 mr-2" /> Chamar no Zap
                                </a>
                            </Button>
                        ) : (
                             <Button variant="outline" size="sm" className="text-muted-foreground" disabled>
                                Sem Telefone
                             </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}