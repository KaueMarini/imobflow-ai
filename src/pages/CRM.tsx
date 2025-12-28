import { useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Filter, 
  Search, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  UserPlus,
  X
} from "lucide-react";
import { LeadsTable } from "@/components/crm/LeadsTable";
import { LeadDetailsSheet } from "@/components/crm/LeadDetailsSheet";
import { Lead, LeadStatus } from "@/types";

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

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  novo: { label: "Novos", color: "bg-blue-500", icon: UserPlus },
  atendimento: { label: "Em Atendimento", color: "bg-amber-500", icon: Clock },
  visita: { label: "Visita Agendada", color: "bg-purple-500", icon: TrendingUp },
  fechado: { label: "Fechados", color: "bg-emerald-500", icon: CheckCircle2 },
};

export default function CRM() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bairroFilter, setBairroFilter] = useState<string>("all");

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      novo: mockLeadsData.filter(l => l.status === "novo").length,
      atendimento: mockLeadsData.filter(l => l.status === "atendimento").length,
      visita: mockLeadsData.filter(l => l.status === "visita").length,
      fechado: mockLeadsData.filter(l => l.status === "fechado").length,
      total: mockLeadsData.length,
    };
  }, []);

  // Get unique bairros
  const bairros = useMemo(() => {
    const unique = [...new Set(mockLeadsData.map(l => l.interesse_bairro))];
    return unique.sort();
  }, []);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return mockLeadsData.filter(lead => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          lead.nome.toLowerCase().includes(search) ||
          lead.whatsapp.includes(search) ||
          lead.interesse_bairro.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== "all" && lead.status !== statusFilter) {
        return false;
      }

      // Bairro filter
      if (bairroFilter !== "all" && lead.interesse_bairro !== bairroFilter) {
        return false;
      }

      return true;
    });
  }, [searchTerm, statusFilter, bairroFilter]);

  const hasActiveFilters = searchTerm || statusFilter !== "all" || bairroFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBairroFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="CRM de Leads"
        subtitle="Gerencie seus leads e acompanhe o funil de vendas"
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(statusConfig) as LeadStatus[]).map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const count = stats[status];
            
            return (
              <Card 
                key={status} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border-border/50 ${
                  statusFilter === status ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{config.label}</p>
                      <p className="text-3xl font-bold mt-1">{count}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${config.color}/10`}>
                      <Icon className={`h-6 w-6 ${config.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                  {/* Decorative bar */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.color}`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Total leads indicator */}
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">Total de leads:</span>
          <span className="font-semibold">{stats.total}</span>
        </div>

        {/* Filters and Actions */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-1 gap-3 flex-wrap items-center">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar lead..."
                    className="pl-9 bg-background border-border"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {(Object.keys(statusConfig) as LeadStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${statusConfig[status].color}`} />
                          {statusConfig[status].label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={bairroFilter} onValueChange={setBairroFilter}>
                  <SelectTrigger className="w-[160px] bg-background border-border">
                    <SelectValue placeholder="Bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os bairros</SelectItem>
                    {bairros.map(bairro => (
                      <SelectItem key={bairro} value={bairro}>{bairro}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    Limpar filtros
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredLeads.length}</span> de {stats.total} leads
          </p>
        </div>

        {/* Leads Table */}
        {filteredLeads.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não encontramos leads com os filtros selecionados. Tente ajustar seus critérios de busca.
              </p>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <LeadsTable leads={filteredLeads} onLeadClick={handleLeadClick} />
        )}
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