"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useI18n } from "@/lib/i18n";
import { getAccessTokenFromStorage, getUserFromStorage, clearAuthStorage, UNIVERSITY_DASHBOARD_URL } from "@/lib/auth";

interface UserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const token = getAccessTokenFromStorage();
    const storedAccountType = localStorage.getItem("account_type");
    const userData = getUserFromStorage<UserData>();

    setIsAuthenticated(!!token);
    setAccountType(storedAccountType);
    setUser(userData);
  }, []);

  const handleLogout = () => {
    clearAuthStorage();
    localStorage.removeItem("account_type");
    localStorage.removeItem("university_id");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    setAccountType(null);
    setUser(null);
    router.push("/");
  };

  const getDashboardUrl = () => {
    if (accountType === "university") {
      return UNIVERSITY_DASHBOARD_URL;
    }
    return "/student/profile";
  };

  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
    if (user?.first_name) return user.first_name;
    if (user?.email) return user.email.split("@")[0];
    return t("nav.myProfile");
  };

  const navItems = [
    { title: t("landing.navbar.about"), href: "/about" },
    {
      title: t("landing.navbar.information"),
      href: "/information",
      subItems: [
        { title: t("landing.navbar.applicationProcess"), href: "/application-process" },
        { title: t("landing.navbar.visaRequirements"), href: "/visa-requirements" },
        { title: t("landing.navbar.livingInKorea"), href: "/living-in-korea" },
      ],
    },
    { title: t("landing.navbar.partners"), href: "/partners" },
    { title: t("landing.navbar.faqs"), href: "/contact/#contact-faq" },
    { title: t("landing.navbar.contact"), href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 dark:border-gray-800 backdrop-blur-md">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Graduate in Korea Logo"
                width={60}
                height={60}
                className="rounded-md"
              />
              <span className="text-xl font-bold text-purple-900 dark:text-purple-300">
                Graduate in Korea
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {navItems.map((item) =>
                  item.subItems ? (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger>
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-2 p-4 md:grid-cols-2">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.href}>
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
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            pathname === item.href &&
                              "bg-accent text-accent-foreground"
                          )}
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Theme + Lang Switch + Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t("nav.myProfile")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountType === "university" ? (
                    <DropdownMenuItem asChild>
                      <a href={getDashboardUrl()} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("nav.studentDashboard")}
                      </a>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardUrl()} className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("nav.studentDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">{t("landing.navbar.login")}</Link>
                </Button>
                <Button className="bg-purple-900 hover:bg-purple-800" asChild>
                  <Link href="/register">{t("landing.navbar.register")}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
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
                    <div key={item.href}>
                      {item.subItems ? (
                        <div className="space-y-2">
                          <div className="font-medium">{item.title}</div>
                          <div className="pl-4 space-y-1">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
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
                    {isAuthenticated ? (
                      <>
                        <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                          {getUserDisplayName()}
                        </div>
                        {accountType === "university" ? (
                          <Button variant="outline" asChild>
                            <a href={getDashboardUrl()} onClick={() => setIsOpen(false)}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              {t("nav.studentDashboard")}
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" asChild>
                            <Link href={getDashboardUrl()} onClick={() => setIsOpen(false)}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              {t("nav.studentDashboard")}
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t("nav.logOut")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            {t("landing.navbar.login")}
                          </Link>
                        </Button>
                        <Button
                          className="bg-purple-900 hover:bg-purple-800"
                          asChild
                        >
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            {t("landing.navbar.register")}
                          </Link>
                        </Button>
                      </>
                    )}
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
