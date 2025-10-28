import React from 'react';
import Button from '../ui/Button';

export default function Topbar({ onNewTransaction }: { onNewTransaction: () => void }) {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-xl font-semibold">Finance Manager</h1>
        <p className="text-gray-500">Track, plan, and optimize your spending</p>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onNewTransaction}>+ New Transaction</Button>
        <div className="w-9 h-9 rounded-full bg-brand-orange/90" />
      </div>
    </header>
  );
}



