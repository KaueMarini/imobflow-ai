import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CRM() {
  // Sem dados mockados - quando tivermos tabela de leads, buscaremos do banco
  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Leads"
        subtitle="Todos os leads que entraram em contato"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Total de leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum lead ainda</h3>
            <p className="text-muted-foreground max-w-md">
              Quando seus leads entrarem em contato pelo WhatsApp, eles aparecerão aqui automaticamente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
