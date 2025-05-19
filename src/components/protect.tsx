// components/Protect.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";

type ProtectProps = {
  role: string;
  children: ReactNode;
};

export default function Protect({ role, children }: ProtectProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const userRole = user?.publicMetadata?.role;

  if (userRole !== role) return null;

  return <>{children}</>;
}
