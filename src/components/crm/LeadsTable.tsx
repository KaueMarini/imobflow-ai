import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types";

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

export function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Lead</TableHead>
            <TableHead className="font-semibold">WhatsApp</TableHead>
            <TableHead className="font-semibold">Resumo do Interesse</TableHead>
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
              <TableCell className="text-muted-foreground">
                {lead.interesse_bairro} • {lead.quartos} quartos • Até {formatCurrency(lead.orcamento_max)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
