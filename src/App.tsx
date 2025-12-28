import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute"; // <--- Importe o Guarda

// Páginas
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import CRM from "./pages/CRM";
import Auth from "./pages/Auth";
import FontesConfig from "./pages/FontesConfig";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          {/* Rota Pública (Login) */}
          <Route path="/auth" element={<Auth />} />

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
            <Route path="/fontes" element={<FontesConfig />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          {/* Rota de Erro */}
          <Route path="*" element={<NotFound />} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;