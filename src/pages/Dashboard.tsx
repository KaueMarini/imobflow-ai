import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { Users, Flame, Building2, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { clienteSaas } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Dashboard"
        subtitle={clienteSaas?.nome_empresa ? `Bem-vindo, ${clienteSaas.nome_empresa}` : "Visão geral do seu CRM imobiliário"}
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards - Dados zerados até termos tabelas de leads */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
          <KPICard
            title="Total de Leads"
            value="0"
            subtitle="Ativos na plataforma"
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Leads Quentes"
            value="0"
            subtitle="Últimas 24 horas"
            icon={<Flame className="h-6 w-6" />}
            variant="primary"
          />
          <KPICard
            title="Imóveis Cadastrados"
            value="0"
            subtitle="No seu catálogo"
            icon={<Building2 className="h-6 w-6" />}
          />
          <KPICard
            title="Taxa de Conversão"
            value="0%"
            subtitle="Lead → Visita"
            icon={<TrendingUp className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* Charts and Recent */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LeadsChart />
          <RecentLeads />
        </div>
      </div>
    </div>
  );
}
