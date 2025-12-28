// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Tenta ler as duas variações comuns de nome para garantir compatibilidade
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const pickSupabaseKey = () => {
  const publishable = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  // Se a publishable for JWT ("ey..."), tentamos validar se ela pertence ao mesmo projeto do SUPABASE_URL
  if (publishable && publishable.startsWith('ey') && SUPABASE_URL) {
    try {
      const host = new URL(SUPABASE_URL).hostname;
      const urlRef = host.split('.')[0];
      const payload = JSON.parse(atob(publishable.split('.')[1] ?? '')) as { ref?: string };
      if (payload?.ref && payload.ref === urlRef) return publishable;
      // mismatch -> usa a outra key como fallback
      return anon || publishable;
    } catch {
      return publishable;
    }
  }

  // Para keys no formato sb_*, não dá pra inferir projeto: prioriza publishable e cai pra anon.
  return publishable || anon;
};

const SUPABASE_KEY = pickSupabaseKey();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('⚠️ ERRO CRÍTICO: Variáveis do Supabase (URL ou KEY) não encontradas no .env');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});