"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tighter">EcoSort</span>
          </a>

          <div className="hidden items-center gap-4 lg:flex">
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="text-white bg-green-500 cursor-pointer hover:bg-green-900">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="text-white bg-blue-500 cursor-pointer hover:bg-blue-900">Dashboard</Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
          <div className="lg:hidden flex items-center gap-3">
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <Button variant="outline" className="cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="text-white bg-green-500 cursor-pointer hover:bg-green-900">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button className="text-white bg-blue-500 cursor-pointer hover:bg-blue-900">Dashboard</Button>
              </Link>
            </SignedIn>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>
      </div>
    </section>
  );
};

export { Navbar };
