import type { Metadata } from "next";
import { ReactNode } from "react";
import AdminShell from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Dashboard EcoSort",
  description: "Dashboard Admin Capstone Project",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
