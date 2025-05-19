"use client";

import { MenuIcon } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Protect from "@/components/protect";

const Navbar = () => {
  const features = [
    {
      title: "Edukasi",
      description: "Track your performance",
      href: "/services/articles",
    },
    {
      title: "Bank Sampah",
      description: "Configure your preferences",
      href: "/services/waste-banks",
    },
  ];

  return (
    <section className="py-4">
      <div className="container">
        <nav className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tighter">EcoSort</span>
          </a>

          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Beranda
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Link href="/services">Layanan</Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink href={feature.href} key={index} className="rounded-md p-3 transition-colors hover:bg-muted/70">
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                  Tentang Kami
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
              <Protect role="admin">
                <Link href="/admin">
                  <Button className="text-white bg-blue-500 cursor-pointer hover:bg-blue-900">Dashboard</Button>
                </Link>
              </Protect>
              <UserButton />
            </SignedIn>
          </div>
          <div className="lg:hidden flex items-center gap-3">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="https://www.shadcnblocks.com" className="flex items-center gap-2">
                      <Image src="https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg" alt="Shadcn UI Navbar" width={24} height={24} className="h-6 w-6" />
                      <span className="text-lg font-semibold tracking-tighter">Shadcnblocks.com</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 p-4">
                  <Link href="/" className="font-medium">
                    Beranda
                  </Link>

                  <Accordion type="single" collapsible>
                    <AccordionItem value="features" className="border-none">
                      <AccordionTrigger className="text-base hover:no-underline">
                        <Link href="/services">Layanan</Link>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid md:grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <Link href={feature.href} key={index} className="rounded-md p-3 transition-colors hover:bg-muted/70">
                              <p className="mb-1 font-semibold text-foreground">{feature.title}</p>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Link href="/about" className="font-medium">
                    Tentang Kami
                  </Link>

                  <div className="flex flex-col gap-3 pt-2 border-t mt-4">
                    <SignedOut>
                      <SignInButton>
                        <Button variant="outline">Sign In</Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button className="bg-green-500 text-white">Sign Up</Button>
                      </SignUpButton>
                    </SignedOut>
                  </div>
                  <SignedIn>
                    <Protect role="admin">
                      <Link href="/admin" className="font-medium">
                        Dashboard
                      </Link>
                    </Protect>
                  </SignedIn>
                </div>
              </SheetContent>
            </Sheet>
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
