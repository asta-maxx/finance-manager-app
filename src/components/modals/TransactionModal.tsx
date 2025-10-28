'use client';
import React, { useState, useEffect } from 'react';

type ModalProps = { open: boolean; onClose: () => void; onSuccess?: () => void };
type Account = { id: string; name: string };
type Category = { id: string; name: string; type: string };

export default function TransactionModal({ open, onClose, onSuccess }: ModalProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState<'INCOME'|'EXPENSE'|'TRANSFER'>('EXPENSE');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState(new Date().toISOString().slice(0, 16));
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/accounts').then(r => r.json()).then(setAccounts);
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  const handleSubmit = async () => {
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user', amount: Number(amount), currency, type, fromAccountId, toAccountId, categoryId, note, occurredAt: new Date(occurredAt).toISOString() })
    });
    onSuccess?.();
    onClose();
    setAmount('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl" onClick={e=>e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">New Transaction</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Amount</label>
              <input className="border rounded px-3 py-2 w-full" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm mb-1">Currency</label>
              <input className="border rounded px-3 py-2 w-full" value={currency} onChange={e=>setCurrency(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select className="border rounded px-3 py-2 w-full" value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>
          {type === 'EXPENSE' && (
            <div>
              <label className="block text-sm mb-1">From Account</label>
              <select className="border rounded px-3 py-2 w-full" value={fromAccountId} onChange={e=>setFromAccountId(e.target.value)}>
                <option>Select account</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
          {type === 'INCOME' && (
            <div>
              <label className="block text-sm mb-1">To Account</label>
              <select className="border rounded px-3 py-2 w-full" value={toAccountId} onChange={e=>setToAccountId(e.target.value)}>
                <option>Select account</option>
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
          {type === 'TRANSFER' && (
            <>
              <div>
                <label className="block text-sm mb-1">From Account</label>
                <select className="border rounded px-3 py-2 w-full" value={fromAccountId} onChange={e=>setFromAccountId(e.target.value)}>
                  <option>Select account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">To Account</label>
                <select className="border rounded px-3 py-2 w-full" value={toAccountId} onChange={e=>setToAccountId(e.target.value)}>
                  <option>Select account</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select className="border rounded px-3 py-2 w-full" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
              <option>Select category</option>
              {categories.filter(c => c.type === type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="datetime-local" className="border rounded px-3 py-2 w-full" value={occurredAt} onChange={e=>setOccurredAt(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Note</label>
            <textarea className="border rounded px-3 py-2 w-full" value={note} onChange={e=>setNote(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} className="btn btn-primary">Save</button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}


