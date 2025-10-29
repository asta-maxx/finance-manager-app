import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { optionsResponse } from '../../../lib/cors';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const accounts = await prisma.account.findMany({ where: userId ? { userId } : undefined });
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const account = await prisma.account.create({
    data: {
      userId,
      name: body.name,
      currency: body.currency,
      balance: body.balance ?? 0
    }
  });
  return NextResponse.json(account, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  
  await prisma.account.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export function OPTIONS() {
  return optionsResponse();
}


