"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const navItems = [
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Categories",
    href: "/categories",
    subItems: [
      { title: "Engineering", href: "/categories/engineering" },
      { title: "Business", href: "/categories/business" },
      { title: "Medicine", href: "/categories/medicine" },
      { title: "Arts & Humanities", href: "/categories/arts-humanities" },
      { title: "Science", href: "/categories/science" },
    ],
  },
  {
    title: "Universities",
    href: "/universities",
    subItems: [
      { title: "SNU", href: "/universities/snu" },
      { title: "PKNU", href: "/universities/pknu" },
      { title: "INHA", href: "/universities/inha" },
      { title: "YONSEI", href: "/universities/yonsei" },
    ],
  },
  {
    title: "Information",
    href: "/information",
    subItems: [
      { title: "Application Process", href: "/application-process" },
      { title: "Visa Requirements", href: "/visa-requirements" },
      { title: "Living in Korea", href: "/living-in-korea" },
      { title: "Scholarships", href: "/scholarships" },
    ],
  },
  {
    title: "Partners",
    href: "/partners",
  },

  {
    title: "FAQs",
    href: "/faqs",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-purple-900"
            >
              Study in Korea
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) =>
                  item.subItems ? (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-4 md:grid-cols-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.title}>
                      <Link href={item.href} passHref legacyBehavior>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === item.href &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Lang Switch + Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="bg-purple-900 hover:bg-purple-800" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      {item.subItems ? (
                        <div className="space-y-2">
                          <div className="font-medium">{item.title}</div>
                          <div className="pl-4 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.href}
                                className="block text-muted-foreground hover:text-foreground"
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block font-medium",
                            pathname === item.href
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button
                      className="bg-purple-900 hover:bg-purple-800"
                      asChild
                    >
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Register
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
