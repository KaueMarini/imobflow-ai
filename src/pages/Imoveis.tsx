// src/pages/Imoveis.tsx
// (Mantém imports iguais, altera a lógica de busca e renderização)
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Car, Maximize2, ExternalLink, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Interface alinhada com o banco
interface Imovel {
  id: number;
  titulo: string;
  preco: number;
  bairro: string | null;
  quartos: number | null;
  vagas: number | null;
  area_m2: number | null;
  banheiros: number | null;
  imagem_url: string | null;
  link: string;
  origem: string;
  condominio: number | null;
  iptu: number | null;
}

export default function Imoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoading(true);

        // NOTE: seu banco externo tem tabelas que não estão no types.ts deste projeto.
        // Para não quebrar o TypeScript, usamos o client sem tipagem aqui.
        const sb = supabase as any;

        // Busca simples e direta
        const { data, error } = await sb
          .from("imoveis_santos")
          .select("*")
          .limit(100) // Limite de segurança
          .order("id", { ascending: false });

        if (error) throw error;
        setImoveis(((data ?? []) as unknown) as Imovel[]);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImoveis();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Imóveis Disponíveis" subtitle="Capturados automaticamente" />
      <div className="p-6">
        {imoveis.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg">
            <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground">Verifique se o seu scraper Python rodou e populou a tabela 'imoveis_santos'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <Card key={imovel.id} className="group overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-52 bg-gray-100">
                  {imovel.imagem_url ? (
                    <img 
                      src={imovel.imagem_url} 
                      alt={imovel.titulo} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400"><Building2 size={40} /></div>
                  )}
                  <Badge className="absolute top-2 left-2 bg-black/80">{imovel.origem}</Badge>
                  <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded font-bold text-sm shadow">
                    {imovel.preco ? `R$ ${imovel.preco.toLocaleString('pt-BR')}` : 'Sob Consulta'}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1" title={imovel.titulo}>{imovel.titulo}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="h-4 w-4 mr-1" /> {imovel.bairro || "Bairro não informado"}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-1"><Bed size={14}/> {imovel.quartos || '-'} quartos</div>
                    <div className="flex items-center gap-1"><Car size={14}/> {imovel.vagas || '-'} vagas</div>
                    <div className="flex items-center gap-1"><Maximize2 size={14}/> {imovel.area_m2 || '-'} m²</div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={imovel.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" /> Ver Anúncio
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}