import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: 'demo',
      accounts: { create: [{ name: 'Cash', currency: 'USD' }, { name: 'Bank', currency: 'USD' }] },
      categories: { create: [{ name: 'Food', type: 'EXPENSE' }, { name: 'Salary', type: 'INCOME' }] }
    }
  });
  console.log('Seeded demo user:', user.email);
}

main().then(() => prisma.$disconnect());


