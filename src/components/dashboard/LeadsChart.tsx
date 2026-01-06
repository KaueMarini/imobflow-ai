import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface LeadsChartProps {
  leads: any[]; // Recebe a lista de leads completa para processar
}

export function LeadsChart({ leads }: LeadsChartProps) {
  // Processa os dados para agrupar por dia (últimos 7 dias)
  const chartData = useMemo(() => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    return last7Days.map((date) => {
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" });
      
      // Conta quantos leads tem created_at batendo com esse dia
      const count = leads.filter((lead) => 
        lead.created_at?.startsWith(dateStr)
      ).length;

      return {
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1), // Ex: "Seg"
        leads: count,
      };
    });
  }, [leads]);

  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Volume de Leads
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Novos contatos nos últimos 7 dias
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(222, 47%, 20%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(222, 47%, 20%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(214, 32%, 91%)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214, 32%, 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="hsl(222, 47%, 20%)"
                strokeWidth={2}
                fill="url(#leadGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}