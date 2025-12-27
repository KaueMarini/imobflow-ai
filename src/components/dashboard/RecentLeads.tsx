import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, MapPin, DollarSign } from "lucide-react";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";

const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "Maria Silva",
    whatsapp: "+55 21 99999-1234",
    interesse_bairro: "Copacabana",
    orcamento_max: 850000,
    quartos: 2,
    status: "novo",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    nome: "João Pedro Santos",
    whatsapp: "+55 21 98888-5678",
    interesse_bairro: "Leblon",
    orcamento_max: 1200000,
    quartos: 3,
    status: "atendimento",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    nome: "Ana Carolina Mendes",
    whatsapp: "+55 21 97777-9012",
    interesse_bairro: "Ipanema",
    orcamento_max: 950000,
    quartos: 2,
    status: "visita",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    nome: "Ricardo Oliveira",
    whatsapp: "+55 21 96666-3456",
    interesse_bairro: "Botafogo",
    orcamento_max: 650000,
    quartos: 2,
    status: "novo",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];

const statusConfig = {
  novo: { label: "Novo", className: "bg-success/10 text-success border-success/20" },
  atendimento: { label: "Em conversa", className: "bg-primary/10 text-primary border-primary/20" },
  visita: { label: "Visita agendada", className: "bg-warning/10 text-warning border-warning/20" },
  fechado: { label: "Fechado", className: "bg-muted text-muted-foreground border-muted" },
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins} min atrás`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function RecentLeads() {
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
        <div className="space-y-3">
          {mockLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-all hover:bg-secondary/50 hover:shadow-soft cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{lead.nome}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        statusConfig[lead.status].className
                      )}
                    >
                      {statusConfig[lead.status].label}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {lead.interesse_bairro}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(lead.orcamento_max)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(lead.created_at!)}
                    </span>
                  </div>
                </div>
              </div>
              <Button size="sm" className="gap-2 bg-success hover:bg-success/90">
                <MessageSquare className="h-4 w-4" />
                Conversar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
