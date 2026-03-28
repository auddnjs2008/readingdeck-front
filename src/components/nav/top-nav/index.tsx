"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";

import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export default function TopNav() {
  const pathname = usePathname();
  const { data: myProfile } = useMyProfileQuery();
  const hasProfile = Boolean(myProfile?.id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/decks", label: "Decks" },
    { href: "/community", label: "Community" },
  ] as const;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-initial">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 shrink-0 md:hidden"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] px-4 pb-6 pt-4 sm:max-w-[280px]"
            >
              <SheetHeader className="pr-10 text-left">
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2" aria-label="모바일 메뉴">
                {navLinks.map(({ href, label }) => {
                  const active = isActive(pathname ?? "", href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/favicon.svg"
              alt="ReadingDeck"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-cover"
            />
            <span className="truncate text-lg font-bold tracking-tight">
              ReadingDeck
            </span>
          </Link>
        </div>
        <nav className="hidden gap-8 md:flex" aria-label="메인 네비게이션">
          {navLinks.map(({ href, label }) => {
            const active = isActive(pathname ?? "", href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {hasProfile ? (
            <Link href="/profile" aria-label="Profile">
              <Avatar size="default">
                <AvatarImage
                  src={myProfile?.profile ?? undefined}
                  alt={myProfile?.name ?? "Profile"}
                />
                <AvatarFallback>{getInitials(myProfile?.name)}</AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button as={Link} href="/login" size="sm">
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
