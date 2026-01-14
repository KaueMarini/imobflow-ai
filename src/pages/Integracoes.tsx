import { AppHeader } from "@/components/layout/AppHeader";
import { XmlImportCard } from "@/components/properties/XmlImportCard";
import { Plug, Share2, Database, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Integracoes() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <AppHeader 
        title="Central de Integrações" 
        subtitle="Conecte seu CRM e mantenha seus imóveis sincronizados automaticamente." 
      />
      
      <div className="container mx-auto p-6 space-y-8 max-w-6xl">
        
        {/* Banner Explicativo */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Plug className="h-5 w-5" /> Conexão Simples
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Basta colar o link XML do seu sistema antigo (Imoview, Kenlo, etc) e nós puxamos tudo.
                </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Database className="h-5 w-5" /> Dados Centralizados
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Seus imóveis ficam salvos aqui. Se você atualizar no CRM, atualizamos aqui também.
                </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Share2 className="h-5 w-5" /> Inteligência Artificial
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Nossa IA usa esses dados para responder seus clientes no WhatsApp com precisão.
                </CardContent>
            </Card>
        </div>

        {/* O Componente Principal de Importação */}
        <div className="mt-8">
             <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
                <ArrowRight className="h-6 w-6 text-muted-foreground" /> Importar Imóveis
             </h2>
             {/* Aqui entra o card que já programamos, focado em fazer o trabalho */}
             <XmlImportCard />
        </div>

      </div>
    </div>
  );
}