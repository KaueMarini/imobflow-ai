import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function RecentLeads() {
  // Sem dados mockados - quando tivermos tabela de leads, buscaremos do banco
  return (
    <Card className="border-border shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">
            Últimos Leads Ativos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Leads mais recentes aguardando ação
          </p>
        </div>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum lead ainda
          </h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Quando seus leads entrarem em contato, eles aparecerão aqui.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
