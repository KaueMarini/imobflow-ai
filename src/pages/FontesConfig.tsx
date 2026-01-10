import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";
import {
  Layers,
  Crown,
  Building2,
  Plus,
  X,
  Save,
  ChevronDown,
  Loader2,
  Bot,
  Lock,
  ExternalLink
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface FonteImobiliaria {
  id: string;
  nome: string;
  tipo: "vip" | "fallback" | "disponivel";
}

export default function FontesConfig() {
  const { clienteSaas, refreshClienteSaas } = useAuth();
  
  // Estados de Dados
  const [fontesVIP, setFontesVIP] = useState<FonteImobiliaria[]>([]);
  const [fontesFallback, setFontesFallback] = useState<FonteImobiliaria[]>([]);
  const [fontesDisponiveisDB, setFontesDisponiveisDB] = useState<string[]>([]);
  
  // Estado do Robô (Manual vs Automático)
  const [modoManual, setModoManual] = useState(false);

  // Estados de UI
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Carregar Fontes REAIS do Banco + Configurações do Cliente
  useEffect(() => {
    async function loadData() {
      try {
        console.log("Iniciando carregamento de fontes...");

        // A. Buscar nomes das imobiliárias (Usando RPC para performance/unicidade)
        // Isso resolve o problema de limitar a 1000 linhas
        const { data: nomesData, error: rpcError } = await (supabase as any)
          .rpc('get_imobiliarias_unicas');
        
        let listaNomes: string[] = [];

        if (rpcError) {
            console.error("Erro RPC (tentando fallback):", rpcError);
            // Fallback se a função RPC não existir: Select normal (limitado)
            const { data: fallbackData } = await (supabase as any)
                .from('imoveis_santos')
                .select('origem')
                .limit(1000);
            
            if (fallbackData) {
                listaNomes = Array.from(new Set((fallbackData as any[]).map(i => i.origem).filter(Boolean)));
            }
        } else if (nomesData) {
            // Sucesso RPC: Mapeia o resultado [{origem: "X"}, {origem: "Y"}]
            listaNomes = nomesData.map((item: any) => item.origem).filter(Boolean);
        }

        setFontesDisponiveisDB(listaNomes.sort());

        // B. Carregar Configurações Salvas do Cliente
        if (clienteSaas) {
          const vip = (clienteSaas.fontes_preferenciais || []).map((nome, index) => ({
            id: `vip-${index}`,
            nome,
            tipo: "vip" as const,
          }));
          const fallback = (clienteSaas.fontes_secundarias || []).map((nome, index) => ({
            id: `fb-${index}`,
            nome,
            tipo: "fallback" as const,
          }));
          
          setFontesVIP(vip);
          setFontesFallback(fallback);
          
          // Carrega o modo do robô
          setModoManual((clienteSaas as any).modo_manual_envio || false);
        }
      } catch (err) {
        console.error("Erro geral ao carregar dados:", err);
        toast.error("Erro inesperado ao carregar configurações.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [clienteSaas]);

  // Filtra as fontes que já foram selecionadas para não duplicar no Select
  const fontesParaAdicionar = fontesDisponiveisDB.filter(
    (nome) =>
      !fontesVIP.find((v) => v.nome === nome) &&
      !fontesFallback.find((fb) => fb.nome === nome)
  );

  const addFonteVIP = (nome: string) => {
    if (!nome) return;
    setFontesVIP([...fontesVIP, { id: `new-vip-${Date.now()}`, nome, tipo: "vip" }]);
  };

  const addFonteFallback = (nome: string) => {
    if (!nome) return;
    setFontesFallback([...fontesFallback, { id: `new-fb-${Date.now()}`, nome, tipo: "fallback" }]);
  };

  const removeFonteVIP = (id: string) => {
    setFontesVIP(fontesVIP.filter((f) => f.id !== id));
  };

  const removeFonteFallback = (id: string) => {
    setFontesFallback(fontesFallback.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    if (!clienteSaas?.id) {
      toast.error("Erro: cliente não encontrado");
      return;
    }

    setSaving(true);
    
    try {
      const fontesPreferenciais = fontesVIP.map(f => f.nome);
      const fontesSecundarias = fontesFallback.map(f => f.nome);

      const sb = supabase as any;
      const { error } = await sb
        .from('clientes_saas')
        .update({
          fontes_preferenciais: fontesPreferenciais,
          fontes_secundarias: fontesSecundarias,
          modo_manual_envio: modoManual
        })
        .eq('id', clienteSaas.id);

      if (error) {
        console.error('Erro:', error);
        toast.error('Erro ao salvar configurações');
      } else {
        await refreshClienteSaas();
        toast.success('Configurações salvas!', {
          description: modoManual 
            ? 'Robô configurado para aprovação manual.' 
            : 'Robô configurado para envio automático.',
        });
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Erro inesperado ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader
        title="Cérebro do Robô"
        subtitle="Configure como a IA busca e entrega os imóveis"
      />

      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        
        {/* --- 1. MODO DE OPERAÇÃO DO ROBÔ --- */}
        <Card className={`border-2 transition-all ${modoManual ? 'border-amber-400 bg-amber-50/10' : 'border-green-500 bg-green-50/10'}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${modoManual ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Comportamento de Envio</CardTitle>
                <CardDescription>
                  Decida se a IA envia os imóveis sozinha ou pede sua aprovação.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm">
              <div className="space-y-1">
                <Label htmlFor="mode-switch" className="text-base font-semibold">
                  {modoManual ? "Modo: Aprovação Manual (Human in the Loop)" : "Modo: Envio Automático (Velocidade)"}
                </Label>
                <p className="text-sm text-muted-foreground max-w-xl">
                  {modoManual 
                    ? "A IA vai analisar o lead, dizer 'Vou verificar algumas opções e já te retorno' e notificar você. Você seleciona os imóveis manualmente no CRM."
                    : "A IA vai encontrar os 5 melhores matches e enviar IMEDIATAMENTE para o cliente com fotos e links, sem sua intervenção."
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`text-xs font-bold ${!modoManual ? 'text-green-600' : 'text-muted-foreground'}`}>AUTO</span>
                 <Switch 
                    id="mode-switch"
                    checked={modoManual}
                    onCheckedChange={setModoManual}
                 />
                 <span className={`text-xs font-bold ${modoManual ? 'text-amber-600' : 'text-muted-foreground'}`}>MANUAL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- INFO BANNER --- */}
        <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 flex gap-3">
                <ExternalLink className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-sm">Fontes Preferenciais (Links Abertos)</p>
                    <p className="text-xs mt-1 leading-relaxed">
                        Imóveis destas fontes são enviados com <strong>Link Direto</strong> e <strong>Fotos</strong>. 
                        O cliente vê a origem. Use para imóveis da sua carteira ou parceiros oficiais.
                    </p>
                </div>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 flex gap-3">
                <Lock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-sm">Fontes de Fallback (Sigilosas)</p>
                    <p className="text-xs mt-1 leading-relaxed">
                        Usadas se não houver preferenciais. O robô envia <strong>apenas dados e descrição</strong>, 
                        escondendo a origem e link. Ideal para captar leads de parceiros ocultos.
                    </p>
                </div>
            </div>
        </div>

        {/* --- 2. VIP SOURCES --- */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Fontes Preferenciais
                  <Badge className="bg-primary">Links Visíveis</Badge>
                </CardTitle>
                <CardDescription>Busca prioritária. O cliente recebe o link do site.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {fontesVIP.map((fonte, index) => (
                <div key={fonte.id} className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <Badge variant="outline" className="bg-primary/10 border-primary/20">#{index + 1}</Badge>
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium flex-1">{fonte.nome}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFonteVIP(fonte.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fontesVIP.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
                  <Crown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma fonte VIP selecionada</p>
                </div>
              )}
            </div>

            <Select onValueChange={addFonteVIP}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2"><Plus className="h-4 w-4" /><SelectValue placeholder="Adicionar imobiliária..." /></div>
              </SelectTrigger>
              <SelectContent>
                {fontesParaAdicionar.length > 0 ? (
                    fontesParaAdicionar.map((nome) => (
                        <SelectItem key={nome} value={nome}>{nome}</SelectItem>
                    ))
                ) : (
                    <div className="p-2 text-xs text-muted-foreground text-center">Nenhuma fonte nova encontrada.</div>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Seta Hierárquica */}
        <div className="flex justify-center -my-2 relative z-10">
          <Badge variant="secondary" className="px-4 py-1 text-xs text-muted-foreground bg-muted border-border shadow-sm">
             <ChevronDown className="h-3 w-3 mr-1" /> Se não encontrar, busca em:
          </Badge>
        </div>

        {/* --- 3. FALLBACK SOURCES --- */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Fontes de Fallback
                  <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3"/> Dados Ocultos</Badge>
                </CardTitle>
                <CardDescription>Busca secundária. O link e nome da imobiliária são removidos da mensagem.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {fontesFallback.map((fonte, index) => (
                <div key={fonte.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <Badge variant="outline" className="text-muted-foreground">#{index + 1}</Badge>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium flex-1">{fonte.nome}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFonteFallback(fonte.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {fontesFallback.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma fonte de fallback selecionada</p>
                </div>
              )}
            </div>

            <Select onValueChange={addFonteFallback}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2"><Plus className="h-4 w-4" /><SelectValue placeholder="Adicionar imobiliária..." /></div>
              </SelectTrigger>
              <SelectContent>
                {fontesParaAdicionar.length > 0 ? (
                    fontesParaAdicionar.map((nome) => (
                        <SelectItem key={nome} value={nome}>{nome}</SelectItem>
                    ))
                ) : (
                    <div className="p-2 text-xs text-muted-foreground text-center">Nenhuma fonte nova encontrada.</div>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* --- SAVE BAR --- */}
        <div className="sticky bottom-4 flex justify-end">
          <Card className="bg-background/80 backdrop-blur-md border shadow-lg">
             <CardContent className="p-2">
                <Button size="lg" className="gap-2 shadow-md" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}