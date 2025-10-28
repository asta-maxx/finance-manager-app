import React from 'react';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ClientLayout from './client-layout';

export const metadata = {
  title: 'Finance Manager',
  description: 'Personal finance management app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


