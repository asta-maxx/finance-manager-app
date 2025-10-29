import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';
const API_TOKEN = process.env.API_TOKEN || '';

function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Vary', 'Origin');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export async function middleware(request: Request) {
  const { method } = request as any;
  const url = new URL(request.url);

  // Always handle CORS preflight
  if (method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    return setCorsHeaders(res);
  }

  // Protect API routes: allow if session present OR valid API token
  if (url.pathname.startsWith('/api') && !url.pathname.startsWith('/api/health') && !url.pathname.startsWith('/api/auth')) {
    const session = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!session) {
      const authHeader = (request.headers as any).get('authorization') || '';
      const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      if (!API_TOKEN || bearer !== API_TOKEN) {
        const unauthorized = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        return setCorsHeaders(unauthorized);
      }
    }
  }

  // Protect app pages (except auth and public)
  if (!url.pathname.startsWith('/api') && url.pathname !== '/login') {
    const session = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });
    if (!session) {
      const redirect = NextResponse.redirect(new URL('/login', url));
      return setCorsHeaders(redirect);
    }
  }

  const res = NextResponse.next();
  return setCorsHeaders(res);
}

export const config = {
  // Run on API routes and all pages except Next static assets and auth endpoints
  matcher: [
    '/api/:path*',
    // protect app pages (exclude Next internal assets and auth routes)
    '/((?!_next/|static/|favicon.ico|api/auth).*)'
  ]
};


