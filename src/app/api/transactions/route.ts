import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const txs = await prisma.transaction.findMany({ orderBy: { occurredAt: 'desc' } });
  return NextResponse.json(txs);
}

export async function POST(req: Request) {
  const body = await req.json();
  // Get or create demo user
  let user = await prisma.user.findUnique({ where: { email: 'demo@example.com' } });
  if (!user) {
    user = await prisma.user.create({ data: { email: 'demo@example.com', passwordHash: 'demo' } });
  }
  const created = await prisma.$transaction(async (tx) => {
    const tr = await tx.transaction.create({
      data: {
        userId: user.id,
        amount: body.amount,
        currency: body.currency,
        type: body.type,
        categoryId: body.categoryId && body.categoryId !== 'Select category' ? body.categoryId : null,
        fromAccountId: body.fromAccountId && body.fromAccountId !== 'Select account' ? body.fromAccountId : null,
        toAccountId: body.toAccountId && body.toAccountId !== 'Select account' ? body.toAccountId : null,
        note: body.note || null,
        occurredAt: new Date(body.occurredAt)
      }
    });

    if (tr.type === 'EXPENSE' && tr.fromAccountId) {
      await tx.account.update({ where: { id: tr.fromAccountId }, data: { balance: { decrement: tr.amount } } });
    }
    if (tr.type === 'INCOME' && tr.toAccountId) {
      await tx.account.update({ where: { id: tr.toAccountId }, data: { balance: { increment: tr.amount } } });
    }
    if (tr.type === 'TRANSFER' && tr.fromAccountId && tr.toAccountId) {
      await tx.account.update({ where: { id: tr.fromAccountId }, data: { balance: { decrement: tr.amount } } });
      await tx.account.update({ where: { id: tr.toAccountId }, data: { balance: { increment: tr.amount } } });
    }

    return tr;
  });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 });
  
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx) return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });

  await prisma.$transaction(async (prisma) => {
    await prisma.transaction.delete({ where: { id } });
    if (tx.type === 'EXPENSE' && tx.fromAccountId) {
      await prisma.account.update({ where: { id: tx.fromAccountId }, data: { balance: { increment: tx.amount } } });
    }
    if (tx.type === 'INCOME' && tx.toAccountId) {
      await prisma.account.update({ where: { id: tx.toAccountId }, data: { balance: { decrement: tx.amount } } });
    }
    if (tx.type === 'TRANSFER' && tx.fromAccountId && tx.toAccountId) {
      await prisma.account.update({ where: { id: tx.fromAccountId }, data: { balance: { increment: tx.amount } } });
      await prisma.account.update({ where: { id: tx.toAccountId }, data: { balance: { decrement: tx.amount } } });
    }
  });
  
  return NextResponse.json({ success: true });
}


