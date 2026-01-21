import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Scale, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  Building2,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Interface (Mantendo a mesma lógica)
interface Parceiro {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  desconto: string;
  contato: string;
  whatsapp: string | null;
  endereco: string | null;
}

export default function Parceiros() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParceiros();
  }, []);

  const fetchParceiros = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("parceiros_juridicos")
        .select("*")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setParceiros((data as any[]) || []);
    } catch (error) {
      console.error("Erro ao buscar parceiros:", error);
      toast.error("Erro ao carregar parceiros jurídicos.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (numero: string | null, nome: string) => {
    if (!numero) return;
    const texto = `Olá ${nome}, sou cliente da FlyImob e gostaria de saber mais sobre o desconto de parceria.`;
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank');
  };

  // Ícone dinâmico baseado na categoria
  const getCategoryIcon = (categoria: string) => {
    const cat = categoria.toLowerCase();
    if (cat.includes("advoga")) return Scale;
    if (cat.includes("cartór")) return Building2;
    if (cat.includes("docum") || cat.includes("despach")) return FileText;
    return ShieldCheck;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Carregando parceiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6 md:p-10 space-y-10">
      
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden rounded-3xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center shadow-2xl shadow-primary/5">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl opacity-50" />
        
        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-background/80 backdrop-blur-md border border-border rounded-2xl shadow-sm mb-4">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent pb-2">
            Clube de Benefícios Jurídicos
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Uma seleção exclusiva de advogados, cartórios e despachantes prontos para acelerar seus negócios com <strong className="text-primary font-semibold">descontos especiais</strong> para assinantes FlyImob.
          </p>
        </div>
      </div>

      {/* --- GRID DE PARCEIROS --- */}
      {parceiros.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-muted rounded-3xl bg-muted/10">
          <ShieldCheck className="h-16 w-16 text-muted-foreground/30" />
          <h3 className="text-xl font-semibold text-muted-foreground">Nenhum parceiro encontrado</h3>
          <p className="text-sm text-muted-foreground/70">Estamos negociando novos benefícios. Volte em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parceiros.map((parceiro, index) => {
            const Icon = getCategoryIcon(parceiro.categoria);
            
            return (
              <div 
                key={parceiro.id}
                className="group relative flex flex-col h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Header do Card */}
                <div className="relative p-6 pb-0 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border border-border/50 text-xs font-medium px-3 py-1">
                      {parceiro.categoria}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {parceiro.nome}
                    </h3>
                    {parceiro.endereco && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        <span className="truncate">{parceiro.endereco}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="relative p-6 flex-1 space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
                    {parceiro.descricao}
                  </p>

                  {/* Card de Desconto */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-4 group-hover:border-green-500/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-600">
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-600/80 uppercase tracking-wide">Benefício Exclusivo</p>
                        <p className="text-sm font-bold text-green-700">{parceiro.desconto}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer (Ações) */}
                <div className="relative p-6 pt-0 mt-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {parceiro.whatsapp ? (
                      <Button 
                        onClick={() => handleWhatsApp(parceiro.whatsapp, parceiro.nome)}
                        className="col-span-2 w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 h-11 rounded-xl group/btn"
                      >
                        <MessageCircle className="mr-2 h-4 w-4 group-hover/btn:animate-bounce" />
                        Chamar no WhatsApp
                        <ArrowRight className="ml-auto h-4 w-4 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        className="col-span-2 w-full h-11 rounded-xl"
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Ver Contato
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}