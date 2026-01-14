import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Loader2, HelpCircle, Server } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function XmlImportCard() {
  const [xmlUrl, setXmlUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleImport = async () => {
    if (!xmlUrl) {
      toast.error("Por favor, cole o link do XML.");
      return;
    }

    setLoading(true);
    setStatus({ type: 'info', message: 'Iniciando leitura do XML...' });

    try {
      // 1. Tenta buscar o XML (Nota: Pode dar erro de CORS se feito direto no front. 
      // O ideal é usar uma Edge Function ou n8n como proxy, mas vamos tentar direto primeiro)
      const response = await fetch(xmlUrl);
      
      if (!response.ok) throw new Error("Não foi possível acessar o link XML.");
      
      const textData = await response.text();
      
      // 2. Parse do XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textData, "text/xml");
      const listings = xmlDoc.getElementsByTagName("Listing"); // Padrão VivaReal

      if (listings.length === 0) {
        throw new Error("Nenhum imóvel encontrado ou formato de XML desconhecido (Esperado: Padrão VivaReal).");
      }

      setStatus({ type: 'info', message: `Encontrados ${listings.length} imóveis. Iniciando importação...` });

      let importedCount = 0;

      // 3. Loop e Mapeamento para imoveis_santos
      for (let i = 0; i < listings.length; i++) {
        const listing = listings[i];
        
        // Helper para pegar valor de tag com segurança
        const getTag = (tag: string) => listing.getElementsByTagName(tag)[0]?.textContent || "";

        const imovelData = {
          referencia: getTag("ListingID"),
          titulo: getTag("Title"),
          descricao: getTag("Description"),
          tipo: getTag("PropertyType"),
          transacao: getTag("TransactionType"), // Venda/Aluguel
          valor: parseFloat(listing.getElementsByTagName("ListPrice")[0]?.textContent || "0"),
          area_util: parseFloat(listing.getElementsByTagName("LivingArea")[0]?.textContent || "0"),
          quartos: parseInt(listing.getElementsByTagName("Bedrooms")[0]?.textContent || "0"),
          banheiros: parseInt(listing.getElementsByTagName("Bathrooms")[0]?.textContent || "0"),
          vagas: parseInt(listing.getElementsByTagName("Garage")[0]?.textContent || "0"),
          bairro: listing.getElementsByTagName("Neighborhood")[0]?.textContent || "",
          cidade: listing.getElementsByTagName("City")[0]?.textContent || "Santos",
          // Adicione outros campos conforme sua tabela imoveis_santos
          user_id: (await supabase.auth.getUser()).data.user?.id
        };

        // 4. Salvar no Supabase
        const { error } = await supabase
          .from('imoveis_santos')
          .upsert(imovelData, { onConflict: 'referencia' }); // Atualiza se a referência já existir

        if (!error) importedCount++;
      }

      setStatus({ type: 'success', message: `Sucesso! ${importedCount} imóveis foram importados/atualizados.` });
      toast.success("Importação concluída com sucesso!");
      setXmlUrl("");

    } catch (error: any) {
      console.error(error);
      // Se for erro de CORS (comum), avisar o usuário
      if (error.message.includes("Failed to fetch") || error.name === 'TypeError') {
        setStatus({ 
          type: 'error', 
          message: 'Bloqueio de segurança (CORS) do CRM. Dica: Use nosso proxy ou contate o suporte.' 
        });
      } else {
        setStatus({ type: 'error', message: `Erro: ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Coluna da Esquerda: Importador */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            Importação Automática via XML
          </CardTitle>
          <CardDescription>
            Sincronize seu portfólio de imóveis automaticamente colando o link de integração do seu CRM.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Cole aqui o link (Ex: https://crm.com/feed/vivareal.xml)" 
              value={xmlUrl}
              onChange={(e) => setXmlUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleImport} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              {loading ? "Processando..." : "Importar Agora"}
            </Button>
          </div>

          {status && (
            <Alert variant={status.type === 'error' ? "destructive" : "default"} className={status.type === 'success' ? "border-green-500 bg-green-50 text-green-900" : ""}>
              <AlertTitle>{status.type === 'error' ? "Erro na Importação" : status.type === 'success' ? "Concluído" : "Processando"}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border border-border">
            <p className="font-semibold mb-1 flex items-center gap-2">
              <Info className="h-4 w-4" /> Importante:
            </p>
            O sistema aceita o padrão <strong>VivaReal/Zap Imóveis</strong>, que é o formato universal usado por 99% dos CRMs brasileiros.
          </div>
        </CardContent>
      </Card>

      {/* Coluna da Direita: O Guia Educativo (A Explicação que você pediu) */}
      <Card className="bg-secondary/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Onde encontro meu link XML?
          </CardTitle>
          <CardDescription>
            Selecione seu sistema abaixo para ver o passo a passo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="imoview">
              <AccordionTrigger>Imoview</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>1. No menu lateral, vá em <strong>Integrações</strong> {'>'} <strong>Portais</strong>.</p>
                <p>2. Clique em <strong>Adicionar Portal</strong>.</p>
                <p>3. Selecione a opção <strong>"XML Personalizado"</strong> ou procure por "VivaReal".</p>
                <p>4. Copie o link gerado (termina geralmente em <code>.xml</code>).</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="kenlo">
              <AccordionTrigger>Kenlo (InGaia)</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Acesse <strong>Menu</strong> {'>'} <strong>Integração</strong> {'>'} <strong>Mídia/Portais</strong>.</p>
                <p>2. Ative a publicação para "VivaReal" ou "Zap".</p>
                <p>3. O link aparecerá na seção de <strong>Links de Integração</strong>.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="jetimob">
              <AccordionTrigger>Jetimob</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>1. Vá em <strong>Configurações</strong> {'>'} <strong>Portais</strong>.</p>
                <p>2. Procure pelo XML padrão VivaReal.</p>
                <p>3. Clique em copiar link.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="outros">
              <AccordionTrigger>Outro Sistema (Genérico)</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>A maioria dos sistemas tem um menu chamado <strong>"Portais"</strong> ou <strong>"Integrações"</strong>.</p>
                <p>Se não encontrar, envie esta mensagem para o suporte do seu CRM:</p>
                <div className="bg-background border p-2 rounded mt-2 text-xs italic">
                  "Olá, preciso do meu <strong>Link XML de Integração padrão VivaReal</strong> para conectar com meu site novo."
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}