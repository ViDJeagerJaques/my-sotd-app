import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // 🔥 FIX LOGIKA ANTI-8080: Cek host dari browser, bukan URL internal server Docker
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost:3000');
  
  const targetUrl = isLocal 
    ? 'http://localhost:3000/' 
    : 'https://my-sotd-app-460699291343.asia-southeast2.run.app/';

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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return NextResponse.redirect(`${targetUrl}?error=${encodeURIComponent(error.message)}`);
    }
  }

  return NextResponse.redirect(targetUrl);
}