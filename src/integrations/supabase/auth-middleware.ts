import { redirect } from '@tanstack/react-router'
import { supabase } from './client'

export async function requireSupabaseAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    throw redirect({ to: '/admin-login' });
  }
  return { userId: data.session.user.id };
}
