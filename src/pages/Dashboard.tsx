import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { Users, Flame, Building2, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Dashboard"
        subtitle="Visão geral do seu CRM imobiliário"
      />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
          <KPICard
            title="Total de Leads"
            value="247"
            subtitle="Ativos na plataforma"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <KPICard
            title="Leads Quentes"
            value="18"
            subtitle="Últimas 24 horas"
            icon={<Flame className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
            variant="primary"
          />
          <KPICard
            title="Imóveis Recomendados"
            value="1.842"
            subtitle="Match com leads ativos"
            icon={<Building2 className="h-6 w-6" />}
          />
          <KPICard
            title="Taxa de Conversão"
            value="23%"
            subtitle="Lead → Visita"
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 4, isPositive: true }}
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
