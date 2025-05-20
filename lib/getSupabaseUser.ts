import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getSupabaseUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll().map(cookie => ({
          name: cookie.name,
          value: cookie.value
        }))
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
