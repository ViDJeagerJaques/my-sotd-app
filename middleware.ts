import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Tangkap link asli dari Google Cloud Run
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');

  // 2. Manipulasi URL: Paksa Next.js sadar dia di web live, bukan di localhost:8080!
  if (forwardedHost) {
    request.nextUrl.host = forwardedHost;
    request.nextUrl.port = ''; // Bantai angka 8080 di sini
    if (forwardedProto) {
      request.nextUrl.protocol = `${forwardedProto}:`;
    }
  }

  // 3. Loloskan request (Tanpa embel-embel Supabase)
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // Jangan block gambar dan file sistem
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};