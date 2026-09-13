"use client";

import React, { useState } from "react";
import { CartProvider } from "./CartContext";
import { ClientNavbar } from "./ClientNavbar";
import { CartDrawer } from "./CartDrawer";
import type { UserRole } from "@/lib/supabase/types";

interface ClientLayoutShellProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userName?: string;
  isLoggedIn?: boolean;
}

export function ClientLayoutShell({
  children,
  userRole = "client",
  userName,
  isLoggedIn,
}: ClientLayoutShellProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
        <ClientNavbar
          onOpenCart={() => setIsCartOpen(true)}
          userName={userName}
          userRole={userRole}
          isLoggedIn={isLoggedIn}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </CartProvider>
  );
}
