import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Importando Label
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

export function XmlImportCard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("link");
  
  // Novos estados
  const [xmlUrl, setXmlUrl] = useState("");
  const [xmlContent, setXmlContent] = useState("");
  const [originName, setOriginName] = useState(""); // Estado para o nome da origem
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null);

  const processXmlData = async (textData: string) => {
    // Validação básica
    if (!textData || (!textData.includes("<Listing") && !textData.includes("<Imovel") && !textData.includes("DataFeed"))) {
        console.error("Conteúdo inválido recebido:", textData.substring(0, 100));
        throw new Error("O conteúdo recebido não parece ser um XML válido. Se baixou via link, o servidor pode ter bloqueado.");
    }
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textData, "text/xml");
    
    const listings = xmlDoc.getElementsByTagName("Listing");
    const imoveisEncontrados = listings.length > 0 ? listings : xmlDoc.getElementsByTagName("Imovel");

    if (imoveisEncontrados.length === 0) {
      throw new Error("XML lido, mas nenhum imóvel encontrado dentro das tags <Listing> ou <Imovel>.");
    }

    // Define a origem final (Se estiver vazio, usa um padrão)
    const origemFinal = originName.trim() || "Importação XML";

    setStatus({ type: 'info', message: `Processando ${imoveisEncontrados.length} imóveis como "${origemFinal}"...` });
    let count = 0;

    for (let i = 0; i < imoveisEncontrados.length; i++) {
      const listing = imoveisEncontrados[i];
      const getTag = (tag: string) => listing.getElementsByTagName(tag)[0]?.textContent || "";

      // Tratamento de Lazer
      const featuresNodes = listing.getElementsByTagName("Feature");
      const featuresArray = [];
      for(let j=0; j < featuresNodes.length; j++) {
          if (featuresNodes[j].textContent) featuresArray.push(featuresNodes[j].textContent);
      }
      const itensLazerStr = featuresArray.join(", ");

      // Tratamento de Imagem
      const mediaNodes = listing.getElementsByTagName("Item");
      let primeiraImagem = "";
      if (mediaNodes.length > 0) {
          primeiraImagem = mediaNodes[0].textContent || "";
      }

      // --- MAPEAMENTO DE DADOS ---
      const imovelData = {
        referencia: getTag("ListingID") || getTag("Codigo"),
        titulo: getTag("Title") || getTag("Titulo") || "Imóvel sem título",
        descricao: getTag("Description") || getTag("Descricao"),
        tipo: getTag("PropertyType") || getTag("Tipo"),
        preco: parseFloat(getTag("ListPrice") || getTag("PrecoVenda") || "0"),
        
        link: getTag("DetailViewUrl") || getTag("Url") || "",

        vagas: parseInt(getTag("Garage") || getTag("Vagas") || "0"),
        area_m2: parseFloat(getTag("LivingArea") || getTag("UsefulArea") || getTag("AreaUtil") || getTag("LotArea") || "0"),
        imagem_url: primeiraImagem,
        itens_lazer: itensLazerStr,
        
        // AQUI ESTÁ A MUDANÇA: Usamos o nome digitado no input
        origem: origemFinal, 
        
        quartos: parseInt(getTag("Bedrooms") || getTag("Quartos") || "0"),
        banheiros: parseInt(getTag("Bathrooms") || getTag("Banheiros") || "0"),
        bairro: getTag("Neighborhood") || getTag("Bairro") || "",
        cidade: getTag("City") || getTag("Cidade") || "", 
        
        condominio: parseFloat(getTag("PropertyAdministrationFee") || getTag("Condominio") || "0"),
        iptu: parseFloat(getTag("YearlyTax") || getTag("Iptu") || "0"),

        user_id: user?.id
      };

      if (imovelData.referencia) {
          const { error } = await (supabase as any)
          .from('imoveis_santos')
          .upsert(imovelData, { onConflict: 'referencia' });

          if (!error) count++;
          else console.error("Erro ao salvar imóvel:", error.message);
      }
    }

    setStatus({ type: 'success', message: `Sucesso! ${count} imóveis importados da origem "${origemFinal}".` });
    toast.success("Importação concluída!");
    // Não limpamos o xmlUrl propositalmente para facilitar re-importação se precisar
    setXmlContent("");
  };

  const handleImport = async () => {
    if (!originName.trim()) {
      toast.error("Por favor, digite o nome da Imobiliária ou Corretor (Origem).");
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
            Importação de Imóveis
          </CardTitle>
          <CardDescription>
            Sincronize seu portfólio via Link (Edge Function) ou Manualmente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* INPUT DA ORIGEM (NOVO) */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Nome da Imobiliária ou Corretor (Origem)</Label>
            <Input 
              placeholder="Ex: Imobiliária Silva, Corretor João, Parceiro X..." 
              value={originName}
              onChange={(e) => setOriginName(e.target.value)}
              className="h-11 border-primary/30 focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">Este nome aparecerá na coluna "Origem" da lista de imóveis.</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="link" className="flex gap-2"><LinkIcon className="h-4 w-4" /> Via Link (Automático)</TabsTrigger>
              <TabsTrigger value="text" className="flex gap-2"><FileText className="h-4 w-4" /> Colar XML (Manual)</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
               <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-2 flex gap-2 items-start">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>O sistema usará nosso servidor seguro para baixar o XML.</p>
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
                  {loading ? "Baixando..." : "Importar Link"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
               <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm mb-2 flex gap-2 items-start">
                  <Info className="h-4 w-4 mt-0.5" />
                  <p>Opção infalível: Copie o conteúdo do XML (Ctrl+A, Ctrl+C) e cole abaixo.</p>
               </div>
               <Textarea 
                  placeholder="Cole aqui o conteúdo do XML..." 
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  className="min-h-[200px] font-mono text-xs"
               />
               <Button onClick={handleImport} disabled={loading} className="w-full h-11 font-semibold">
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {loading ? "Processando..." : "Importar Conteúdo Colado"}
               </Button>
            </TabsContent>
          </Tabs>

          {status && (
            <Alert variant={status.type === 'error' ? "destructive" : "default"} className={status.type === 'success' ? "border-green-500 bg-green-50 text-green-900" : ""}>
              {status.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              <AlertTitle>
                {status.type === 'error' ? "Erro" : status.type === 'success' ? "Pronto!" : "Status"}
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
            Ajuda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="origem">
              <AccordionTrigger className="text-sm">O que é a Origem?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground">
                É o nome que identifica de onde vieram esses imóveis. Útil se você importa de múltiplos parceiros.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="link-bloqueado">
              <AccordionTrigger className="text-sm">Erro com o Link?</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground">
                Se o link automático falhar, use a aba "Colar XML (Manual)" para garantir a importação.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}