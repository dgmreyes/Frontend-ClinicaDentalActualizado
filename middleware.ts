import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Obtenemos el token de las cookies
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Si el usuario intenta entrar al dashboard Y no tiene token
  if (pathname.startsWith('/dashboard') && !token) {
    // Lo mandamos al login
    return NextResponse.redirect(new URL('/signup', request.url));
  }

  // Si intenta entrar al login PERO ya tiene token (ya inició sesión)
  if ((pathname === '/signup' || pathname === '/signin') && token) {
    // Lo mandamos directo al dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configuración: A qué rutas afecta este middleware
export const config = {
  matcher: ['/dashboard/:path*', '/signup', '/signin'],
};