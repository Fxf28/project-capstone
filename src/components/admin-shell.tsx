"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar toggle button for mobile */}
      <button className="absolute top-4 right-4 z-20 p-2 rounded-md bg-gray-900 text-white lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
        {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-gray-900 text-white p-6
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto dark:bg-gray-100 dark:text-black
        `}
      >
        {/* Top Section */}
        <div>
          <div className="text-2xl font-bold mb-6">Admin Panel</div>
          <nav className="flex flex-col gap-2">
            <Link href="/admin" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
              Dashboard
            </Link>
            <Link href="/admin/articles" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
              Artikel
            </Link>
            <Link href="/admin/users" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
              Pengguna
            </Link>
            <Link href="/" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
              Halaman Utama
            </Link>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-4 mt-4">
          <span className="text-sm mb-2 block">EcoSort Admin Dashboard</span>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-5 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900">{children}</main>
    </div>
  );
}
