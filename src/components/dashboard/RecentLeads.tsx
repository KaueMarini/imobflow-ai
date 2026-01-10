import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign, ArrowUpRight, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom"; 

interface Lead {
  id: string;
  nome: string;
  created_at: string;
  interesse_bairro: string;
  cidade: string;
  orcamento_max: number;
}

export function RecentLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecentLeads() {
      if (!user?.id) return;

      try {
        const { data, error } = await (supabase as any)
          .from("leads")
          .select("id, nome, created_at, interesse_bairro, cidade, orcamento_max")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setLeads(data || []);
      } catch (error) {
        console.error("Erro ao buscar leads recentes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentLeads();
  }, [user?.id]);

  const formatCurrency = (val: number | null) => {
    if (!val) return "R$ -";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  };

  return (
    <Card className="h-full border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Entrada Recente</CardTitle>
            <CardDescription>Últimos leads captados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/crm")}>
            Ver Todos <ArrowUpRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
             Carregando...
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum lead recente.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="pl-6">Cliente</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead className="text-right pr-6">Orçamento (Teto)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow 
                    key={lead.id} 
                    className="hover:bg-muted/40 transition-colors cursor-pointer" // Mãozinha de clique
                    onClick={() => navigate(`/crm?abrir=${lead.id}`)} // A MÁGICA: Envia o ID na URL
                >
                  <TableCell className="pl-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{lead.nome || "Lead sem nome"}</p>
                        <div className="flex items-center text-[10px] text-muted-foreground uppercase tracking-wide">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(lead.created_at)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {lead.interesse_bairro || "Qualquer bairro"}
                      </span>
                      <span className="text-[11px] text-muted-foreground pl-5">
                        {lead.cidade}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right pr-6 py-3">
                    <Badge variant="outline" className="font-bold text-emerald-600 border-emerald-200 bg-emerald-50 px-2.5 py-0.5">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Até {formatCurrency(lead.orcamento_max)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}