import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const accounts = await prisma.account.findMany();
  return NextResponse.json(accounts);
}

export async function POST(req: Request) {
  const body = await req.json();
  // Get or create demo user
  let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (!user) {
    user = await prisma.user.create({ data: { email: 'demo@example.com', passwordHash: 'demo' } });
  }
  const account = await prisma.account.create({
    data: {
      userId: user.id,
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


