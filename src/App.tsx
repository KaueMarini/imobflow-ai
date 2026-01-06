import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Páginas
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import CRM from "./pages/CRM";
import Auth from "./pages/Auth";
import FontesConfig from "./pages/FontesConfig";
import Configuracoes from "./pages/Configuracoes";
import RoboConfig from "./pages/RoboConfig";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota Pública (Login) */}
            <Route path="/auth" element={<Auth />} />

            {/* Rota de Upgrade (requer login; ProtectedRoute permite acesso mesmo para plano free) */}
            <Route
              path="/upgrade"
              element={
                <ProtectedRoute>
                  <Upgrade />
                </ProtectedRoute>
              }
            />

            {/* Rotas Protegidas (Só entra se estiver logado) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* O Dashboard é a Home */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/robo" element={<RoboConfig />} />
              <Route path="/fontes" element={<FontesConfig />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>

            {/* Rota de Erro */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
