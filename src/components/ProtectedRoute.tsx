import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Verifica se já tem sessão ativa ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    // 2. Ouve mudanças (ex: se o usuário clicar em Sair)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Enquanto verifica, mostra um loading bonito
  if (session === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Se não tem sessão, manda pro Login
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Se tem sessão, deixa entrar
  return <>{children}</>;
}