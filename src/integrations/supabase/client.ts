// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase externo do usuário (xssmysmyaxiawuqdqcrs)
const SUPABASE_URL = "https://xssmysmyaxiawuqdqcrs.supabase.co";
const SUPABASE_KEY = "sb_publishable_i3dmQFlVZTEvh6MBI0_94Q_jW9Y0rbA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
