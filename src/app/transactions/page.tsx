'use client';
import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type Tx = {
  id: string;
  amount: string;
  currency: string;
  type: 'INCOME'|'EXPENSE'|'TRANSFER';
  occurredAt: string;
  note?: string | null;
};

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState<'INCOME'|'EXPENSE'|'TRANSFER'>('EXPENSE');
  const [occurredAt, setOccurredAt] = useState<string>(new Date().toISOString().slice(0,16));

  const loadTxs = () => {
    fetch('/api/transactions').then(r => r.json()).then(setTxs);
  };

  useEffect(() => {
    loadTxs();
  }, []);

  async function addTx() {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'demo-user',
        amount: Number(amount),
        currency,
        type,
        occurredAt: new Date(occurredAt).toISOString()
      })
    });
    const created = await res.json();
    setTxs([created, ...txs]);
    setAmount('');
  }

  async function deleteTx(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    loadTxs();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-gray-500">View and manage all your financial transactions</p>
      </div>
      <div className="card p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3">Date & Time</th>
              <th className="py-3">Type</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Currency</th>
              <th className="py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{new Date(t.occurredAt).toLocaleString()}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${t.type === 'INCOME' ? 'bg-green-100 text-green-700' : t.type === 'EXPENSE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {t.type}
                  </span>
                </td>
                <td className="py-3 font-medium">${Number(t.amount).toFixed(2)}</td>
                <td className="py-3">{t.currency}</td>
                <td className="py-3">
                  <button 
                    onClick={() => deleteTx(t.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete transaction"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



