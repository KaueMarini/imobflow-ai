import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// --- Interfaces (Mantidas iguais) ---
export interface ClienteSaas {
  id: string;
  created_at: string;
  user_id: string | null;
  nome_empresa: string | null;
  instance_name: string | null;
  plano: string | null;
  status_pagamento: string | null;
  mensagem_boas_vindas: string | null;
  telefone_admin: string | null;
  fontes_preferenciais: string[] | null;
  fontes_secundarias: string[] | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  clienteSaas: ClienteSaas | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshClienteSaas: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [clienteSaas, setClienteSaas] = useState<ClienteSaas | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Função de Busca (Separada e Segura) ---
  const fetchClienteSaas = async (userId: string) => {
    try {
      console.log("🔍 Buscando dados do cliente para user:", userId);
      const sb = supabase as any;
      const { data, error } = await sb
        .from("clientes_saas")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("❌ Erro Supabase ao buscar clientes_saas:", error);
        return null;
      }
      console.log("✅ Dados do cliente encontrados:", data);
      console.log("📋 Plano do usuário:", data?.plano);
      return data as ClienteSaas | null;
    } catch (error) {
      console.error("❌ Erro CRÍTICO no fetchClienteSaas:", error);
      return null;
    }
  };

  const refreshClienteSaas = async () => {
    if (user) {
      const data = await fetchClienteSaas(user.id);
      setClienteSaas(data);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setClienteSaas(null);
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Pega sessão inicial
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            const dados = await fetchClienteSaas(initialSession.user.id);
            if (mounted) setClienteSaas(dados);
          }
        }
      } catch (error) {
        console.error("Erro na inicialização da Auth:", error);
      } finally {
        // GARANTE que o loading termine, aconteça o que acontecer
        if (mounted) {
            console.log("Inicialização concluída. Loading set to false.");
            setLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Listener de eventos
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth Event:", event);
        
        if (!mounted) return;

        // Atualiza estados básicos imediatamente
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Se for login ou mudança de token, atualiza dados
        // NOTA: Removi o setLoading(true) daqui para evitar o loop visual
        if (newSession?.user) {
            // Apenas busca dados se o ID do usuário mudou ou se não temos dados ainda
            // Isso evita refetchs desnecessários
             if (!clienteSaas || clienteSaas.user_id !== newSession.user.id) {
                const dados = await fetchClienteSaas(newSession.user.id);
                if (mounted) setClienteSaas(dados);
             }
        } else if (event === 'SIGNED_OUT') {
            setClienteSaas(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        clienteSaas,
        loading,
        signOut,
        refreshClienteSaas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}