import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xssmysmyaxiawuqdqcrs.supabase.co';
const supabaseAnonKey = 'sb_publishable_i3dmQFlVZTEvh6MBI0_94Q_jW9Y0rbA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
