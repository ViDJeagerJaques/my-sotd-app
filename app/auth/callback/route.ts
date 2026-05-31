import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log('[AUTH CALLBACK] request.url:', request.url);

  const code = requestUrl.searchParams.get('code');
  console.log('[AUTH CALLBACK] code:', code ? 'ADA' : 'TIDAK ADA');

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    console.log('[AUTH CALLBACK] exchangeCodeForSession dimulai...');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    console.log('[AUTH CALLBACK] result:', { user: data?.user?.email, error: error?.message });
  }

  console.log('[AUTH CALLBACK] redirect ke production URL');
  return NextResponse.redirect('https://my-sotd-app-460699291343.asia-southeast2.run.app');
}