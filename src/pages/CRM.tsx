import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, MapPin, DollarSign, Bed, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  interesse_bairro: string | null;
  orcamento_max: number | null;
  quartos: number | null;
  status: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  atendimento: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  visita: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  fechado: "bg-green-500/10 text-green-500 border-green-500/20",
};

const statusLabels: Record<string, string> = {
  novo: "Novo",
  atendimento: "Em Atendimento",
  visita: "Visita Agendada",
  fechado: "Fechado",
};

export default function CRM() {
  const { clienteSaas } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      if (!clienteSaas?.id) {
        setLoading(false);
        return;
      }

      const sb = supabase as any;
      const { data, error } = await sb
        .from("leads")
        .select("*")
        .eq("cliente_saas_id", clienteSaas.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar leads:", error);
      } else {
        setLeads(data || []);
      }
      setLoading(false);
    }

    fetchLeads();
  }, [clienteSaas?.id]);

  const formatCurrency = (value: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Leads"
        subtitle="Todos os leads que entraram em contato"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{leads.length}</p>
                <p className="text-sm text-muted-foreground">Total de leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum lead ainda</h3>
                <p className="text-muted-foreground max-w-md">
                  Quando seus leads entrarem em contato pelo WhatsApp, eles aparecerão aqui automaticamente.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Quartos</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.nome}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {lead.whatsapp}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {lead.interesse_bairro || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {formatCurrency(lead.orcamento_max)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          {lead.quartos || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusColors[lead.status || "novo"] || statusColors.novo}
                        >
                          {statusLabels[lead.status || "novo"] || "Novo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
