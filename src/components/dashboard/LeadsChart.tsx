import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Seg", leads: 4 },
  { name: "Ter", leads: 6 },
  { name: "Qua", leads: 8 },
  { name: "Qui", leads: 5 },
  { name: "Sex", leads: 12 },
  { name: "Sáb", leads: 15 },
  { name: "Dom", leads: 9 },
];

export function LeadsChart() {
  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Novos Leads x Tempo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimos 7 dias de captação
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
