'use client';
import { useEffect, useState } from 'react';
import Card from '../components/ui/Card';

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: string;
  occurredAt: string;
}

interface Account {
  id: string;
  balance: string;
}

export default function HomePage() {
  const [stats, setStats] = useState({ totalBalance: 0, income: 0, expense: 0, accounts: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/accounts').then(r => r.json()),
      fetch('/api/transactions').then(r => r.json())
    ]).then(([accounts, txs]: [Account[], Transaction[]]) => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonth = txs.filter((t: Transaction) => new Date(t.occurredAt) >= monthStart);
      const income = thisMonth.filter((t: Transaction) => t.type === 'INCOME').reduce((a, t) => a + Number(t.amount), 0);
      const expense = thisMonth.filter((t: Transaction) => t.type === 'EXPENSE').reduce((a, t) => a + Number(t.amount), 0);
      const balance = accounts.reduce((a, acc) => a + Number(acc.balance), 0);
      setStats({ totalBalance: balance, income, expense, accounts: accounts.length });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-500 mb-2">Total Balance</div>
          <div className="text-3xl font-bold">${stats.totalBalance.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-2">This Month Income</div>
          <div className="text-3xl font-bold text-green-600">${stats.income.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-2">This Month Expense</div>
          <div className="text-3xl font-bold text-red-600">${stats.expense.toFixed(2)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-2">Active Accounts</div>
          <div className="text-3xl font-bold">{stats.accounts}</div>
        </Card>
      </div>
    </div>
  );
}


