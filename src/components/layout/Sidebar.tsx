import React from 'react';
import { HomeIcon, BanknotesIcon, TagIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10" href={href}>
    {children}
  </a>
);

export default function Sidebar() {
  return (
    <aside className="bg-brand-black text-brand-white p-6">
      <div className="text-2xl font-bold">Finance<span className="text-brand-orange">.</span></div>
      <nav className="mt-8 space-y-1 text-sm">
        <NavLink href="/"><HomeIcon className="w-5 h-5" /> Dashboard</NavLink>
        <NavLink href="/accounts"><BanknotesIcon className="w-5 h-5" /> Accounts</NavLink>
        <NavLink href="/categories"><TagIcon className="w-5 h-5" /> Categories</NavLink>
        <NavLink href="/transactions"><ArrowsRightLeftIcon className="w-5 h-5" /> Transactions</NavLink>
        <NavLink href="/reports"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19V5m5 14V10m5 9V7m5 12V3" strokeWidth="2"/></svg> Reports</NavLink>
      </nav>
    </aside>
  );
}




