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
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, User, LogOut, LayoutDashboard, ChevronRight, FileText, Plane, Home as HomeIcon } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        { title: t("landing.navbar.applicationProcess"), href: "/application-process", icon: FileText, description: "Step-by-step guide" },
        { title: t("landing.navbar.visaRequirements"), href: "/visa-requirements", icon: Plane, description: "Visa information" },
        { title: t("landing.navbar.livingInKorea"), href: "/living-in-korea", icon: HomeIcon, description: "Life in Korea" },
      ],
    },
    { title: t("landing.navbar.partners"), href: "/partners" },
    { title: t("landing.navbar.faqs"), href: "/contact/#contact-faq" },
    { title: t("landing.navbar.contact"), href: "/contact" },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300",
      isScrolled
        ? "bg-white/95 dark:bg-gray-900/95 shadow-md border-gray-200 dark:border-gray-800"
        : "bg-white/80 dark:bg-gray-900/80 border-transparent"
    )}>
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Graduate in Korea Logo"
                  width={44}
                  height={44}
                  className="rounded-lg transition-transform group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-purple-900 dark:text-white">
                  Graduate in Korea
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-1">
                {navItems.map((item) =>
                  item.subItems ? (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 data-[state=open]:bg-purple-50 dark:data-[state=open]:bg-purple-900/20">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[340px] gap-1 p-3">
                          {item.subItems.map((subItem) => {
                            const Icon = subItem.icon;
                            return (
                              <li key={subItem.href}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                                  >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                      <Icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {subItem.title}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {subItem.description}
                                      </div>
                                    </div>
                                    <ChevronRight className="ml-auto h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group relative px-3 py-2 text-sm font-medium transition-colors",
                            "hover:text-purple-700 dark:hover:text-purple-300",
                            pathname === item.href
                              ? "text-purple-700 dark:text-purple-300"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {item.title}
                          <span className={cn(
                            "absolute bottom-0 left-3 right-3 h-0.5 bg-purple-600 dark:bg-purple-400 transition-transform origin-left",
                            pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                          )} />
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Theme + Lang Switch + Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full px-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <User className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                    </div>
                    <span className="hidden xl:inline text-sm font-medium">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300" asChild>
                  <Link href="/login">{t("landing.navbar.login")}</Link>
                </Button>
                <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white shadow-sm" asChild>
                  <Link href="/register">{t("landing.navbar.register")}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left text-lg font-semibold text-purple-900 dark:text-purple-300">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-4">
                  {navItems.map((item) => (
                    <div key={item.href} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                      {item.subItems ? (
                        <div className="py-3">
                          <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">{item.title}</div>
                          <div className="space-y-1">
                            {item.subItems.map((subItem) => {
                              const Icon = subItem.icon;
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <Icon className="h-4 w-4" />
                                  {subItem.title}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "block py-3 font-medium transition-colors",
                            pathname === item.href
                              ? "text-purple-700 dark:text-purple-300"
                              : "text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 px-1 py-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <User className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{getUserDisplayName()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                          </div>
                        </div>
                        {accountType === "university" ? (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={getDashboardUrl()} onClick={() => setIsOpen(false)}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              {t("nav.studentDashboard")}
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href={getDashboardUrl()} onClick={() => setIsOpen(false)}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              {t("nav.studentDashboard")}
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t("nav.logOut")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            {t("landing.navbar.login")}
                          </Link>
                        </Button>
                        <Button className="w-full bg-purple-700 hover:bg-purple-800" asChild>
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            {t("landing.navbar.register")}
                          </Link>
                        </Button>
                      </div>
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
