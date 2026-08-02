import { supabase } from './supabaseClient';

export async function fetchLanguages(userId) {
  const { data, error } = await supabase
    .from('immersio_languages')
    .select('*')
    .eq('user_id', userId)
    .order('position');
  if (error) throw error;
  return data;
}

export async function fetchLogs(userId) {
  const { data, error } = await supabase
    .from('immersio_logs')
    .select('*')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertLanguage({ userId, name, color, position }) {
  const { data, error } = await supabase
    .from('immersio_languages')
    .insert({ user_id: userId, name, color, position })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLanguage(id, fields) {
  const { error } = await supabase.from('immersio_languages').update(fields).eq('id', id);
  if (error) throw error;
}

export async function deleteLanguage(id) {
  const { error } = await supabase.from('immersio_languages').delete().eq('id', id);
  if (error) throw error;
}

export async function insertLog({ userId, languageId, activity, minutes, logDate, note }) {
  const { data, error } = await supabase
    .from('immersio_logs')
    .insert({
      user_id: userId,
      language_id: languageId,
      activity,
      minutes,
      log_date: logDate,
      note: note || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteLog(id) {
  const { error } = await supabase.from('immersio_logs').delete().eq('id', id);
  if (error) throw error;
}
