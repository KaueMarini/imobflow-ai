import { Lead, LeadStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, MapPin, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadsKanbanProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

type KanbanColumn = {
  id: LeadStatus;
  title: string;
  color: string;
};

const columns: KanbanColumn[] = [
  { id: "novo", title: "Novos", color: "bg-success" },
  { id: "atendimento", title: "Em Conversa", color: "bg-primary" },
  { id: "visita", title: "Visita Agendada", color: "bg-warning" },
  { id: "fechado", title: "Negociação", color: "bg-muted-foreground" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

export function LeadsKanban({ leads, onLeadClick }: LeadsKanbanProps) {
  const getLeadsByStatus = (status: LeadStatus) =>
    leads.filter((lead) => lead.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnLeads = getLeadsByStatus(column.id);
        return (
          <div
            key={column.id}
            className="flex flex-col rounded-xl border border-border bg-card/50"
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <div className={cn("h-2 w-2 rounded-full", column.color)} />
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {columnLeads.length}
              </Badge>
            </div>

            {/* Cards */}
            <div className="flex-1 p-2 space-y-2 min-h-[400px] max-h-[600px] overflow-y-auto">
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onLeadClick(lead)}
                  className="rounded-lg border border-border bg-card p-4 cursor-pointer transition-all hover:shadow-medium hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground leading-tight">
                          {lead.nome}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.whatsapp}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(lead.created_at!)}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{lead.interesse_bairro}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formatCurrency(lead.orcamento_max)}</span>
                      <span className="text-muted-foreground">
                        • {lead.quartos} quartos
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full gap-2 bg-success hover:bg-success/90"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Conversar
                  </Button>
                </div>
              ))}

              {columnLeads.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  Nenhum lead
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
