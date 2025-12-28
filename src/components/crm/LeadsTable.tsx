import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Lead, LeadStatus } from "@/types";
import { MapPin, DollarSign, Bed, Clock } from "lucide-react";

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}k`;
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  return `${diffDays}d atrás`;
}

const statusConfig: Record<LeadStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
  novo: { label: "Novo", variant: "default", className: "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20" },
  atendimento: { label: "Em Atendimento", variant: "outline", className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20" },
  visita: { label: "Visita", variant: "outline", className: "bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20" },
  fechado: { label: "Fechado", variant: "outline", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20" },
};

export function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/50">
            <TableHead className="font-semibold text-foreground">Lead</TableHead>
            <TableHead className="font-semibold text-foreground">WhatsApp</TableHead>
            <TableHead className="font-semibold text-foreground">Interesse</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Quando</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => {
            const status = statusConfig[lead.status];
            return (
              <TableRow
                key={lead.id}
                className="cursor-pointer transition-all duration-200 hover:bg-primary/5 border-border/30"
                onClick={() => onLeadClick(lead)}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm ring-2 ring-primary/10">
                      {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-medium text-foreground block">{lead.nome}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground font-mono text-sm">{lead.whatsapp}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">{lead.interesse_bairro}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        {lead.quartos} quartos
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Até {formatCurrency(lead.orcamento_max)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={status.className}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(lead.created_at)}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}