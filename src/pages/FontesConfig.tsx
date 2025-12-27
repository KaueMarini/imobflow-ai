import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Crown,
  Building2,
  GripVertical,
  Plus,
  X,
  Save,
  Info,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FonteImobiliaria {
  id: string;
  nome: string;
  tipo: "vip" | "fallback" | "disponivel";
}

const todasFontes: FonteImobiliaria[] = [
  { id: "1", nome: "Lopes", tipo: "disponivel" },
  { id: "2", nome: "Prime Imóveis", tipo: "disponivel" },
  { id: "3", nome: "R3 Imobiliária", tipo: "disponivel" },
  { id: "4", nome: "Century 21", tipo: "disponivel" },
  { id: "5", nome: "RE/MAX", tipo: "disponivel" },
  { id: "6", nome: "Coelho da Fonseca", tipo: "disponivel" },
  { id: "7", nome: "Sawala", tipo: "disponivel" },
  { id: "8", nome: "Patrimóvel", tipo: "disponivel" },
  { id: "9", nome: "Apolar", tipo: "disponivel" },
  { id: "10", nome: "ZAP Imóveis", tipo: "disponivel" },
];

export default function FontesConfig() {
  const [fontesVIP, setFontesVIP] = useState<FonteImobiliaria[]>([
    { id: "1", nome: "Lopes", tipo: "vip" },
    { id: "2", nome: "Prime Imóveis", tipo: "vip" },
  ]);

  const [fontesFallback, setFontesFallback] = useState<FonteImobiliaria[]>([
    { id: "3", nome: "R3 Imobiliária", tipo: "fallback" },
    { id: "5", nome: "RE/MAX", tipo: "fallback" },
    { id: "8", nome: "Patrimóvel", tipo: "fallback" },
  ]);

  const fontesDisponiveis = todasFontes.filter(
    (f) =>
      !fontesVIP.find((v) => v.id === f.id) &&
      !fontesFallback.find((fb) => fb.id === f.id)
  );

  const addFonteVIP = (id: string) => {
    const fonte = todasFontes.find((f) => f.id === id);
    if (fonte) {
      setFontesVIP([...fontesVIP, { ...fonte, tipo: "vip" }]);
    }
  };

  const addFonteFallback = (id: string) => {
    const fonte = todasFontes.find((f) => f.id === id);
    if (fonte) {
      setFontesFallback([...fontesFallback, { ...fonte, tipo: "fallback" }]);
    }
  };

  const removeFonteVIP = (id: string) => {
    setFontesVIP(fontesVIP.filter((f) => f.id !== id));
  };

  const removeFonteFallback = (id: string) => {
    setFontesFallback(fontesFallback.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Regras de Fontes"
        subtitle="Configure a prioridade de busca de imóveis por imobiliária"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Como funciona a prioridade?</p>
            <p className="text-sm text-muted-foreground mt-1">
              O sistema busca imóveis primeiro nas <strong>Fontes VIP</strong>. Se não encontrar
              resultados suficientes, complementa com as <strong>Fontes de Fallback</strong>.
              Isso garante que seus parceiros preferenciais apareçam primeiro para os leads.
            </p>
          </div>
        </div>

        {/* VIP Sources */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Fontes Preferenciais (VIP)
                  <Badge className="bg-primary">Prioridade Alta</Badge>
                </CardTitle>
                <CardDescription>
                  Imóveis dessas imobiliárias aparecem primeiro nas recomendações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected VIP sources */}
            <div className="space-y-2">
              {fontesVIP.map((fonte, index) => (
                <div
                  key={fonte.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Badge variant="outline" className="bg-primary/10 border-primary/20">
                    #{index + 1}
                  </Badge>
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium flex-1">{fonte.nome}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFonteVIP(fonte.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {fontesVIP.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
                  <Crown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma fonte VIP selecionada</p>
                  <p className="text-sm">Adicione suas imobiliárias parceiras preferenciais</p>
                </div>
              )}
            </div>

            {/* Add VIP source */}
            <Select onValueChange={addFonteVIP}>
              <SelectTrigger className="max-w-xs">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <SelectValue placeholder="Adicionar fonte VIP" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {fontesDisponiveis.length === 0 ? (
                  <SelectItem value="_" disabled>
                    Todas as fontes já foram adicionadas
                  </SelectItem>
                ) : (
                  fontesDisponiveis.map((fonte) => (
                    <SelectItem key={fonte.id} value={fonte.id}>
                      {fonte.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Hierarchy Arrow */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-muted-foreground">
            <ChevronDown className="h-6 w-6" />
            <span className="text-xs">Se não encontrar, busca em</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>

        {/* Fallback Sources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Fontes de Fallback (Reserva)
                  <Badge variant="secondary">Prioridade Normal</Badge>
                </CardTitle>
                <CardDescription>
                  Usadas para complementar resultados quando as fontes VIP não são suficientes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected fallback sources */}
            <div className="space-y-2">
              {fontesFallback.map((fonte, index) => (
                <div
                  key={fonte.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Badge variant="outline" className="text-muted-foreground">
                    #{index + 1}
                  </Badge>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium flex-1">{fonte.nome}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFonteFallback(fonte.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {fontesFallback.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border border-dashed rounded-lg">
                  <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma fonte de fallback selecionada</p>
                  <p className="text-sm">Adicione fontes secundárias para complementar resultados</p>
                </div>
              )}
            </div>

            {/* Add fallback source */}
            <Select onValueChange={addFonteFallback}>
              <SelectTrigger className="max-w-xs">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <SelectValue placeholder="Adicionar fonte de fallback" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {fontesDisponiveis.length === 0 ? (
                  <SelectItem value="_" disabled>
                    Todas as fontes já foram adicionadas
                  </SelectItem>
                ) : (
                  fontesDisponiveis.map((fonte) => (
                    <SelectItem key={fonte.id} value={fonte.id}>
                      {fonte.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
