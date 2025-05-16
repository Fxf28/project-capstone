"use client";

import { Footer7 } from "@/components/footer7";
import { Hero1 } from "@/components/hero1";
import { Navbar5 } from "@/components/navbar5";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col gap-4 px-4">
      <Navbar5 />
      <Hero1 />
      <Footer7 />
    </div>
  );
}
