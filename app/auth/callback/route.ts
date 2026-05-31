import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

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

    await supabase.auth.exchangeCodeForSession(code);
  }

  // LOGIKA CERDAS ANTI-8080:
  // Cek apakah ini lagi jalan di laptop lu (localhost:3000)
  const isLocal = request.url.includes('localhost:3000');
  
  const targetUrl = isLocal 
    ? 'http://localhost:3000/' 
    : 'https://my-sotd-app-460699291343.asia-southeast2.run.app/';

  return NextResponse.redirect(targetUrl);
}