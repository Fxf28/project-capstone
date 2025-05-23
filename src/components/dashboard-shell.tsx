"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function DashboardShell({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar toggle button for mobile */}
            <Button className="absolute top-4 right-4 z-20 p-2 rounded-md bg-gray-900 text-white lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                {sidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </Button>

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-gray-900 text-white p-6
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-auto
        `}
            >
                {/* Top Section */}
                <div>
                    <div className="text-2xl font-bold mb-6">EcoSort</div>
                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
                            Dashboard
                        </Link>
                        <Link href="/dashboard/educations" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
                            Edukasi
                        </Link>
                        <Link href="/dashboard/profile" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
                            Profil
                        </Link>
                        <Link href="/" className="hover:text-gray-300" onClick={() => setSidebarOpen(false)}>
                            Halaman Utama
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-5 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* Main content */}
            <main className="flex-1 p-6 bg-gray-100 dark:bg-black">{children}</main>
        </div>
    );
}