import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { Users, Flame, Building2, Loader2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartLeads, setChartLeads] = useState<any[]>([]); // Para o gráfico
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsRecentes: 0,
    totalImoveis: 0,
    potencialVendas: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const sb = supabase as any;

        // 1. Buscar Leads (Todos os campos necessários para KPI e Gráfico)
        // Usamos user_id conforme sua tabela
        const { data: leadsData, error: leadsError } = await sb
          .from("leads")
          .select("id, created_at, orcamento_max")
          .eq("user_id", user.id);

        if (leadsError) throw leadsError;

        const leads = leadsData || [];
        setChartLeads(leads); // Salva para o gráfico

        // Cálculos
        const totalLeads = leads.length;
        
        // Leads Recentes (últimos 30 dias)
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        
        const leadsRecentes = leads.filter((l: any) => 
          new Date(l.created_at) > trintaDiasAtras
        ).length;

        const potencial = leads.reduce((acc: number, curr: any) => {
          // Limpa a string de moeda se vier suja (ex: "R$ 500.000") ou pega o numero direto
          const valor = Number(curr.orcamento_max) || 0;
          return acc + valor;
        }, 0);

        // 2. Contar Imóveis
        const { count, error: imoveisError } = await sb
          .from("imoveis_santos")
          .select("*", { count: "exact", head: true });

        // Nota: Se der erro nos imóveis (ex: RLS), não quebra o dashboard todo
        if (imoveisError) console.error("Erro imóveis:", imoveisError);

        setStats({
          totalLeads,
          leadsRecentes,
          totalImoveis: count || 0,
          potencialVendas: potencial,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader
        title="Dashboard"
        subtitle="Visão geral do seu negócio"
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total de Leads"
            value={stats.totalLeads.toString()}
            subtitle="Total na sua base"
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Leads Recentes"
            value={stats.leadsRecentes.toString()}
            subtitle="Últimos 30 dias"
            icon={<Flame className="h-6 w-6" />}
            variant="primary"
          />
          <KPICard
            title="Imóveis Disponíveis"
            value={stats.totalImoveis.toString()}
            subtitle="Banco de dados total"
            icon={<Building2 className="h-6 w-6" />}
          />
          <KPICard
            title="Potencial (R$)"
            value={new Intl.NumberFormat('pt-BR', { notation: "compact", style: 'currency', currency: 'BRL' }).format(stats.potencialVendas)}
            subtitle="Soma orçamentos máx"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Gráficos e Listas */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LeadsChart leads={chartLeads} />
          <RecentLeads />
        </div>
      </div>
    </div>
  );
}