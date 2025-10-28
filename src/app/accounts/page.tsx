'use client';
import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type Account = { id: string; name: string; currency: string; balance: string };

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');

  const loadAccounts = () => {
    fetch('/api/accounts').then(r => r.json()).then(setAccounts);
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  async function addAccount() {
    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user', name, currency })
    });
    const created = await res.json();
    setAccounts([created, ...accounts]);
    setName('');
  }

  async function deleteAccount(id: string) {
    if (!confirm('Are you sure? This will permanently delete the account.')) return;
    await fetch(`/api/accounts?id=${id}`, { method: 'DELETE' });
    loadAccounts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        <p className="text-gray-500">Manage your accounts and track balances</p>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
        <div className="flex gap-3">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Account name (e.g. Chase Checking)" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border rounded px-3 py-2 w-32" placeholder="USD" value={currency} onChange={e=>setCurrency(e.target.value)} />
          <button className="btn btn-primary" onClick={addAccount}>Add Account</button>
        </div>
      </div>
      <div className="card p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3">Account Name</th>
              <th className="py-3">Currency</th>
              <th className="py-3">Current Balance</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{a.name}</td>
                <td className="py-3">{a.currency}</td>
                <td className="py-3 font-semibold text-lg">${Number(a.balance).toFixed(2)}</td>
                <td className="py-3">
                  <button 
                    onClick={() => deleteAccount(a.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete account"
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



