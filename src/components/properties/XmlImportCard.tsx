import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, CheckCircle2, Loader2, HelpCircle, Server, AlertTriangle, FileText, Link as LinkIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// --- DICIONÁRIOS (MANTIDOS) ---
const MAPA_TIPOS: Record<string, string> = {
  "apartment": "Apartamento", "residential / apartment": "Apartamento", "flat": "Apartamento", "penthouse": "Cobertura",
  "house": "Casa", "residential / home": "Casa", "sobrado": "Casa", "land": "Terreno", "lot": "Terreno",
  "residential / land": "Terreno", "commercial": "Comercial", "office": "Sala Comercial", "store": "Loja", "warehouse": "Galpão",
  "apto": "Apartamento", "residencia": "Casa", "lote": "Terreno", "terrenos": "Terreno", "casas": "Casa", "apartamentos": "Apartamento",
  "home": "Casa", "condo": "Apartamento"
};

const MAPA_LAZER: Record<string, string> = {
  "furnished": "Mobiliado", "pool": "Piscina", "swimming pool": "Piscina", "barbecue": "Churrasqueira", "bbq": "Churrasqueira",
  "air conditioning": "Ar Condicionado", "cooling": "Ar Condicionado", "elevator": "Elevador", "gym": "Academia",
  "fitness center": "Academia", "garden": "Jardim", "balcony": "Sacada", "veranda": "Varanda", "fenced yard": "Quintal Murado",
  "kitchen": "Cozinha Planejada", "close to schools": "Próximo a Escolas", "close to shopping centers": "Próximo a Shopping",
  "gated community": "Condomínio Fechado", "security": "Segurança 24h", "garage": "Garagem", "laundry": "Lavanderia",
  "party room": "Salão de Festas", "playground": "Playground", "sauna": "Sauna", "spa": "Spa"
};

export function XmlImportCard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("link");
  const [xmlUrl, setXmlUrl] = useState("");
  const [xmlContent, setXmlContent] = useState("");
  const [originName, setOriginName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null);

  // --- FUNÇÕES AUXILIARES ---
  
  // NOVA FUNÇÃO: Formata "BOQUEIRAO" para "Boqueirão"
  const formatarTexto = (texto: string): string => {
    if (!texto) return "";
    
    // Lista de palavras que devem ficar minúsculas (preposições)
    const excecoes = ["de", "da", "do", "das", "dos", "e", "em", "na", "no", "com"];
    
    return texto
      .toLowerCase()
      .trim()
      .split(/\s+/) // Divide por qualquer espaço em branco
      .map((palavra, index) => {
        // Se for a primeira palavra ou não for exceção, capitaliza
        if (index === 0 || !excecoes.includes(palavra)) {
          return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        }
        return palavra;
      })
      .join(" ");
  };

  const traduzirTipo = (raw: string): string => {
    if (!raw) return "Outros";
    const termo = raw.toLowerCase().trim();
    for (const key in MAPA_TIPOS) {
      if (termo.includes(key)) return MAPA_TIPOS[key];
    }
    return formatarTexto(raw); // Aplica formatação aqui também se não achar no mapa
  };

  const traduzirLazer = (featuresArray: string[]): string => {
    const traduzidos = featuresArray.map(item => {
      const termo = item.toLowerCase().trim();
      for (const key in MAPA_LAZER) {
        if (termo === key || termo.includes(key)) return MAPA_LAZER[key];
      }
      return formatarTexto(item); // Formata também os que não foram traduzidos
    });
    return [...new Set(traduzidos)].join(", ");
  };

  const processXmlData = async (textData: string) => {
    if (!textData || textData.length < 50) {
        throw new Error("O conteúdo recebido está vazio ou inválido.");
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textData, "text/xml");
    
    const listings = xmlDoc.getElementsByTagName("Listing");
    const imoveis = xmlDoc.getElementsByTagName("Imovel");
    const ads = xmlDoc.getElementsByTagName("ad"); 
    const entries = xmlDoc.getElementsByTagName("entry");
    
    let imoveisEncontrados = listings.length > 0 ? listings : imoveis;
    if (imoveisEncontrados.length === 0) imoveisEncontrados = ads;
    if (imoveisEncontrados.length === 0) imoveisEncontrados = entries;

    if (imoveisEncontrados.length === 0) {
      throw new Error("Nenhum imóvel encontrado.");
    }

    const origemFinal = originName.trim() || "Importação XML";
    
    setStatus({ type: 'info', message: `Processando e Formatando ${imoveisEncontrados.length} imóveis...` });

    let countUpsert = 0;
    const referenciasNoXml: string[] = []; 

    for (let i = 0; i < imoveisEncontrados.length; i++) {
      const listing = imoveisEncontrados[i];
      
      const getTag = (...tags: string[]) => {
        for (const tag of tags) {
            const el = listing.getElementsByTagName(tag)[0];
            if (el && el.textContent) return el.textContent;
        }
        return "";
      };

      const ref = getTag(
          "ListingID", "Codigo", "CodigoImovel", "ExternalID", 
          "id", "ad_id", "home_listing_id"
      );

      if (ref) {
        referenciasNoXml.push(ref);

        // Imagens
        let primeiraImagem = "";
        const mediaItem = listing.getElementsByTagName("Item")[0];
        if (mediaItem) primeiraImagem = mediaItem.textContent || "";
        if (!primeiraImagem) {
            const fotoUrl = listing.getElementsByTagName("URLArquivo")[0];
            if (fotoUrl) primeiraImagem = fotoUrl.textContent || "";
        }
        if (!primeiraImagem) {
            const img = listing.getElementsByTagName("image")[0];
            if (img && img.getElementsByTagName("url")[0]) {
                 primeiraImagem = img.getElementsByTagName("url")[0].textContent || "";
            } else if (img) {
                 primeiraImagem = img.textContent || "";
            }
        }
        if (!primeiraImagem) {
             const pic = listing.getElementsByTagName("picture")[0];
             if (pic) {
                 const urlPic = pic.getElementsByTagName("url")[0];
                 if(urlPic) primeiraImagem = urlPic.textContent || "";
             }
        }

        // Features
        const featuresNodes = listing.getElementsByTagName("Feature");
        const featuresArray = [];
        for(let j=0; j < featuresNodes.length; j++) {
            if (featuresNodes[j].textContent) featuresArray.push(featuresNodes[j].textContent);
        }
        
        // Preço
        let precoFinal = parseFloat(getTag("ListPrice", "PrecoVenda", "Preco", "price", "amount") || "0");
        if (precoFinal === 0) {
            precoFinal = parseFloat(getTag("PrecoLocacao", "Aluguel") || "0");
        }

        // --- APLICAÇÃO DA FORMATAÇÃO DE TEXTO ---
        const bairroFormatado = formatarTexto(getTag("Neighborhood", "Bairro", "addr1"));
        const cidadeFormatada = formatarTexto(getTag("City", "Cidade", "city", "addr2"));
        // Opcional: Formatar Título também para ficar bonito
        const tituloFormatado = getTag("Title", "Titulo", "TituloAnuncio", "Header", "name"); 

        const imovelData = {
          referencia: ref,
          
          titulo: tituloFormatado, // Pode usar formatarTexto(tituloFormatado) se quiser forçar
          
          descricao: getTag("Description", "Descricao", "Observacao", "Destaque", "content", "summary"),
          
          tipo: traduzirTipo(getTag("PropertyType", "Tipo", "SubTipoImovel", "Categoria", "property_type")),
          
          preco: precoFinal,
          link: getTag("DetailViewUrl", "Url", "Link", "url"),
          vagas: parseInt(getTag("Garage", "Vagas", "Vaga") || "0"),
          area_m2: parseFloat(getTag("LivingArea", "UsefulArea", "AreaUtil", "AreaTotal", "AreaPrivativa", "area") || "0"),
          imagem_url: primeiraImagem,
          itens_lazer: traduzirLazer(featuresArray),
          origem: origemFinal,
          quartos: parseInt(getTag("Bedrooms", "Quartos", "Dormitorios", "num_beds") || "0"),
          banheiros: parseInt(getTag("Bathrooms", "Banheiros", "num_baths") || "0"),
          
          bairro: bairroFormatado, // Salva "Boqueirão" em vez de "BOQUEIRAO"
          cidade: cidadeFormatada, 
          
          condominio: parseFloat(getTag("PropertyAdministrationFee", "Condominio", "PrecoCondominio") || "0"),
          iptu: parseFloat(getTag("YearlyTax", "Iptu", "ValorIPTU") || "0"),
          
          user_id: user?.id
        };

        const { error } = await (supabase as any)
          .from('imoveis_santos')
          .upsert(imovelData, { onConflict: 'referencia' });

        if (!error) countUpsert++;
      }
    }

    // Limpeza
    let countDeleted = 0;
    const { data: imoveisExistentes } = await (supabase as any)
      .from('imoveis_santos')
      .select('referencia')
      .eq('origem', origemFinal);

    if (imoveisExistentes && imoveisExistentes.length > 0) {
      const referenciasParaDeletar = imoveisExistentes
        .map((i: any) => i.referencia)
        .filter((refDb: string) => !referenciasNoXml.includes(refDb));

      if (referenciasParaDeletar.length > 0) {
        const { error: deleteError } = await (supabase as any)
          .from('imoveis_santos')
          .delete()
          .in('referencia', referenciasParaDeletar);
        if (!deleteError) countDeleted = referenciasParaDeletar.length;
      }
    }

    setStatus({ 
      type: 'success', 
      message: `Sucesso! ${countUpsert} imóveis processados. ${countDeleted} antigos removidos.` 
    });
    toast.success(`Importação Concluída!`);
    setXmlContent("");
  };

  const handleImport = async () => {
    if (!originName.trim()) {
      toast.error("Por favor, digite o nome da Origem (ex: OLX, VivaReal).");
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Iniciando...' });

    try {
      let xmlParaProcessar = "";

      if (activeTab === "link") {
        if (!xmlUrl) throw new Error("Cole o link do XML primeiro.");
        
        setStatus({ type: 'info', message: 'Chamando Edge Function...' });
        
        const { data, error } = await supabase.functions.invoke('import-xml', {
            body: { xmlUrl: xmlUrl },
            responseType: 'text' 
        } as any);

        if (error) {
            console.error("Erro Edge Function:", error);
            if (error.message.includes("546") || error.message.includes("Time limit")) {
                throw new Error("XML muito grande. Use a aba 'Colar XML' copiando partes do arquivo.");
            }
            throw new Error(`Erro ao conectar no servidor: ${error.message}`);
        }

        if (!data) throw new Error("O servidor respondeu, mas o conteúdo veio vazio.");
        xmlParaProcessar = data;

      } else {
        if (!xmlContent) throw new Error("Cole o conteúdo do XML primeiro.");
        xmlParaProcessar = xmlContent;
      }

      await processXmlData(xmlParaProcessar);

    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: `Erro: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <Card className="lg:col-span-2 border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Server className="h-6 w-6 text-primary" />
            Importador Universal (Multi-Padrão)
          </CardTitle>
          <CardDescription>
            Sincronização com formatação automática de texto (Maiúsculas/Minúsculas).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="space-y-2">
            <Label className="text-base font-semibold">Nome da Origem (Ex: Imoview, Kenlo)</Label>
            <Input 
              placeholder="Digite o nome do sistema de origem..." 
              value={originName}
              onChange={(e) => setOriginName(e.target.value)}
              className="h-11 border-primary/30 focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground text-orange-600">
               ⚠️ Atenção: Imóveis desta origem que <strong>não</strong> estiverem no XML serão excluídos.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="link" className="flex gap-2"><LinkIcon className="h-4 w-4" /> Via Link</TabsTrigger>
              <TabsTrigger value="text" className="flex gap-2"><FileText className="h-4 w-4" /> Colar XML</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
               <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-2 flex gap-2 items-start">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>O sistema baixará o XML via servidor seguro.</p>
               </div>
               <div className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="Cole o link .xml aqui" 
                  value={xmlUrl}
                  onChange={(e) => setXmlUrl(e.target.value)}
                  className="flex-1 h-11"
                />
                <Button onClick={handleImport} disabled={loading} className="h-11 px-6 font-semibold">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {loading ? "Sincronizar" : "Sincronizar"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
               <Textarea 
                  placeholder="Cole aqui o conteúdo do XML..." 
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  className="min-h-[200px] font-mono text-xs"
               />
               <Button onClick={handleImport} disabled={loading} className="w-full h-11 font-semibold">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {loading ? "Processando..." : "Importar Manualmente"}
               </Button>
            </TabsContent>
          </Tabs>

          {status && (
            <Alert variant={status.type === 'error' ? "destructive" : "default"} className={status.type === 'success' ? "border-green-500 bg-green-50 text-green-900" : ""}>
              {status.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <AlertTitle>
                {status.type === 'error' ? "Erro" : status.type === 'success' ? "Sucesso!" : "Status"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-none shadow-none h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Recursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
             <li><strong>Poliglota:</strong> Aceita XML da OLX, VivaReal, Zap e outros.</li>
             <li><strong>Formatação:</strong> Corrige "BOQUEIRAO" para "Boqueirão" automaticamente.</li>
             <li><strong>Tradução:</strong> Converte "Apartment" para "Apartamento".</li>
             <li><strong>Limpeza:</strong> Remove imóveis que não estão mais no XML.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}