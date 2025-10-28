'use client';
import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { ModalProvider, useModal } from './provider';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const modal = useModal();
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Sidebar />
      <main className="p-8 bg-gray-50">
        <Topbar onNewTransaction={modal.showModal} />
        {children}
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <LayoutContent>{children}</LayoutContent>
    </ModalProvider>
  );
}


