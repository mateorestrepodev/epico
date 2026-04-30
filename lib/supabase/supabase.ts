// lib/supabase/supabase.ts
import { createClient } from '@supabase/supabase-js';

// El signo de exclamación (!) al final le asegura a TypeScript que estas variables SÍ existen
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);