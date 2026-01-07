import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, MapPin, User, Plus, Trash2, CheckCircle2, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- Interfaces ---
interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
}

interface Agendamento {
  id: string;
  data_visita: string; 
  imovel_info: string;
  status: 'agendado' | 'concluido' | 'cancelado';
  lead_id: string;
  lead?: Lead; 
}

export default function Agenda() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form States
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [time, setTime] = useState("10:00");
  const [imovelInfo, setImovelInfo] = useState("");

  // TRUQUE: 'sb' ignora a checagem de tipos estrita do TypeScript
  // Isso resolve o erro "Argument of type 'leads' is not assignable..."
  const sb = supabase as any;

  useEffect(() => {
    fetchLeads();
    fetchAgendamentos();
  }, [user?.id]);

  const fetchLeads = async () => {
    if (!user?.id) return;
    
    // Usamos 'sb' em vez de 'supabase'
    const { data } = await sb
      .from("leads")
      .select("id, nome, whatsapp")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) {
        // Forçamos a tipagem para o React entender
        setLeads(data as Lead[]);
    }
  };

  const fetchAgendamentos = async () => {
    if (!user?.id) return;
    setLoading(true);
    
    const { data, error } = await sb
      .from("agendamentos")
      .select(`
        *,
        lead:leads (id, nome, whatsapp)
      `)
      .eq("user_id", user.id)
      .order("data_visita", { ascending: true });

    if (error) {
      console.error("Erro ao buscar agenda:", error);
    } else if (data) {
      const formatted = data.map((item: any) => ({
        ...item,
        lead: item.lead 
      }));
      setAgendamentos(formatted as Agendamento[]);
    }
    setLoading(false);
  };

  const handleCreateAppointment = async () => {
    if (!date || !selectedLeadId || !imovelInfo || !user) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const fullDate = new Date(date);
    fullDate.setHours(hours, minutes, 0, 0);

    const { error } = await sb.from("agendamentos").insert({
      user_id: user.id,
      lead_id: selectedLeadId,
      data_visita: fullDate.toISOString(),
      imovel_info: imovelInfo,
      status: "agendado"
    });

    if (error) {
      toast({ title: "Erro ao agendar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Visita Agendada!", className: "bg-green-600 text-white" });
      setIsDialogOpen(false);
      fetchAgendamentos();
      setImovelInfo("");
      setSelectedLeadId("");
    }
  };

  const handleDelete = async (id: string) => {
    await sb.from("agendamentos").delete().eq("id", id);
    setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Agendamento removido" });
  };

  const handleToggleStatus = async (item: Agendamento) => {
    const newStatus = item.status === "concluido" ? "agendado" : "concluido";
    await sb.from("agendamentos").update({ status: newStatus }).eq("id", item.id);
    setAgendamentos((prev) => prev.map((a) => a.id === item.id ? { ...a, status: newStatus } : a));
  };

  const selectedDateAppointments = agendamentos.filter((a) => {
    if (!date) return false;
    const aDate = new Date(a.data_visita);
    return (
      aDate.getDate() === date.getDate() &&
      aDate.getMonth() === date.getMonth() &&
      aDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="space-y-6 pb-10">
      <AppHeader title="Agenda de Visitas" subtitle="Gerencie suas visitas e compromissos" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 pt-0">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Calendário</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border bg-card"
                locale={ptBR}
              />
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Agendado</p>
                <p className="text-2xl font-bold text-primary">{agendamentos.filter(a => a.status === 'agendado').length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="border-border shadow-soft h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {date ? format(date, "d 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
                </CardTitle>
                <CardDescription>
                  {selectedDateAppointments.length} visitas neste dia
                </CardDescription>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Visita
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Nova Visita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Cliente (Lead)</Label>
                      <Select onValueChange={setSelectedLeadId} value={selectedLeadId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um lead..." />
                        </SelectTrigger>
                        <SelectContent>
                          {leads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id}>
                              {lead.nome} ({lead.whatsapp})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Imóvel / Local</Label>
                      <Textarea 
                        placeholder="Endereço ou Link do Imóvel" 
                        value={imovelInfo}
                        onChange={(e) => setImovelInfo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input 
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateAppointment} className="w-full">
                    Confirmar
                  </Button>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[500px] p-6">
                {selectedDateAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10 opacity-60">
                    <CalendarIcon className="h-16 w-16 mb-4 stroke-1" />
                    <p className="text-lg">Agenda livre</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateAppointments.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                          item.status === 'concluido' 
                            ? 'bg-muted/30 border-border opacity-60' 
                            : 'bg-card border-l-4 border-l-primary shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center min-w-[60px] px-2 border-r border-border/50">
                          <span className="text-lg font-bold text-primary">
                            {format(new Date(item.data_visita), "HH:mm")}
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 font-semibold text-base">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {item.lead?.nome || "Cliente"}
                          </div>
                          <div className="text-sm text-foreground/80 flex items-start gap-2">
                            {item.imovel_info.includes("http") ? <LinkIcon className="h-3.5 w-3.5 mt-1" /> : <MapPin className="h-3.5 w-3.5 mt-1" />}
                            <span className="whitespace-pre-wrap">{item.imovel_info}</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                             <Badge variant={item.status === 'concluido' ? 'secondary' : 'default'} className="text-[10px]">
                               {item.status}
                             </Badge>
                             <a href={`https://wa.me/${item.lead?.whatsapp}`} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:underline">WhatsApp</a>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2 ml-auto">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => handleToggleStatus(item)}>
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}