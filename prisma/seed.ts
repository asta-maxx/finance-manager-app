import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('demo', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash,
      accounts: { create: [{ name: 'Cash', currency: 'USD' }, { name: 'Bank', currency: 'USD' }] },
      categories: { create: [{ name: 'Food', type: 'EXPENSE' }, { name: 'Salary', type: 'INCOME' }] }
    }
  });
  console.log('Seeded demo user:', user.email);
}

main().then(() => prisma.$disconnect());


