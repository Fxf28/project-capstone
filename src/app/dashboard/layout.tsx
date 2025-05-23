import type { Metadata } from "next";
import { ReactNode } from "react";
import DashboardShell from "@/components/dashboard-shell";

export const metadata: Metadata = {
    title: "Dashboard EcoSort",
    description: "Dashboard Capstone Project",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <DashboardShell>{children}</DashboardShell>
        </div>
    );
}