import React from 'react';

export const metadata = {
  title: 'لوحة إدارة مبادرة المنح الدراسية',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100">{children}</div>;
}
