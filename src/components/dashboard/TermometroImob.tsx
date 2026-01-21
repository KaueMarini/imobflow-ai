import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Home,
  MapPin,
  Car,
  Bed,
  DollarSign,
  TrendingUp,
  Loader2,
  Sparkles,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TermometroData {
  totalLeads: number;
  quartosDistribution: { quartos: number; count: number; percent: number }[];
  vagasDistribution: { vagas: number; count: number; percent: number }[];
  bairrosTop: { nome: string; count: number; percent: number }[];
  faixasPreco: { label: string; min: number; max: number | null; count: number; percent: number }[];
  imovelIdeal: {
    quartos: number;
    vagas: number;
    bairro: string;
    faixaPreco: string;
    orcamentoMedio: number;
  } | null;
}

const FAIXAS_PRECO = [
  { label: "Até R$ 300k", min: 0, max: 300000 },
  { label: "R$ 300k - 500k", min: 300000, max: 500000 },
  { label: "R$ 500k - 800k", min: 500000, max: 800000 },
  { label: "R$ 800k - 1M", min: 800000, max: 1000000 },
  { label: "Acima de R$ 1M", min: 1000000, max: null },
];

export function TermometroImob() {
  const [loading, setLoading] = useState(true);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("todas");
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<string[]>([]);
  const [data, setData] = useState<TermometroData | null>(null);

  // Buscar cidades disponíveis
  useEffect(() => {
    async function fetchCidades() {
      try {
        const { data: leads, error } = await (supabase as any)
          .from("leads")
          .select("cidade")
          .not("cidade", "is", null)
          .neq("cidade", "");

        if (error) throw error;

        const cidadesUnicas = [
          ...new Set(
            leads
              .map((l: any) => l.cidade?.trim())
              .filter((c: string) => c && c.length > 0)
          ),
        ].sort() as string[];

        setCidadesDisponiveis(cidadesUnicas);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    }

    fetchCidades();
  }, []);

  // Buscar dados do termômetro
  useEffect(() => {
    async function fetchTermometroData() {
      try {
        setLoading(true);

        let query = (supabase as any)
          .from("leads")
          .select("quartos, vagas, interesse_bairro, cidade, orcamento_max");

        if (cidadeSelecionada !== "todas") {
          query = query.ilike("cidade", cidadeSelecionada);
        }

        const { data: leads, error } = await query;

        if (error) throw error;

        if (!leads || leads.length === 0) {
          setData(null);
          return;
        }

        const totalLeads = leads.length;

        // Distribuição de quartos
        const quartosMap = new Map<number, number>();
        leads.forEach((l: any) => {
          const q = parseInt(l.quartos) || 0;
          if (q > 0 && q <= 5) {
            quartosMap.set(q, (quartosMap.get(q) || 0) + 1);
          }
        });
        const quartosDistribution = Array.from(quartosMap.entries())
          .map(([quartos, count]) => ({
            quartos,
            count,
            percent: (count / totalLeads) * 100,
          }))
          .sort((a, b) => b.count - a.count);

        // Distribuição de vagas
        const vagasMap = new Map<number, number>();
        leads.forEach((l: any) => {
          const v = parseInt(l.vagas) || 0;
          if (v >= 0 && v <= 4) {
            vagasMap.set(v, (vagasMap.get(v) || 0) + 1);
          }
        });
        const vagasDistribution = Array.from(vagasMap.entries())
          .map(([vagas, count]) => ({
            vagas,
            count,
            percent: (count / totalLeads) * 100,
          }))
          .sort((a, b) => b.count - a.count);

        // Top bairros
        const bairrosMap = new Map<string, number>();
        leads.forEach((l: any) => {
          const bairro = l.interesse_bairro?.trim();
          if (bairro && bairro.length > 0) {
            bairrosMap.set(bairro, (bairrosMap.get(bairro) || 0) + 1);
          }
        });
        const bairrosTop = Array.from(bairrosMap.entries())
          .map(([nome, count]) => ({
            nome,
            count,
            percent: (count / totalLeads) * 100,
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        // Faixas de preço
        const faixasPreco = FAIXAS_PRECO.map((faixa) => {
          const count = leads.filter((l: any) => {
            const orc = l.orcamento_max || 0;
            if (faixa.max === null) return orc >= faixa.min;
            return orc >= faixa.min && orc < faixa.max;
          }).length;
          return {
            ...faixa,
            count,
            percent: (count / totalLeads) * 100,
          };
        });

        // Imóvel ideal (mais buscado)
        const topQuartos = quartosDistribution[0]?.quartos || 2;
        const topVagas = vagasDistribution[0]?.vagas || 1;
        const topBairro = bairrosTop[0]?.nome || "Centro";
        const topFaixa = faixasPreco.reduce((prev, curr) =>
          curr.count > prev.count ? curr : prev
        );

        const orcamentoMedio =
          leads.reduce((acc: number, l: any) => acc + (l.orcamento_max || 0), 0) /
          totalLeads;

        setData({
          totalLeads,
          quartosDistribution,
          vagasDistribution,
          bairrosTop,
          faixasPreco,
          imovelIdeal: {
            quartos: topQuartos,
            vagas: topVagas,
            bairro: topBairro,
            faixaPreco: topFaixa.label,
            orcamentoMedio,
          },
        });
      } catch (error) {
        console.error("Erro ao buscar dados do termômetro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTermometroData();
  }, [cidadeSelecionada]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);

  // Cores para o gradiente de "temperatura"
  const getTemperatureColor = (percent: number) => {
    if (percent >= 30) return "bg-red-500";
    if (percent >= 20) return "bg-orange-500";
    if (percent >= 10) return "bg-yellow-500";
    return "bg-blue-400";
  };

  const getTemperatureGlow = (percent: number) => {
    if (percent >= 30) return "shadow-red-500/30";
    if (percent >= 20) return "shadow-orange-500/30";
    if (percent >= 10) return "shadow-yellow-500/30";
    return "shadow-blue-400/30";
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <Thermometer className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum lead encontrado {cidadeSelecionada !== "todas" ? `em ${cidadeSelecionada}` : ""}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header do Termômetro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/25">
            <Thermometer className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Termômetro Imob
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </h3>
            <p className="text-muted-foreground text-sm">
              Inteligência de mercado baseada em{" "}
              <span className="font-semibold text-foreground">{data.totalLeads.toLocaleString()}</span> leads
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card p-1.5 rounded-lg border shadow-sm">
          <MapPin className="h-4 w-4 text-muted-foreground ml-2" />
          <Select value={cidadeSelecionada} onValueChange={setCidadeSelecionada}>
            <SelectTrigger className="w-[180px] h-9 border-none focus:ring-0 shadow-none bg-transparent">
              <SelectValue placeholder="Filtrar cidade" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="todas">Todas as Cidades</SelectItem>
              {cidadesDisponiveis.map((cidade) => (
                <SelectItem key={cidade} value={cidade}>
                  {cidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Card do Imóvel Ideal - Destaque Principal */}
      {data.imovelIdeal && (
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-orange-500/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Imóvel Mais Procurado</CardTitle>
                <CardDescription>Perfil ideal baseado na análise de mercado</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/80 backdrop-blur border shadow-sm">
                <Bed className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">{data.imovelIdeal.quartos}</span>
                <span className="text-xs text-muted-foreground">Quartos</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/80 backdrop-blur border shadow-sm">
                <Car className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">{data.imovelIdeal.vagas}</span>
                <span className="text-xs text-muted-foreground">Vagas</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/80 backdrop-blur border shadow-sm col-span-2 md:col-span-1">
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <span className="text-lg font-bold truncate max-w-full">{data.imovelIdeal.bairro}</span>
                <span className="text-xs text-muted-foreground">Região Top</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-background/80 backdrop-blur border shadow-sm">
                <DollarSign className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-sm font-bold text-center">{data.imovelIdeal.faixaPreco}</span>
                <span className="text-xs text-muted-foreground">Faixa</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 shadow-sm">
                <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(data.imovelIdeal.orcamentoMedio)}
                </span>
                <span className="text-xs text-muted-foreground">Ticket Médio</span>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-orange-500/20">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Dica para Patrocinado</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Imóveis com <strong>{data.imovelIdeal.quartos} quartos</strong>,{" "}
                    <strong>{data.imovelIdeal.vagas} vaga{data.imovelIdeal.vagas > 1 ? "s" : ""}</strong>{" "}
                    em <strong>{data.imovelIdeal.bairro}</strong> na faixa de{" "}
                    <strong>{data.imovelIdeal.faixaPreco}</strong> têm alta demanda no mercado atual.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Quartos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Bed className="h-4 w-4 text-primary" />
              Quartos Buscados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.quartosDistribution.slice(0, 4).map((item) => (
              <div key={item.quartos} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.quartos} quarto{item.quartos > 1 ? "s" : ""}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.count}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-bold text-white",
                        getTemperatureColor(item.percent)
                      )}
                    >
                      {Math.round(item.percent)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getTemperatureColor(item.percent)
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vagas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              Vagas Buscadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.vagasDistribution.slice(0, 4).map((item) => (
              <div key={item.vagas} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.vagas} vaga{item.vagas !== 1 ? "s" : ""}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.count}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-bold text-white",
                        getTemperatureColor(item.percent)
                      )}
                    >
                      {Math.round(item.percent)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getTemperatureColor(item.percent)
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bairros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Regiões Mais Quentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.bairrosTop.slice(0, 5).map((item, idx) => (
              <div key={item.nome} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        idx === 0
                          ? "bg-red-500"
                          : idx === 1
                          ? "bg-orange-500"
                          : idx === 2
                          ? "bg-yellow-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                    <span className="font-medium truncate max-w-[100px]">{item.nome}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-bold text-white",
                      getTemperatureColor(item.percent)
                    )}
                  >
                    {Math.round(item.percent)}%
                  </Badge>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getTemperatureColor(item.percent)
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Faixas de Preço */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              Poder de Compra
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.faixasPreco.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-xs">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.count}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-bold text-white",
                        getTemperatureColor(item.percent)
                      )}
                    >
                      {Math.round(item.percent)}%
                    </Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      item.percent >= 25 ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-green-500"
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
