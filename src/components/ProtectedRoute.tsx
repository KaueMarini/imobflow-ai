import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, clienteSaas } = useAuth();
  const location = useLocation();

  console.log("🛡️ ProtectedRoute - loading:", loading);
  console.log("🛡️ ProtectedRoute - session:", !!session);
  console.log("🛡️ ProtectedRoute - clienteSaas:", clienteSaas);
  console.log("🛡️ ProtectedRoute - plano:", clienteSaas?.plano);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se não estiver logado, manda para login
  if (!session) {
    console.log("🛡️ Sem sessão, redirecionando para /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Lógica do Bloqueio de Plano Free
  // Se o plano for 'free' E o usuário NÃO estiver já na página de upgrade
  if (clienteSaas?.plano === 'free' && location.pathname !== '/upgrade') {
    console.log("🛡️ Plano FREE detectado, redirecionando para /upgrade");
    return <Navigate to="/upgrade" replace />;
  }

  console.log("🛡️ Acesso permitido para:", location.pathname);
  return <>{children}</>;
};