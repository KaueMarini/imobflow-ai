import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type ClienteSaas = Tables<"cliente_saas">;

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

  const fetchClienteSaas = async (userId: string) => {
    const { data, error } = await supabase
      .from("cliente_saas")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar cliente_saas:", error);
      return null;
    }
    return data;
  };

  const refreshClienteSaas = async () => {
    if (user) {
      const data = await fetchClienteSaas(user.id);
      setClienteSaas(data);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setClienteSaas(null);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer Supabase calls with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchClienteSaas(session.user.id).then(setClienteSaas);
          }, 0);
        } else {
          setClienteSaas(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchClienteSaas(session.user.id).then((data) => {
          setClienteSaas(data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
