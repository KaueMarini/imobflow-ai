// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { Users, Flame, Building2, TrendingUp, Loader2, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsQuentes: 0,
    totalImoveis: 0,
    potencialVendas: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Contar Leads
        const { data: leads, error: leadsError } = await supabase
          .from('leads')
          .select('status, orcamento_max');
        
        if (leadsError) throw leadsError;

        const totalLeads = leads?.length || 0;
        const leadsQuentes = leads?.filter(l => l.status === 'novo' || l.status === 'atendimento').length || 0;
        const potencial = leads?.reduce((acc, curr) => acc + (Number(curr.orcamento_max) || 0), 0) || 0;

        // 2. Contar Imóveis
        const { count, error: imoveisError } = await supabase
          .from('imoveis_santos')
          .select('*', { count: 'exact', head: true });
        
        if (imoveisError) throw imoveisError;

        setStats({
          totalLeads,
          leadsQuentes,
          totalImoveis: count || 0,
          potencialVendas: potencial
        });

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Dashboard"
        subtitle="Visão geral em tempo real"
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards Reais */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total de Leads"
            value={stats.totalLeads.toString()}
            subtitle="Cadastrados no sistema"
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Leads Ativos"
            value={stats.leadsQuentes.toString()}
            subtitle="Aguardando ou em atendimento"
            icon={<Flame className="h-6 w-6" />}
            variant="primary"
          />
          <KPICard
            title="Imóveis na Base"
            value={stats.totalImoveis.toString()}
            subtitle="Capturados (Lopes, R3, etc)"
            icon={<Building2 className="h-6 w-6" />}
          />
          <KPICard
            title="Potencial (R$)"
            value={new Intl.NumberFormat('pt-BR', { notation: "compact", style: 'currency', currency: 'BRL' }).format(stats.potencialVendas)}
            subtitle="Soma dos orçamentos"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Gráficos e Listas (Ainda podem ter mocks internos se não alterarmos os componentes filhos, mas o painel principal agora é real) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LeadsChart />
          <RecentLeads />
        </div>
      </div>
    </div>
  );
}