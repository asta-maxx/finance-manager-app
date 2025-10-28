'use client';
import { useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

type Category = { id: string; name: string; type: 'INCOME'|'EXPENSE'|'TRANSFER' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'INCOME'|'EXPENSE'|'TRANSFER'>('EXPENSE');

  const loadCategories = () => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory() {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user', name, type })
    });
    const created = await res.json();
    setCategories([created, ...categories]);
    setName('');
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    loadCategories();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-gray-500">Organize your income and expenses with categories</p>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <div className="flex gap-3">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Category name (e.g. Groceries, Salary)" value={name} onChange={e=>setName(e.target.value)} />
          <select className="border rounded px-3 py-2" value={type} onChange={e=>setType(e.target.value as any)}>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
            <option value="TRANSFER">Transfer</option>
          </select>
          <button className="btn btn-primary" onClick={addCategory}>Add Category</button>
        </div>
      </div>
      <div className="card p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="py-3">Category Name</th>
              <th className="py-3">Type</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="py-3 font-medium">{c.name}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs ${c.type === 'INCOME' ? 'bg-green-100 text-green-700' : c.type === 'EXPENSE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {c.type}
                  </span>
                </td>
                <td className="py-3">
                  <button 
                    onClick={() => deleteCategory(c.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete category"
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



