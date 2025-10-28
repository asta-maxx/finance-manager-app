'use client';
import React, { createContext, useState } from 'react';
import TransactionModal from '../components/modals/TransactionModal';

const ModalContext = createContext<{ showModal: () => void }>({ showModal: () => {} });

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ showModal: () => setOpen(true) }}>
      {children}
      <TransactionModal open={open} onClose={() => setOpen(false)} onSuccess={() => window.location.reload()} />
    </ModalContext.Provider>
  );
}

export const useModal = () => React.useContext(ModalContext);


