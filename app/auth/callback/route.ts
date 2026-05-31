import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  console.log('[AUTH CALLBACK] request.url:', request.url);

  const code = requestUrl.searchParams.get('code');
  console.log('[AUTH CALLBACK] code:', code ? 'ADA' : 'TIDAK ADA');

  // Derive the origin dynamically so this works on both localhost and production
  const origin = requestUrl.origin;

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

    if (error) {
      console.error('[AUTH CALLBACK] Session exchange failed:', error.message);
      // Redirect to home even on error so the user isn't stranded
      return NextResponse.redirect(`${origin}/?auth_error=true`);
    }
  }

  console.log('[AUTH CALLBACK] redirect ke origin:', origin);
  return NextResponse.redirect(`${origin}/`);
}