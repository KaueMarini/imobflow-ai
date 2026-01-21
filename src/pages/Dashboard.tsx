import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { LeadsChart } from "@/components/dashboard/LeadsChart";
import { RecentLeads } from "@/components/dashboard/RecentLeads";
import { TermometroImob } from "@/components/dashboard/TermometroImob";
import {
  Users, Flame, Wallet, DollarSign, Loader2, MapPin, TrendingUp, Calendar
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Padrão 'this_week'
  const [timeRange, setTimeRange] = useState("this_week");

  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
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

        const endDate = new Date();
        // Define o fim do dia para garantir que pegue leads de hoje
        endDate.setHours(23, 59, 59, 999);
        
        const startDate = new Date();
        // Zera o horário inicial
        startDate.setHours(0, 0, 0, 0);

        // Lógica de Datas
        if (timeRange === "this_week") {
            // Pega Segunda-feira da semana atual
            const day = startDate.getDay();
            // Se domingo (0), volta 6 dias. Se outro dia, volta (day - 1)
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
        } else {
            // Dias corridos (30 ou 60)
            startDate.setDate(startDate.getDate() - parseInt(timeRange));
        }

        // Chamada RPC
        const { data, error } = await (supabase as any).rpc('get_dashboard_stats', {
            p_user_id: user.id,
            p_start_date: startDate.toISOString(),
            p_end_date: endDate.toISOString()
        });

        if (error) throw error;

        const response = data as any;

        // Processamento dos KPIs e Insights (sem alterações aqui)
        const kpis = response.kpis || {};
        const total = kpis.total_leads || 0;
        setStats({
          totalLeads: total,
          ticketMedio: kpis.ticket_medio || 0,
          potencialVendas: kpis.potencial_vendas || 0,
        });

        const bairrosRaw = response.top_bairros || [];
        setInsights({
          topBairros: bairrosRaw.map((b: any) => ({
            nome: b.nome,
            count: b.count,
            percent: total > 0 ? (b.count / total) * 100 : 0
          })),
          faixasPreco: [
            { label: 'Até 300k', prop: 'Ate_300k' },
            { label: '300k - 600k', prop: '300k_600k' },
            { label: '600k - 1M', prop: '600k_1M' },
            { label: 'Acima de 1M', prop: 'Acima_1M' },
          ].map(item => {
             const count = (response.faixas_preco || {})[item.prop] || 0;
             return {
                label: item.label,
                count: count,
                percent: total > 0 ? (count / total) * 100 : 0
             };
          })
        });

        const graficoRaw = response.grafico || [];

        // --- LÓGICA DE PREENCHIMENTO DE LACUNAS (GAP FILLING) ---

        // 1. Criar um mapa rápido dos dados que vieram do banco
        // Chave = YYYY-MM-DD, Valor = Quantidade
        const dataMap = new Map();
        graficoRaw.forEach((item: any) => {
            // Extrai apenas a parte da data (YYYY-MM-DD) para comparar
            const dateKey = new Date(item.data).toISOString().split('T')[0];
            dataMap.set(dateKey, item.leads);
        });

        // 2. Gerar a lista completa de dias do intervalo
        const filledData = [];
        // Clonamos as datas para usar no loop sem alterar as originais
        let loopDate = new Date(startDate);
        const finalLoopDate = new Date(endDate);

        // Loop enquanto a data for menor ou igual a data final
        while (loopDate <= finalLoopDate) {
            const dateKey = loopDate.toISOString().split('T')[0];

            filledData.push({
                // Mantém o formato ISO completo que o gráfico espera
                data: loopDate.toISOString(),
                // Se o dia existe no mapa do banco, usa o valor. Se não, usa 0.
                leads: dataMap.get(dateKey) || 0
            });

            // Avança para o próximo dia
            loopDate.setDate(loopDate.getDate() + 1);
        }

        // Atualiza o gráfico com os dados completos (incluindo zeros)
        setChartData(filledData);
        // -------------------------------------------------------

      } catch (error) {
        console.error("Erro no dashboard:", error);
        toast.error("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user?.id, timeRange]);

  const formatCompact = (val: number) =>
    new Intl.NumberFormat('pt-BR', { notation: "compact", style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="min-h-screen bg-background pb-10">

      <AppHeader title="FlyImob" />

      <div className="px-6 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Estratégico</h2>
                <p className="text-muted-foreground mt-1">
                    Visão geral e inteligência de mercado
                </p>
            </div>

            <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
                <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] h-9 border-none focus:ring-0 shadow-none bg-transparent">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent align="end">
                        <SelectItem value="this_week">Esta Semana</SelectItem>
                        <SelectItem value="30">Últimos 30 dias</SelectItem>
                        <SelectItem value="60">Últimos 60 dias</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      ) : (
        <div className="px-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KPICard
              title="Leads"
              value={stats.totalLeads.toString()}
              subtitle={timeRange === "this_week" ? "Cadastrados na semana" : "No período selecionado"}
              icon={<Users className="h-6 w-6" />}
            />
            <KPICard
              title="Ticket Médio"
              value={formatCompact(stats.ticketMedio)}
              subtitle="Média dos orçamentos"
              icon={<Wallet className="h-6 w-6" />}
            />
            <KPICard
              title="Pipeline"
              value={formatCompact(stats.potencialVendas)}
              subtitle="Soma total do período"
              icon={<DollarSign className="h-6 w-6" />}
              variant="success"
            />
             <KPICard
              title="Meta Mensal"
              value="85%"
              subtitle="Meta hipotética"
              icon={<Flame className="h-6 w-6" />}
              variant="primary"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* GRÁFICO DE ÁREA (Agora com todos os dias) */}
            <LeadsChart data={chartData} />

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Regiões (Top 5)
                  </CardTitle>
                  <CardDescription>Bairros mais buscados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  {insights.topBairros.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Sem dados.</p>
                  ) : (
                    insights.topBairros.map((bairro, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate max-w-[150px]">{bairro.nome || "Não informado"}</span>
                          <span className="text-muted-foreground">{bairro.count}</span>
                        </div>
                        <Progress value={bairro.percent} className="h-2" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Poder de Compra
                  </CardTitle>
                  <CardDescription>Faixa de orçamento</CardDescription>
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

          <RecentLeads />

          {/* Termômetro Imob - Inteligência de Mercado Global */}
          <div className="pt-6 border-t border-border">
            <TermometroImob />
          </div>
        </div>
      )}
    </div>
  );
}