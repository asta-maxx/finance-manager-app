import { NextResponse } from 'next/server';
import { optionsResponse } from '../../../lib/cors';

export async function GET() {
  return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
}

export function OPTIONS() {
  return optionsResponse();
}



