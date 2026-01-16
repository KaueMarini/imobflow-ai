import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; 

// Páginas
import Index from "./pages/Index"; 
import Dashboard from "./pages/Dashboard";
import Imoveis from "./pages/Imoveis";
import CRM from "./pages/CRM";
import Auth from "./pages/Auth";
import FontesConfig from "./pages/FontesConfig";
import Configuracoes from "./pages/Configuracoes";
import RoboConfig from "./pages/RoboConfig";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";
import Agenda from "./pages/Agenda";
import Integracoes from "./pages/Integracoes";
import Captacao from "./pages/Captacao"; // <--- NOVO IMPORT

const queryClient = new QueryClient();

// Componente auxiliar para redirecionar se já estiver logado
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (!loading && session) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota Raiz (Landing Page) */}
            <Route 
              path="/" 
              element={
                <PublicOnlyRoute>
                  <Index />
                </PublicOnlyRoute>
              } 
            />

            {/* Rota Pública (Login) */}
            <Route 
              path="/auth" 
              element={
                <PublicOnlyRoute>
                  <Auth />
                </PublicOnlyRoute>
              } 
            />

            {/* Rota de Upgrade */}
            <Route
              path="/upgrade"
              element={
                <ProtectedRoute>
                  <Upgrade />
                </ProtectedRoute>
              }
            />

            {/* Rotas Protegidas (Dashboard e Sistema) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} /> 
              <Route path="/agenda" element={<Agenda />} /> 
              <Route path="/imoveis" element={<Imoveis />} />
              <Route path="/captacao" element={<Captacao />} /> {/* <--- NOVA ROTA */}
              <Route path="/integracoes" element={<Integracoes />} />
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