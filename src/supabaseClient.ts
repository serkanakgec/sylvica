import { createClient } from '@supabase/supabase-js';

// --- GEÇİCİ DÜZELTME: .env okuma sorununu atlatmak için anahtarları doğrudan yaz ---
const supabaseUrl = "https://elyksmubfecgxeskxgbw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVseWtzbXViZmVjZ3hlc2t4Z2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTI2NTksImV4cCI6MjA3ODM2ODY1OX0.XUWXBpTU90_sqK6S9MG1J69EBCjWFIu8s4X1ANXsaKE";

// Ortam değişkenlerini okuyan eski kod yorum satırına alındı
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
