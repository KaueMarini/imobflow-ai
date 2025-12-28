import { useState, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Users, 
  X,
  Phone,
  MapPin,
  Clock,
  MessageSquare
} from "lucide-react";
import { Lead } from "@/types";

// Mock data simplificado - apenas nome, telefone, interesse e data
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
    status: "novo",
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
    status: "novo",
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
    status: "novo",
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
    status: "novo",
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
    status: "novo",
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

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  return `${diffDays}d atrás`;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}k`;
}

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bairroFilter, setBairroFilter] = useState<string>("all");

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

      // Bairro filter
      if (bairroFilter !== "all" && lead.interesse_bairro !== bairroFilter) {
        return false;
      }

      return true;
    });
  }, [searchTerm, bairroFilter]);

  const hasActiveFilters = searchTerm || bairroFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setBairroFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Leads"
        subtitle="Todos os leads que entraram em contato"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{mockLeadsData.length}</p>
                <p className="text-sm text-muted-foreground">Total de leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar lead..."
                  className="pl-9 bg-background border-border"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={bairroFilter} onValueChange={setBairroFilter}>
                <SelectTrigger className="w-[180px] bg-background border-border">
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
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{filteredLeads.length}</span> leads
        </p>

        {/* Leads List */}
        {filteredLeads.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lead encontrado</h3>
              <p className="text-muted-foreground max-w-md">
                Não encontramos leads com os filtros selecionados.
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
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <Card key={lead.id} className="border-border/50 transition-all duration-200 hover:shadow-md hover:border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-lg ring-2 ring-primary/10 flex-shrink-0">
                      {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{lead.nome}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span className="font-mono text-sm">{lead.whatsapp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTimeAgo(lead.created_at)}
                        </div>
                      </div>
                      
                      {/* Interesse */}
                      <div className="mt-4 p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          Interesse
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {lead.interesse_bairro}
                          </span>
                          <span>•</span>
                          <span>{lead.quartos} quartos</span>
                          <span>•</span>
                          <span>Até {formatCurrency(lead.orcamento_max)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}