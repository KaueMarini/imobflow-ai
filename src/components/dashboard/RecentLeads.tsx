import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2, Home, MapPin, Car, DollarSign, Palmtree } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  created_at: string;
  cidade: string | null;
  orcamento_minimo: number | null;
  vagas: number | null;
  itens_lazer: string | null;
  matches_count?: number;
}

export function RecentLeads() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeadsAndMatches() {
      if (!user?.id) return;

      try {
        const sb = supabase as any;

        const { data: leadsData, error: leadsError } = await sb
          .from("leads")
          .select("id, nome, whatsapp, created_at, cidade, orcamento_minimo, vagas, itens_lazer")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (leadsError) throw leadsError;

        const leadsList = leadsData as Lead[];

        const leadsWithMatches = await Promise.all(
          leadsList.map(async (lead) => {
            // MATCHING: Usando apenas as colunas que REALMENTE existem em imoveis_santos
            // Colunas disponíveis: id, created_at, titulo, descricao, preco, condominio, iptu, bairro, cidade
            let query = sb
              .from("imoveis_santos")
              .select("id", { count: "exact", head: true });

            // 1. Filtro de Cidade (Match parcial e flexível)
            if (lead.cidade) {
              query = query.ilike("cidade", `%${lead.cidade}%`);
            }

            // 2. Filtro de Preço (Corrigido de 'valor' para 'preco')
            // Se o lead tem orcamento_minimo, buscamos imóveis com preco >= orcamento_minimo
            // DICA: Aplicamos uma margem de segurança de 10% para baixo para pegar oportunidades próximas
            if (lead.orcamento_minimo) {
              const margemFlexivel = lead.orcamento_minimo * 0.9; 
              query = query.gte("preco", margemFlexivel);
            }

            // OBS: Removemos filtros de 'vagas' e 'lazer' da query SQL pois as colunas não existem na tabela de imóveis.
            // O match será baseado em localização e preço, aumentando a chance de encontrar resultados.

            const { count } = await query;
            
            return {
              ...lead,
              matches_count: count || 0
            };
          })
        );

        setLeads(leadsWithMatches);
      } catch (error) {
        console.error("Erro ao processar leads e matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeadsAndMatches();
  }, [user?.id]);

  return (
    <Card className="border-border shadow-soft h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            Leads Recentes
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Últimos contatos e imóveis compatíveis
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/crm")} className="text-primary hover:text-primary/80">
          Ver CRM
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              Nenhum lead encontrado
            </h3>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
              >
                {/* Linha 1: Info Principal */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {lead.nome ? lead.nome.substring(0, 2).toUpperCase() : "??"}
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-none">{lead.nome || "Sem Nome"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lead.whatsapp}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={lead.matches_count && lead.matches_count > 0 ? "default" : "secondary"}
                    className="flex items-center gap-1.5 h-7"
                  >
                    <Home className="h-3 w-3" />
                    {lead.matches_count} <span className="hidden sm:inline">imóveis</span>
                  </Badge>
                </div>

                {/* Linha 2: Preferências (TODAS as solicitadas aparecem aqui visualmente) */}
                <div className="flex flex-wrap gap-2">
                  {lead.cidade && (
                    <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal gap-1 bg-background">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {lead.cidade}
                    </Badge>
                  )}
                  {lead.vagas && lead.vagas > 0 && (
                     <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal gap-1 bg-background">
                      <Car className="h-3 w-3 text-muted-foreground" />
                      {lead.vagas} vg
                    </Badge>
                  )}
                   {lead.orcamento_minimo && lead.orcamento_minimo > 0 && (
                     <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal gap-1 bg-background">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      {new Intl.NumberFormat('pt-BR', { notation: "compact", style: 'currency', currency: 'BRL' }).format(lead.orcamento_minimo)}
                    </Badge>
                  )}
                  {lead.itens_lazer && (
                     <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 font-normal gap-1 bg-background">
                      <Palmtree className="h-3 w-3 text-muted-foreground" />
                      Lazer
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}