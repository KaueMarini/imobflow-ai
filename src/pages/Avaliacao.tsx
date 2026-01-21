import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, TrendingUp, Calculator, CheckCircle2, MapPin, Building2, AlertCircle, Sparkles, User, Home, LayoutTemplate, Wallet, DollarSign, PenTool } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LocationMapCard } from "@/components/avaliacao/LocationMapCard";
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function Avaliacao() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analisePronta, setAnalisePronta] = useState(false);
  const [mapCoords, setMapCoords] = useState<{lat: string; lon: string} | null>(null);
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

  const fetchMapCoords = async (cidade: string, bairro: string, estado: string) => {
    try {
      setLoadingMap(true);
      const query = encodeURIComponent(`${bairro}, ${cidade}, ${estado}, Brasil`);
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
      
      const geoResponse = await fetch(nominatimUrl, { headers: { 'User-Agent': 'FlyImob/1.0' } });
      const geoData = await geoResponse.json();
      
      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        setMapCoords({ lat, lon });
      } else {
        setMapCoords(null);
      }
    } catch (error) {
      console.error("Erro mapa:", error);
      setMapCoords(null);
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
    setMapCoords(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({ title: "Erro de Sessão", variant: "destructive" });
        return;
      }

      fetchMapCoords(formData.cidade, formData.bairro, formData.estado);

      const WEBHOOK_URL = "https://webhook.saveautomatik.shop/webhook/avalicao-imoveis"; 

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: session.user.id, imovel: formData })
      });

      if (!response.ok) throw new Error(`Erro: ${response.status}`);

      const rawData = await response.json();
      const data = normalizarDados(rawData);

      if (!data || (!data.valor_sugerido_min && !data.preco_metro_minimo)) {
        throw new Error("Erro nos dados retornados.");
      }

      setResultado(data);
      setAnalisePronta(true);
      toast({ title: "Sucesso!", description: "Estudo gerado." });

    } catch (error: any) {
      console.error("Erro:", error);
      toast({ title: "Erro", description: "Falha ao processar.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const baixarPDF = () => {
    window.scrollTo(0, 0);
    const element = document.getElementById('relatorio-pdf');
    const opt = {
      margin: 0,
      filename: `Estudo_${formData.cidade}_${formData.bairro}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        scrollY: 0,
        backgroundColor: '#ffffff'
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    setTimeout(() => {
        html2pdf().set(opt as any).from(element).save();
    }, 500);
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
                <Calculator className="h-5 w-5 text-primary" /> Dados do Imóvel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Label>Título (Opcional)</Label>
                <Input name="titulo" placeholder="Ex: Apto Gonzaga" value={formData.titulo} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="col-span-2 space-y-1">
                    <Label>Cidade</Label>
                    <Input name="cidade" value={formData.cidade} onChange={handleInputChange} />
                 </div>
                 <div className="space-y-1">
                    <Label>UF</Label>
                    <Input name="estado" maxLength={2} value={formData.estado} onChange={handleInputChange} className="uppercase" />
                 </div>
              </div>
              <div className="space-y-1">
                <Label>Bairro</Label>
                <Input name="bairro" value={formData.bairro} onChange={handleInputChange} />
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
                  <Label>Área (m²)</Label>
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
              
              {/* Campos Extras */}
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
                <Label>Diferenciais / Descrição</Label>
                <Textarea 
                    name="lazer" 
                    placeholder="Ex: Varanda gourmet, vista mar..." 
                    value={formData.lazer} 
                    onChange={handleInputChange} 
                    className="h-20 text-xs"
                />
              </div>

              <div className="pt-4">
                <Button className="w-full font-bold shadow-lg shadow-primary/20" onClick={gerarAnalise} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {loading ? "Calculando..." : "Gerar Avaliação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- VISUALIZAÇÃO DO RELATÓRIO --- */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex justify-end mb-4">
             {analisePronta && (
               <Button onClick={baixarPDF} className="bg-primary text-white shadow-lg hover:translate-y-1 transition-all">
                 <Download className="mr-2 h-4 w-4" /> Baixar PDF Profissional
               </Button>
             )}
          </div>

          <div className="w-full overflow-auto flex justify-center bg-slate-100/50 p-4 lg:p-8 rounded-xl border border-slate-200">
            
            <div 
                id="relatorio-pdf" 
                className="bg-white text-slate-800 shadow-2xl relative flex flex-col"
                style={{ 
                    width: '210mm', 
                    height: '297mm',
                    padding: '0', 
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}
            >
                {!analisePronta ? (
                   <div className="flex flex-col items-center justify-center h-full text-slate-300 bg-slate-50">
                      <div className="p-8 bg-white rounded-full shadow-sm mb-6">
                        <LayoutTemplate className="h-16 w-16 text-primary/20" />
                      </div>
                      <h2 className="text-xl font-bold mb-2 text-slate-400">Visualização do Relatório</h2>
                      <p className="text-center max-w-sm text-sm">Gere a avaliação para visualizar o documento final.</p>
                   </div>
                ) : (
                  <div className="h-full flex flex-col bg-white">
                      
                      {/* HEADER PRETO + MAPA REDONDO */}
                      <div className="bg-slate-900 text-white pt-10 pb-20 px-12 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                          
                          <div className="flex justify-between items-start relative z-10">
                              <div className="space-y-3 mt-4 max-w-[50%]">
                                  <p className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-2">Avaliação de Mercado</p>
                                  <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{formData.titulo || "Imóvel Residencial"}</h1>
                                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                      <MapPin className="h-4 w-4 text-primary" />
                                      {formData.bairro}, {formData.cidade}/{formData.estado}
                                  </div>
                              </div>

                              {/* MAPA CIRCULAR - AUMENTADO PARA w-64 (256px) */}
                              <div className="relative">
                                  <div className="w-64 h-64 rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-slate-200 relative z-20">
                                      <LocationMapCard 
                                          bairro={formData.bairro} 
                                          cidade={formData.cidade} 
                                          estado={formData.estado} 
                                          coords={mapCoords} 
                                      />
                                  </div>
                                  <div className="absolute -bottom-4 -right-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full z-30 shadow-lg border-2 border-white">
                                      LOCALIZAÇÃO
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* CARD DE PREÇO (Overlap) */}
                      <div className="px-12 -mt-16 relative z-30 mb-8">
                          <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 flex justify-between items-center w-[60%]">
                              <div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Valor Estimado</p>
                                  <div className="flex items-baseline gap-2">
                                      <span className="text-3xl font-black text-slate-900">{money(resultado.valor_sugerido_min)}</span>
                                      <span className="text-sm text-slate-400">a</span>
                                      <span className="text-2xl font-bold text-slate-500">{money(resultado.valor_sugerido_max)}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* CONTEÚDO PRINCIPAL (Grid Moderno) */}
                      <div className="px-12 pb-8 grid grid-cols-12 gap-10 flex-1">
                          
                          {/* ESQUERDA: DESTAQUES (Visuais) */}
                          <div className="col-span-5 space-y-6">
                              {/* 1. Cards de Specs Básicas */}
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                      <LayoutTemplate className="h-5 w-5 text-primary mx-auto mb-2 opacity-80" />
                                      <p className="text-[10px] text-slate-400 uppercase font-bold">Área Útil</p>
                                      <p className="text-lg font-bold text-slate-800">{formData.area}m²</p>
                                  </div>
                                  <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                                      <Home className="h-5 w-5 text-primary mx-auto mb-2 opacity-80" />
                                      <p className="text-[10px] text-slate-400 uppercase font-bold">Dormitórios</p>
                                      <p className="text-lg font-bold text-slate-800">{formData.quartos}</p>
                                  </div>
                              </div>

                              {/* 2. Grid Financeiro (NOVO!) */}
                              {(Number(formData.condominio) > 0 || Number(formData.iptu) > 0) && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Building2 className="h-3 w-3 text-slate-400" />
                                            <span className="text-[9px] text-slate-500 font-bold uppercase">Condomínio</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{Number(formData.condominio) > 0 ? money(Number(formData.condominio)) : '-'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Wallet className="h-3 w-3 text-slate-400" />
                                            <span className="text-[9px] text-slate-500 font-bold uppercase">IPTU</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">{Number(formData.iptu) > 0 ? money(Number(formData.iptu)) : '-'}</p>
                                    </div>
                                </div>
                              )}

                              {/* 3. Pontos Fortes (IA) */}
                              <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-100/60">
                                  <h3 className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                                      <CheckCircle2 className="h-4 w-4" /> Destaques do Imóvel
                                  </h3>
                                  <ul className="space-y-2">
                                      {resultado.pontos_fortes?.slice(0, 4).map((ponto: string, idx: number) => (
                                          <li key={idx} className="flex items-start gap-2 text-[10px] text-emerald-900 leading-snug">
                                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                              {ponto}
                                          </li>
                                      ))}
                                  </ul>
                              </div>

                              {/* 4. Descrição / Diferenciais (Digitado pelo usuário) */}
                              {formData.lazer && (
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                    <h3 className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                        <PenTool className="h-3 w-3" /> Detalhes & Lazer
                                    </h3>
                                    <p className="text-[10px] text-slate-600 italic leading-relaxed line-clamp-4">
                                        "{formData.lazer}"
                                    </p>
                                </div>
                              )}
                          </div>

                          {/* DIREITA: ANÁLISE + PERFIL */}
                          <div className="col-span-7 flex flex-col gap-6 pt-4">
                              {/* Análise IA */}
                              <div>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                    <TrendingUp className="h-5 w-5 text-primary" /> Análise de Mercado
                                </h3>
                                <div className="text-xs text-slate-600 leading-relaxed text-justify space-y-3">
                                    {resultado.analise_texto && resultado.analise_texto.split('\n').map((p: string, i: number) => {
                                        if (i > 3) return null; 
                                        return p && <p key={i}>{p}</p>
                                    })}
                                </div>
                              </div>

                              {/* Perfil Comprador */}
                              <div className="bg-blue-50/60 rounded-xl p-6 border border-blue-100/60 mt-auto">
                                  <h3 className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">
                                      <User className="h-4 w-4" /> Perfil Comprador
                                  </h3>
                                  <p className="text-xs text-blue-900 italic leading-relaxed">
                                      "{resultado.perfil_comprador}"
                                  </p>
                              </div>
                          </div>
                      </div>

                      {/* FOOTER */}
                      <div className="bg-slate-50 px-12 py-6 border-t border-slate-200 mt-auto">
                          <div className="flex justify-between items-center opacity-60">
                              <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-slate-400" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">FlyImob Intelligence</span>
                              </div>
                              <p className="text-[8px] text-slate-400">
                                  Documento gerado em {new Date().toLocaleDateString()} • Baseado em IA.
                              </p>
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