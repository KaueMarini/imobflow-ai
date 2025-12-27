import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Plus, Search } from "lucide-react";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { LeadDetailsSheet } from "@/components/crm/LeadDetailsSheet";
import { Lead } from "@/types";

export const mockLeadsData: Lead[] = [
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
  {
    id: "5",
    nome: "Fernanda Costa",
    whatsapp: "+55 21 95555-7890",
    interesse_bairro: "Tijuca",
    orcamento_max: 500000,
    quartos: 3,
    status: "atendimento",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    nome: "Carlos Eduardo Lima",
    whatsapp: "+55 21 94444-1234",
    interesse_bairro: "Barra da Tijuca",
    orcamento_max: 1500000,
    quartos: 4,
    status: "visita",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    nome: "Patrícia Rocha",
    whatsapp: "+55 21 93333-5678",
    interesse_bairro: "Flamengo",
    orcamento_max: 720000,
    quartos: 2,
    status: "fechado",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    nome: "Bruno Almeida",
    whatsapp: "+55 21 92222-9012",
    interesse_bairro: "Copacabana",
    orcamento_max: 900000,
    quartos: 3,
    status: "novo",
    cliente_saas_id: "1",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

export default function CRM() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="CRM de Leads"
        subtitle="Gerencie seus leads e acompanhe o funil de vendas"
      />

      <div className="p-6 space-y-4">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar lead..."
                className="pl-9 bg-card border-border"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="copacabana">Copacabana</SelectItem>
                <SelectItem value="ipanema">Ipanema</SelectItem>
                <SelectItem value="leblon">Leblon</SelectItem>
                <SelectItem value="botafogo">Botafogo</SelectItem>
                <SelectItem value="flamengo">Flamengo</SelectItem>
                <SelectItem value="barra">Barra da Tijuca</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[160px] bg-card border-border">
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="500">Até R$ 500 mil</SelectItem>
                <SelectItem value="800">R$ 500 - 800 mil</SelectItem>
                <SelectItem value="1000">R$ 800 mil - 1M</SelectItem>
                <SelectItem value="1500">Acima de R$ 1M</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Lead
            </Button>
          </div>
        </div>

        {/* Content */}
        <LeadsTable leads={mockLeadsData} onLeadClick={handleLeadClick} />
      </div>

      {/* Lead Details Sheet */}
      <LeadDetailsSheet
        lead={selectedLead}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
