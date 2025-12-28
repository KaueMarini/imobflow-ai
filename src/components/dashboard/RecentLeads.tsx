import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  status: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  novo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  atendimento: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  visita: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  fechado: "bg-green-500/10 text-green-500 border-green-500/20",
};

export function RecentLeads() {
  const { clienteSaas } = useAuth();
  const navigate = useNavigate();
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
        .select("id, nome, whatsapp, status, created_at")
        .eq("cliente_saas_id", clienteSaas.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Erro ao buscar leads:", error);
      } else {
        setLeads(data || []);
      }
      setLoading(false);
    }

    fetchLeads();
  }, [clienteSaas?.id]);

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            Últimos Leads Ativos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Leads mais recentes aguardando ação
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/crm")}>
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum lead ainda
            </h3>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Quando seus leads entrarem em contato, eles aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium">{lead.nome}</p>
                  <p className="text-sm text-muted-foreground">{lead.whatsapp}</p>
                </div>
                <Badge
                  variant="outline"
                  className={statusColors[lead.status || "novo"] || statusColors.novo}
                >
                  {lead.status || "Novo"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
