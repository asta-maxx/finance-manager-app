import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany();
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const body = await req.json();
  // Get or create demo user
  let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (!user) {
    user = await prisma.user.create({ data: { email: 'demo@example.com', passwordHash: 'demo' } });
  }
  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name: body.name,
      type: body.type
    }
  });
  return NextResponse.json(category, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}


