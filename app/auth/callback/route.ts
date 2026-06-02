import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Matikan cache agresif Next.js di production
export const dynamic = 'force-dynamic'; 

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // 2. Logika Anti-Docker (Baca dari header, bukan dari internal server)
  const host = request.headers.get('host') || '';
  const isLocal = host.includes('localhost:3000');
  
  const targetUrl = isLocal 
    ? 'http://localhost:3000/' 
    : 'https://my-sotd-app-460699291343.asia-southeast2.run.app/';

  if (code) {
    const cookieStore = await cookies();

    // 3. Pake sintaks asli bawaan lu yang terbukti sukses di-compile
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("Supabase Auth Error:", error.message);
      // Tangkap error-nya dan lempar ke URL biar kebaca
      return NextResponse.redirect(`${targetUrl}?error=${encodeURIComponent(error.message)}`);
    }
  }

  return NextResponse.redirect(targetUrl);
}