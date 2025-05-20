// app/login/layout.tsx
import React from 'react';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <main>{children}</main>
    </div>
  );
}
