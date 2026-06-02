import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// WAJIB ADA DI NEXT.JS PRODUCTION AGAR ROUTE INI TIDAK DI-CACHE
export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // LOGIKA CERDAS ANTI-8080
  const isLocal = request.url.includes('localhost');
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

    // TANGKAP ERROR DARI SUPABASE ALIH-ALIH GAGAL DIAM-DIAM
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Supabase Auth Error:", error.message);
      // Lempar error-nya ke URL Beranda biar kita bisa langsung baca!
      return NextResponse.redirect(`${targetUrl}?error=${encodeURIComponent(error.message)}`);
    }
  }

  return NextResponse.redirect(targetUrl);
}