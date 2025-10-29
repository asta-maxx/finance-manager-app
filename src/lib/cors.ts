import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || '*';

export function withCors(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Vary', 'Origin');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT,PATCH,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization,Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

export function optionsResponse() {
  return withCors(new NextResponse(null, { status: 204 }));
}


