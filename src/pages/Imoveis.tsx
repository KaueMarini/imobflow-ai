import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Car, Maximize2, ExternalLink, Building2, Loader2, Bath } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// 1. Importamos o tipo que JÁ EXISTE no seu projeto
import { ImovelUnico } from "@/types"; 

export default function Imoveis() {
  // 2. Usamos ImovelUnico na tipagem do estado
  const [imoveis, setImoveis] = useState<ImovelUnico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImoveis() {
      try {
        setLoading(true);

        // 3. Usamos 'as any' apenas no .from() porque a tabela é externa
        // mas tratamos o retorno como ImovelUnico[]
        const { data, error } = await supabase
          .from("imoveis_santos" as any) 
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // 4. Mapeamos os dados garantindo que batam com o tipo ImovelUnico
        // Convertendo o ID para string se necessário, para bater com seu types/index.ts
        const imoveisFormatados: ImovelUnico[] = (data || []).map((item: any) => ({
          id: String(item.id), // Garante string conforme seu type ImovelUnico
          titulo: item.titulo,
          descricao: item.descricao,
          preco: item.preco,
          condominio: item.condominio,
          iptu: item.iptu,
          bairro: item.bairro,
          cidade: item.cidade || 'Santos',
          quartos: item.quartos,
          banheiros: item.banheiros,
          vagas: item.vagas,
          area_m2: item.area_m2,
          link: item.link,
          tipo: item.tipo,
          imagem_url: item.imagem_url,
          origem: item.origem || 'Scraper',
          itens_lazer: item.itens_lazer,
          created_at: item.created_at
        }));

        setImoveis(imoveisFormatados);
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
    <div className="min-h-screen bg-background pb-10">
      <AppHeader title="Imóveis Disponíveis" subtitle="Capturados automaticamente" />
      <div className="p-6 container mx-auto">
        {imoveis.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
            <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
            <p className="text-muted-foreground">Sua tabela 'imoveis_santos' parece estar vazia ou sem permissão de leitura.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {imoveis.map((imovel) => (
              <Card key={imovel.id} className="group overflow-hidden hover:shadow-xl transition-all border-slate-200">
                <div className="relative h-56 bg-gray-100">
                  {imovel.imagem_url ? (
                    <img 
                      src={imovel.imagem_url} 
                      alt={imovel.titulo} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.style.display = 'none')} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400"><Building2 size={40} /></div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm capitalize">{imovel.origem}</Badge>
                  <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-md font-bold text-sm shadow-lg text-slate-900">
                    {imovel.preco ? `R$ ${imovel.preco.toLocaleString('pt-BR')}` : 'Sob Consulta'}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900" title={imovel.titulo}>{imovel.titulo}</h3>
                  <div className="flex items-center text-sm text-slate-500 mb-4 font-medium">
                    <MapPin className="h-4 w-4 mr-1 text-blue-500" /> {imovel.bairro || "Bairro não informado"}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg border">
                    <div className="flex flex-col items-center gap-1"><Bed size={16} className="text-slate-400"/> <span>{imovel.quartos || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Bath size={16} className="text-slate-400"/> <span>{imovel.banheiros || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Car size={16} className="text-slate-400"/> <span>{imovel.vagas || '-'}</span></div>
                    <div className="flex flex-col items-center gap-1"><Maximize2 size={16} className="text-slate-400"/> <span>{imovel.area_m2 || '-'} m²</span></div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-slate-300 hover:bg-slate-100" asChild>
                    <a href={imovel.link || '#'} target="_blank" rel="noopener noreferrer">
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