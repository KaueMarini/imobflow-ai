import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, TrendingUp, Search, Target, Clock, Filter, ChevronRight, Phone, MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

// Definição de Tipos para organização
type Lead = {
  id: string;
  nome: string;
  status: string;
  created_at: string;
  whatsapp?: string;
};

type MembroEquipe = {
  id: string;
  user_id: string;
  nome_empresa: string;
  whatsapp: string;
  role: string;
  status_whatsapp: string;
  evolution_status: string;
  // Métricas Calculadas
  total_leads: number;
  leads_novos: number;
  leads_em_atendimento: number;
  leads_ganhos: number;
  leads_perdidos: number;
  taxa_conversao: number; // Porcentagem
};

export default function GestaoEquipe() {
  const { clienteSaas } = useAuth();
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [leadsTotalGeral, setLeadsTotalGeral] = useState(0);

  // Estado do Detalhe (Sheet)
  const [selectedMember, setSelectedMember] = useState<MembroEquipe | null>(null);
  const [memberLeads, setMemberLeads] = useState<Lead[]>([]);
  const [loadingMemberData, setLoadingMemberData] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const imobiliariaId = (clienteSaas as any)?.imobiliaria_id;

  useEffect(() => {
    if (imobiliariaId) {
      fetchDadosMacro();
    }
  }, [imobiliariaId]);

  // 1. Busca MACRO (Leve e Rápida)
  const fetchDadosMacro = async () => {
    try {
      setLoading(true);
      
      // Busca membros
      const { data: membros, error: errMembros } = await (supabase as any)
        .from('clientes_saas')
        .select('*')
        .eq('imobiliaria_id', imobiliariaId);

      if (errMembros) throw errMembros;

      // Busca APENAS status e user_id de TODOS os leads (Super leve)
      const { data: leads, error: errLeads } = await (supabase as any)
        .from('leads')
        .select('user_id, status');

      if (errLeads) throw errLeads;

      setLeadsTotalGeral(leads.length);

      // Processamento no Front-end (Cálculo de Métricas)
      const equipeProcessada = membros.map((membro: any) => {
        const leadsDoMembro = leads.filter((l: any) => l.user_id === membro.user_id);
        
        const total = leadsDoMembro.length;
        const novos = leadsDoMembro.filter((l: any) => ['novo', 'pendente'].includes(l.status?.toLowerCase())).length;
        const ganhos = leadsDoMembro.filter((l: any) => ['vendido', 'alugado', 'ganho', 'fechado'].includes(l.status?.toLowerCase())).length;
        const perdidos = leadsDoMembro.filter((l: any) => ['perdido', 'arquivado', 'descartado'].includes(l.status?.toLowerCase())).length;
        const atendimento = total - (novos + ganhos + perdidos);

        // Conversão: (Ganhos / (Total - Perdidos)) * 100 - Uma métrica justa
        const baseCalculo = total > 0 ? total : 1;
        const taxa = Math.round((ganhos / baseCalculo) * 100);

        return {
          ...membro,
          total_leads: total,
          leads_novos: novos,
          leads_em_atendimento: atendimento,
          leads_ganhos: ganhos,
          leads_perdidos: perdidos,
          taxa_conversao: taxa,
          status_whatsapp: membro.evolution_status === 'connected' ? 'online' : 'offline'
        };
      });

      // Ordena por quem tem mais leads
      setEquipe(equipeProcessada.sort((a: any, b: any) => b.total_leads - a.total_leads));

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      toast.error("Erro ao carregar dados da equipe");
    } finally {
      setLoading(false);
    }
  };

  // 2. Busca MICRO (Detalhada sob demanda)
  const handleMemberClick = async (membro: MembroEquipe) => {
    setSelectedMember(membro);
    setIsSheetOpen(true);
    setLoadingMemberData(true);

    try {
      // Busca os últimos 50 leads desse corretor (ESCALABILIDADE GARANTIDA)
      const { data, error } = await (supabase as any)
        .from('leads')
        .select('id, nome, status, created_at, whatsapp')
        .eq('user_id', membro.user_id)
        .order('created_at', { ascending: false })
        .limit(50); // Limite de segurança

      if (error) throw error;
      setMemberLeads(data || []);
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error);
      toast.error("Erro ao carregar leads do corretor");
    } finally {
      setLoadingMemberData(false);
    }
  };

  const filteredEquipe = equipe.filter(m => 
    (m.nome_empresa || "").toLowerCase().includes(search.toLowerCase()) || 
    (m.whatsapp || "").includes(search)
  );

  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader
        title="Torre de Controle"
        subtitle="Gestão de alta performance da equipe comercial"
      />

      <div className="p-6 space-y-6 container mx-auto max-w-7xl">
        
        {/* === KPI CARDS (Topo) === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{leadsTotalGeral}</div>
              <p className="text-xs text-muted-foreground mt-1">Base completa</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Corretores Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{equipe.length}</div>
              <div className="flex items-center gap-2 mt-1">
                 <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                 <p className="text-xs text-muted-foreground">{equipe.filter(e => e.status_whatsapp === 'online').length} Online agora</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leads Novos (Fila)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {equipe.reduce((acc, curr) => acc + curr.leads_novos, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Aguardando atendimento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vendas/Fechamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {equipe.reduce((acc, curr) => acc + curr.leads_ganhos, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Leads com sucesso</p>
            </CardContent>
          </Card>
        </div>

        {/* === TABELA PRINCIPAL === */}
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Performance da Equipe
                    </CardTitle>
                    <CardDescription>Clique em um corretor para ver o raio-x detalhado.</CardDescription>
                </div>
                <div className="w-full md:w-[300px] relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por nome ou telefone..." 
                        className="pl-8 bg-background" 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Corretor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Volume</TableHead>
                  <TableHead className="w-[200px]">Funil (Novos / Atend. / Fech.)</TableHead>
                  <TableHead className="text-right">Conversão</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                <p className="text-muted-foreground text-sm">Carregando dados...</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : filteredEquipe.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                            Nenhum corretor encontrado.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredEquipe.map((membro) => (
                      <TableRow 
                        key={membro.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleMemberClick(membro)}
                      >
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={`https://ui-avatars.com/api/?name=${membro.nome_empresa || 'U'}&background=random`} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {membro.nome_empresa || 'Sem Nome'}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {membro.role === 'gerente' ? <Target className="h-3 w-3 text-purple-500" /> : <Users className="h-3 w-3" />}
                                        <span className="capitalize">{membro.role}</span>
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                             {membro.status_whatsapp === 'online' ? (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-transparent">
                                    Online
                                </Badge>
                             ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                    Offline
                                </Badge>
                             )}
                        </TableCell>

                        <TableCell className="text-center">
                            <div className="font-bold text-lg">{membro.total_leads}</div>
                            <span className="text-xs text-muted-foreground">leads</span>
                        </TableCell>

                        <TableCell>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-muted-foreground px-1">
                                    <span className="text-blue-600 font-medium">{membro.leads_novos}</span>
                                    <span>{membro.leads_em_atendimento}</span>
                                    <span className="text-emerald-600 font-medium">{membro.leads_ganhos}</span>
                                </div>
                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div 
                                        className="bg-blue-500" 
                                        style={{ width: `${(membro.leads_novos / (membro.total_leads || 1)) * 100}%` }} 
                                    />
                                    <div 
                                        className="bg-slate-400" 
                                        style={{ width: `${(membro.leads_em_atendimento / (membro.total_leads || 1)) * 100}%` }} 
                                    />
                                    <div 
                                        className="bg-emerald-500" 
                                        style={{ width: `${(membro.leads_ganhos / (membro.total_leads || 1)) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        </TableCell>

                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <span className="font-bold">{membro.taxa_conversao}%</span>
                                {membro.taxa_conversao > 10 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                            </div>
                        </TableCell>

                        <TableCell>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* === SHEET: DETALHES DO CORRETOR === */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
            {selectedMember && (
                <div className="space-y-6">
                    <SheetHeader className="pb-4 border-b">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/10">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${selectedMember.nome_empresa}&size=128`} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <SheetTitle className="text-xl">{selectedMember.nome_empresa}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2 mt-1">
                                    {selectedMember.whatsapp || "Sem telefone"}
                                    <Separator orientation="vertical" className="h-3" />
                                    <span className="capitalize">{selectedMember.role}</span>
                                </SheetDescription>
                                {/* CORREÇÃO AQUI: Mudamos size="xs" para size="sm" e ajustamos className */}
                                <div className="flex gap-2 mt-3">
                                    <Button size="sm" variant="outline" className="h-8 gap-2 text-xs">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        WhatsApp
                                    </Button>
                                    <Button size="sm" variant="outline" className="h-8 gap-2 text-xs">
                                        <Phone className="h-3.5 w-3.5" />
                                        Ligar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SheetHeader>

                    {/* STATS RÁPIDOS */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900">
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">Novos</p>
                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedMember.leads_novos}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase">Em Andamento</p>
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{selectedMember.leads_em_atendimento}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase">Fechados</p>
                            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{selectedMember.leads_ganhos}</p>
                        </div>
                    </div>

                    {/* LISTA DE ÚLTIMOS LEADS */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary" />
                                Últimas Atividades
                            </h3>
                            <Badge variant="secondary" className="text-xs font-normal">
                                Últimos 50 leads
                            </Badge>
                        </div>
                        
                        <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/10">
                            {loadingMemberData ? (
                                <div className="space-y-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                                    ))}
                                </div>
                            ) : memberLeads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                                    <AlertCircle className="h-8 w-8 opacity-20" />
                                    <p>Nenhum lead recente encontrado.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {memberLeads.map((lead) => (
                                        <div key={lead.id} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{lead.nome || "Lead sem nome"}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}</span>
                                                    <span>•</span>
                                                    <span>{lead.whatsapp || "Sem whats"}</span>
                                                </div>
                                            </div>
                                            <Badge 
                                                variant="outline" 
                                                className={`capitalize ${
                                                    lead.status === 'novo' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    lead.status === 'vendido' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                                }`}
                                            >
                                                {lead.status || 'novo'}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* BOTÃO DE AÇÃO */}
                    <div className="pt-4">
                        <Button className="w-full" variant="secondary">
                            Ver Relatório Completo do Usuário
                        </Button>
                    </div>
                </div>
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}