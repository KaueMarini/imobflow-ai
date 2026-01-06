import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não estiver logado, manda para login
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Lógica do Bloqueio de Plano Free
  // Se o plano for 'free' E o usuário NÃO estiver já na página de upgrade
  if (profile?.plano === 'free' && location.pathname !== '/upgrade') {
    return <Navigate to="/upgrade" replace />;
  }

  // Se o plano NÃO for free, mas ele tentar acessar /upgrade manualmente,
  // você pode decidir se deixa ou redireciona de volta pro dashboard (opcional)
  
  return <>{children}</>;
};