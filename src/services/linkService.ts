import { supabase } from '../supabaseClient';
import { ReadingType } from '../types/reading';

export interface ReferenceCode {
  id: number;
  code: string;
  type: 'normal' | 'consultancy';
  usage_limit: 'single_use' | 'unlimited';
  is_used: boolean;
  user_info: any;
  reading_result: string | null;
  reading_type: ReadingType | null;
  created_at: string;
}

export async function validateLink(token: string): Promise<{
  valid: boolean;
  codeData?: ReferenceCode;
}> {
  console.log(`[DEBUG] validateLink çağrıldı. Token: "${token}"`);

  const { data, error } = await supabase
    .from('reference_codes')
    .select('*')
    .eq('code', token)
    .single();

  if (error) {
    console.error('[DEBUG] Supabase sorgu hatası:', error);
    return { valid: false };
  }

  console.log('[DEBUG] Supabase yanıtı (data):', data);

  if (!data) {
    console.log('[DEBUG] Kod veritabanında bulunamadı.');
    return { valid: false };
  }

  if (data.usage_limit === 'single_use' && data.is_used) {
    console.log('[DEBUG] Kod tek kullanımlık ve zaten kullanılmış.');
    return { valid: false };
  }

  console.log('[DEBUG] Kod geçerli görünüyor.');
  return { valid: true, codeData: data };
}

export async function saveReading(
  code: string,
  readingResult: string,
  userInfo?: { name: string; email: string; dob: string }
): Promise<{ success: boolean; error?: string }> {
  
  const { data: codeData, error: fetchError } = await supabase
    .from('reference_codes')
    .select('usage_limit')
    .eq('code', code)
    .single();

  if (fetchError || !codeData) {
    return { success: false, error: 'Referans kodu bulunamadı.' };
  }

  const updatePayload: {
    reading_result: string;
    user_info?: any;
    is_used?: boolean;
  } = {
    reading_result: readingResult,
  };

  if (userInfo) {
    updatePayload.user_info = userInfo;
  }

  if (codeData.usage_limit === 'single_use') {
    updatePayload.is_used = true;
  }

  const { error: updateError } = await supabase
    .from('reference_codes')
    .update(updatePayload)
    .eq('code', code);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}
