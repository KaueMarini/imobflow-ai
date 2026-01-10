import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { 
  Users, 
  Flame, 
  Wallet, 
  DollarSign, 
  Loader2, 
  MapPin, 
  TrendingUp 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [chartLeads, setChartLeads] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsRecentes: 0,
    ticketMedio: 0, 
    potencialVendas: 0,
  });

  const [insights, setInsights] = useState({
    topBairros: [] as { nome: string; count: number; percent: number }[],
    faixasPreco: [] as { label: string; count: number; percent: number }[]
  });

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // CORREÇÃO AQUI: Usamos (supabase as any) para o TypeScript não reclamar da tabela 'leads'
        const { data: leadsData, error: leadsError } = await (supabase as any)
          .from("leads")
          .select("id, created_at, orcamento_max, interesse_bairro")
          .eq("user_id", user.id);

        if (leadsError) throw leadsError;

        const leads = leadsData || [];
        setChartLeads(leads);

        // --- CÁLCULOS DE KPI ---
        const totalLeads = leads.length;
        
        // Leads Recentes (30 dias)
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        const leadsRecentes = leads.filter((l: any) => new Date(l.created_at) > trintaDiasAtras).length;

        // Potencial (Soma)
        const potencial = leads.reduce((acc: number, curr: any) => acc + (Number(curr.orcamento_max) || 0), 0);
        
        // Ticket Médio (Média do orçamento dos clientes)
        const ticketMedio = totalLeads > 0 ? potencial / totalLeads : 0;

        setStats({
          totalLeads,
          leadsRecentes,
          ticketMedio,
          potencialVendas: potencial,
        });

        // --- CÁLCULOS DE INTELIGÊNCIA (INSIGHTS) ---

        // A. Top Bairros
        const bairrosMap: Record<string, number> = {};
        leads.forEach((l: any) => {
          if (l.interesse_bairro) {
            const bairro = l.interesse_bairro.trim();
            bairrosMap[bairro] = (bairrosMap[bairro] || 0) + 1;
          }
        });

        const sortedBairros = Object.entries(bairrosMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5) // Top 5
          .map(([nome, count]) => ({
            nome,
            count,
            percent: (count / totalLeads) * 100
          }));

        // B. Faixas de Preço
        const faixas = {
          'Até 300k': 0,
          '300k - 600k': 0,
          '600k - 1M': 0,
          'Acima de 1M': 0
        };

        leads.forEach((l: any) => {
          const val = Number(l.orcamento_max) || 0;
          if (val === 0) return;
          if (val <= 300000) faixas['Até 300k']++;
          else if (val <= 600000) faixas['300k - 600k']++;
          else if (val <= 1000000) faixas['600k - 1M']++;
          else faixas['Acima de 1M']++;
        });

        const faixasArray = Object.entries(faixas).map(([label, count]) => ({
          label,
          count,
          percent: totalLeads > 0 ? (count / totalLeads) * 100 : 0
        }));

        setInsights({
          topBairros: sortedBairros,
          faixasPreco: faixasArray
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
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('pt-BR', { notation: "compact", style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader
        title="Dashboard Estratégico"
        subtitle="Visão geral e inteligência de mercado"
      />

      <div className="p-6 space-y-6">
        
        {/* --- 1. KPIs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Total de Leads"
            value={stats.totalLeads.toString()}
            subtitle="Base de contatos"
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
            title="Ticket Médio"
            value={formatCompact(stats.ticketMedio)}
            subtitle="Média de orçamento"
            icon={<Wallet className="h-6 w-6" />}
          />
          <KPICard
            title="Pipeline Total"
            value={formatCompact(stats.potencialVendas)}
            subtitle="Soma orçamentos máx"
            icon={<DollarSign className="h-6 w-6" />}
            variant="success"
          />
        </div>

        {/* --- 2. INTELIGÊNCIA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
             <LeadsChart leads={chartLeads} />
          </div>

          <div className="space-y-6">
            {/* Top Bairros */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Regiões Mais Buscadas
                </CardTitle>
                <CardDescription>Onde seus clientes querem morar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {insights.topBairros.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Sem dados suficientes.</p>
                ) : (
                  insights.topBairros.map((bairro, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{bairro.nome || "Não informado"}</span>
                        <span className="text-muted-foreground">{bairro.count} leads</span>
                      </div>
                      <Progress value={bairro.percent} className="h-2" />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Faixa de Preço */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Poder de Compra
                </CardTitle>
                <CardDescription>Faixa de orçamento preferida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                 {insights.faixasPreco.map((faixa, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{faixa.label}</span>
                        <span className="font-bold">{Math.round(faixa.percent)}%</span>
                      </div>
                      <Progress 
                        value={faixa.percent} 
                        className={`h-2 ${idx === 0 ? 'bg-secondary' : ''}`} 
                      />
                    </div>
                 ))}
              </CardContent>
            </Card>

          </div>
        </div>

        {/* --- 3. RECENTES --- */}
        <RecentLeads />
      </div>
    </div>
  );
}