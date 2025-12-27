import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreHorizontal, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lead, LeadStatus } from "@/types";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  novo: { label: "Novo", className: "bg-success/10 text-success border-success/20" },
  atendimento: { label: "Em conversa", className: "bg-primary/10 text-primary border-primary/20" },
  visita: { label: "Visita agendada", className: "bg-warning/10 text-warning border-warning/20" },
  fechado: { label: "Fechado", className: "bg-muted text-muted-foreground border-muted" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Lead</TableHead>
            <TableHead className="font-semibold">WhatsApp</TableHead>
            <TableHead className="font-semibold">Bairro</TableHead>
            <TableHead className="font-semibold">Orçamento</TableHead>
            <TableHead className="font-semibold">Quartos</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Captado em</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => onLeadClick(lead)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="font-medium">{lead.nome}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {lead.whatsapp}
              </TableCell>
              <TableCell>{lead.interesse_bairro}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(lead.orcamento_max)}
              </TableCell>
              <TableCell>{lead.quartos}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusConfig[lead.status].className)}
                >
                  {statusConfig[lead.status].label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(lead.created_at!)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-success hover:text-success hover:bg-success/10">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar lead</DropdownMenuItem>
                      <DropdownMenuItem>Agendar visita</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Arquivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
