import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, TrendingUp, Calculator, CheckCircle2, MapPin, Building2, AlertCircle, Sparkles, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function Avaliacao() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analisePronta, setAnalisePronta] = useState(false);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);

  // Formulário
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "Apartamento",
    cidade: "",
    estado: "",
    bairro: "",
    quartos: 2,
    vagas: 1,
    area: 70,
    condominio: 0,
    iptu: 0,
    lazer: "",
    acabamento: "Padrão"
  });

  const [resultado, setResultado] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const normalizarDados = (dado: any): any => {
    if (!dado) return null;
    if (typeof dado === 'string') {
      try { return normalizarDados(JSON.parse(dado)); } catch (e) { return null; }
    }
    if (Array.isArray(dado)) {
      if (dado.length === 0) return null;
      return normalizarDados(dado[0]);
    }
    if (typeof dado === 'object') {
      if (dado.valor_sugerido_min || dado.preco_metro_minimo) return dado;
      if (dado.json) return normalizarDados(dado.json);
      if (dado.body) return normalizarDados(dado.body);
    }
    return dado;
  };

  // Função para buscar coordenadas e gerar URL do mapa
  const fetchMapUrl = async (cidade: string, bairro: string, estado: string) => {
    try {
      setLoadingMap(true);
      // Geocodificar usando Nominatim (OpenStreetMap)
      const query = encodeURIComponent(`${bairro}, ${cidade}, ${estado}, Brasil`);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
      
      const geoResponse = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'FlyImob/1.0 (contact@flyimob.com.br)'
        }
      });
      
      const geoData = await geoResponse.json();
      
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        // Gerar URL do mapa estático usando OpenStreetMap Static Maps
        // Usando api.mapbox.com/styles/v1/mapbox/streets-v12/static alternativo gratuito
        // Ou usar o serviço staticmap.openstreetmap.de
        const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=400x200&markers=${lat},${lon},red-pushpin`;
        setMapUrl(staticMapUrl);
      } else {
        console.warn("Não foi possível geocodificar o endereço");
        setMapUrl(null);
      }
    } catch (error) {
      console.error("Erro ao buscar mapa:", error);
      setMapUrl(null);
    } finally {
      setLoadingMap(false);
    }
  };

  const gerarAnalise = async () => {
    if (!formData.cidade || !formData.bairro || formData.area <= 0) {
      toast({ title: "Dados incompletos", description: "Cidade, Bairro e Área são obrigatórios.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setMapUrl(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({ title: "Erro de Sessão", description: "Faça login novamente.", variant: "destructive" });
        return;
      }

      // Buscar mapa em paralelo
      fetchMapUrl(formData.cidade, formData.bairro, formData.estado);

      // ⚠️ URL DO WEBHOOK
      const WEBHOOK_URL = "https://webhook.saveautomatik.shop/webhook/avalicao-imoveis"; 

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          imovel: formData
        })
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Limite diário atingido");
        throw new Error(`Erro do servidor: ${response.status}`);
      }

      const rawData = await response.json();
      const data = normalizarDados(rawData);

      if (!data || (!data.valor_sugerido_min && !data.preco_metro_minimo)) {
        throw new Error("O sistema não retornou os valores corretamente.");
      }

      setResultado(data);
      setAnalisePronta(true);
      toast({ title: "Sucesso!", description: "Estudo de mercado gerado." });

    } catch (error: any) {
      console.error("Erro:", error);
      if (error.message.includes("Limite")) {
         toast({ 
            title: "Limite Diário Atingido", 
            description: "Você atingiu o limite de 5 estudos gratuitos hoje.", 
            variant: "destructive",
            duration: 5000
         });
      } else {
         toast({ title: "Erro", description: error.message || "Falha ao processar.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const baixarPDF = () => {
    const element = document.getElementById('relatorio-pdf');
    const opt = {
      margin: 0,
      filename: `Estudo_${formData.cidade}_${formData.bairro}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt as any).from(element).save();
  };

  const money = (val: number) => val?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  return (
    <div className="space-y-6 pb-10 h-full flex flex-col">
      <AppHeader title="FlyImob Intelligence" subtitle="Geração de estudos de mercado baseados em dados." />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-auto p-4">
        
        {/* --- FORMULÁRIO --- */}
        <div className="lg:col-span-4 space-y-4">
           <Card className="h-fit shadow-md border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" /> Novo Estudo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Label>Título do Relatório</Label>
                <Input name="titulo" placeholder="Ex: Apto Gonzaga Vista Mar" value={formData.titulo} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                 <div className="col-span-2 space-y-1">
                    <Label>Cidade *</Label>
                    <Input name="cidade" placeholder="Ex: Santos" value={formData.cidade} onChange={handleInputChange} />
                 </div>
                 <div className="space-y-1">
                    <Label>UF</Label>
                    <Input name="estado" placeholder="SP" maxLength={2} value={formData.estado} onChange={handleInputChange} className="uppercase" />
                 </div>
              </div>

              <div className="space-y-1">
                <Label>Bairro *</Label>
                <Input name="bairro" placeholder="Ex: Gonzaga" value={formData.bairro} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(val) => setFormData(prev => ({...prev, tipo: val}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Cobertura">Cobertura</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Área (m²) *</Label>
                  <Input type="number" name="area" value={formData.area} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label>Quartos</Label>
                  <Input type="number" name="quartos" value={formData.quartos} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                  <Label>Vagas</Label>
                  <Input type="number" name="vagas" value={formData.vagas} onChange={handleInputChange} />
                </div>
              </div>

               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Condomínio (R$)</Label>
                    <Input type="number" name="condominio" value={formData.condominio} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label>IPTU (R$)</Label>
                    <Input type="number" name="iptu" value={formData.iptu} onChange={handleInputChange} />
                  </div>
               </div>

              <div className="space-y-1">
                <Label>Diferenciais</Label>
                <Textarea 
                    name="lazer" 
                    placeholder="Ex: Varanda gourmet, vista livre..." 
                    value={formData.lazer} 
                    onChange={handleInputChange} 
                    className="h-20"
                />
              </div>

              <div className="pt-2">
                <Button className="w-full font-bold" onClick={gerarAnalise} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {loading ? "Processando..." : "Gerar Estudo de Mercado"}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                   <AlertCircle className="h-3 w-3" /> Limite diário: 5 estudos gratuitos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RELATÓRIO PDF (DIREITA) --- */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex justify-end mb-4">
             {analisePronta && (
               <Button variant="outline" onClick={baixarPDF} className="bg-white border-primary text-primary hover:bg-slate-50">
                 <Download className="mr-2 h-4 w-4" /> Baixar PDF
               </Button>
             )}
          </div>

          {/* ÁREA A4 DO PDF */}
          <div className="w-full overflow-auto flex justify-center bg-slate-200 p-8 rounded-xl">
            
            <div 
                id="relatorio-pdf" 
                className="bg-white text-slate-800 shadow-2xl relative flex flex-col"
                style={{ 
                    width: '210mm', 
                    height: '297mm', // Altura fixa para cortar excessos
                    padding: '15mm', 
                    boxSizing: 'border-box',
                    overflow: 'hidden' // Garante que nada vaze
                }}
            >
                {!analisePronta ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-300">
                      <Building2 className="h-32 w-32 mb-4 opacity-10" />
                      <h2 className="text-xl font-bold mb-2">FlyImob Intelligence</h2>
                      <p className="text-center max-w-sm text-sm">Preencha os dados para gerar um estudo de precificação inteligente.</p>
                   </div>
                ) : (
                  <div className="h-full flex flex-col">
                     {/* 1. HEADER - Marca FlyImob */}
                     <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Estudo de Mercado</h1>
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">FlyImob Intelligence</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold inline-block mb-1 uppercase">
                                Smart Data
                            </div>
                            <p className="text-[10px] text-slate-400">{new Date().toLocaleDateString()}</p>
                        </div>
                     </div>

                     {/* 2. CONTEXTO DO IMÓVEL */}
                     <div className="flex justify-between items-end mb-6">
                         <div>
                             <h2 className="text-lg font-bold text-slate-800">{formData.tipo}</h2>
                             <div className="flex items-center gap-1 text-slate-500 text-xs">
                                 <MapPin className="h-3 w-3 text-primary" />
                                 <span className="uppercase font-semibold">{formData.bairro} - {formData.cidade}/{formData.estado}</span>
                             </div>
                         </div>
                         <div className="flex gap-2 text-center">
                             <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1">
                                 <span className="block text-[9px] text-slate-400 uppercase font-bold">Área</span>
                                 <span className="font-bold text-sm text-slate-800">{formData.area}m²</span>
                             </div>
                             <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1">
                                 <span className="block text-[9px] text-slate-400 uppercase font-bold">Quartos</span>
                                 <span className="font-bold text-sm text-slate-800">{formData.quartos}</span>
                             </div>
                         </div>
                     </div>

                     {/* 3. HERO DE PREÇO (Compacto e Horizontal) */}
                     <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm flex flex-col justify-center items-center text-center mb-6">
                        <p className="text-slate-400 text-[9px] uppercase tracking-[0.2em] font-bold mb-1">ESTIMATIVA DE VALOR DE VENDA</p>
                        <div className="flex items-baseline gap-2 mb-2">
                            <h2 className="text-2xl font-bold text-green-400">{money(resultado.valor_sugerido_min)}</h2>
                            <span className="text-xs font-light text-slate-500">a</span>
                            <h2 className="text-2xl font-bold text-green-400">{money(resultado.valor_sugerido_max)}</h2>
                        </div>
                        <div className="w-full border-t border-slate-700/50 my-2"></div>
                        <div className="flex gap-8 text-[10px] text-slate-400">
                            <p>Mínimo m²: <span className="text-white font-medium">{money(resultado.preco_metro_minimo)}</span></p>
                            <p>Máximo m²: <span className="text-white font-medium">{money(resultado.preco_metro_maximo)}</span></p>
                        </div>
                     </div>

                     {/* 4. ANÁLISE E PONTOS FORTES (Grid Balanceado) */}
                     <div className="grid grid-cols-2 gap-6 flex-1">
                         
                         {/* Coluna Esquerda: Texto */}
                         <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2 mb-2 border-b border-slate-100 pb-1 uppercase">
                                    <TrendingUp className="h-3 w-3 text-blue-600" /> Análise de Liquidez
                                </h3>
                                {/* Limitando linhas caso a IA exagere */}
                                <div className="text-[10px] leading-relaxed text-slate-600 text-justify space-y-2 line-clamp-[12]">
                                    {resultado.analise_texto && resultado.analise_texto.split('\n').map((paragrafo: string, idx: number) => (
                                        paragrafo && <p key={idx}>{paragrafo}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-50/50 p-3 rounded border border-blue-100">
                                <h3 className="font-bold text-[10px] text-blue-800 uppercase mb-1">Perfil do Comprador</h3>
                                <p className="text-[10px] text-blue-900 italic leading-snug">"{resultado.perfil_comprador}"</p>
                            </div>
                         </div>

                         {/* Coluna Direita: Destaques, Mapa e Specs Extras */}
                         <div className="space-y-4">
                             <div className="bg-green-50 p-4 rounded border border-green-100">
                                <h3 className="font-bold text-[10px] text-green-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="h-3 w-3" /> Destaques do Imóvel
                                </h3>
                                <ul className="space-y-2">
                                    {resultado.pontos_fortes && resultado.pontos_fortes.slice(0, 5).map((ponto: string, idx: number) => (
                                        <li key={idx} className="text-[10px] text-green-800 flex items-start gap-2 leading-snug">
                                            <span className="mt-0.5 block h-1 w-1 rounded-full bg-green-600 shrink-0"></span>
                                            {ponto}
                                        </li>
                                    ))}
                                </ul>
                             </div>

                             {/* Mapa da Região */}
                             <div className="bg-slate-50 border border-slate-200 rounded overflow-hidden">
                                <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200">
                                    <h3 className="font-bold text-[10px] text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                        <Map className="h-3 w-3 text-primary" /> Localização
                                    </h3>
                                </div>
                                <div className="h-[100px] relative">
                                    {loadingMap ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                                        </div>
                                    ) : mapUrl ? (
                                        <img 
                                            src={mapUrl} 
                                            alt={`Mapa de ${formData.bairro}, ${formData.cidade}`}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                                            <div className="text-center">
                                                <MapPin className="h-5 w-5 mx-auto mb-1 opacity-50" />
                                                <p className="text-[9px]">Mapa indisponível</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                             </div>

                             {/* Specs Extras */}
                             <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 border border-slate-100 p-2 rounded text-center">
                                    <span className="block text-[9px] text-slate-400 uppercase">Vagas</span>
                                    <span className="font-bold text-slate-700 text-xs">{formData.vagas}</span>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 p-2 rounded text-center">
                                    <span className="block text-[9px] text-slate-400 uppercase">Condomínio</span>
                                    <span className="font-bold text-slate-700 text-xs">{formData.condominio > 0 ? money(Number(formData.condominio)) : '-'}</span>
                                </div>
                             </div>
                         </div>
                     </div>

                     {/* 5. FOOTER (Compacto e Jurídico) */}
                     <div className="mt-auto pt-4 border-t border-slate-200">
                        <div className="flex gap-2 items-start opacity-70">
                            <AlertCircle className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-[8px] text-slate-500 text-justify leading-tight">
                                <strong>AVISO LEGAL:</strong> Documento gerado automaticamente por <strong>FlyImob Intelligence</strong> utilizando base estatística. 
                                NÃO substitui laudo técnico (PTAM). Valores estimados sujeitos a variações de mercado, estado de conservação e negociação.
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[8px] text-slate-300 uppercase font-bold tracking-widest">
                            <p>FlyImob.com.br</p>
                            <p>Data Science</p>
                        </div>
                     </div>

                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}