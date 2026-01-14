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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadsChartProps {
  data: any[]; // Recebe os dados já processados do Supabase
}

export function LeadsChart({ data }: LeadsChartProps) {
  
  // Formata os dados para o Recharts entender (Visual que você pediu)
  const chartData = useMemo(() => {
    return (data || []).map((item) => {
      const dateObj = new Date(item.data);
      // Cria o nome do eixo X (ex: "Seg", "Ter" ou "12/01" dependendo do que preferir)
      // Aqui configurei para pegar o dia (Ex: 15/01) para ficar bom em 30 dias também
      const dayName = format(dateObj, "dd/MM", { locale: ptBR });
      
      return {
        name: dayName,
        leads: Number(item.leads),
        fullDate: format(dateObj, "dd 'de' MMMM", { locale: ptBR }) // Para o Tooltip
      };
    });
  }, [data]);

  return (
    <Card className="border-border shadow-soft col-span-1 lg:col-span-2 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Volume de Leads
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Evolução de novos contatos no período
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
                tickMargin={10}
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
                labelStyle={{ color: "hsl(222, 47%, 11%)", fontWeight: 600, marginBottom: '0.25rem' }}
                formatter={(value: any) => [`${value} leads`, undefined]}
                labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                        return payload[0].payload.fullDate;
                    }
                    return label;
                }}
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