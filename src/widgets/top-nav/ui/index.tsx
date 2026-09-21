"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Library, Layers, Users } from "lucide-react";

import ThemeToggle from "@/shared/theme/theme-toggle";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";

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

const isActive = (pathname: string, href: string) => {
  if (href === "/books") return pathname === href || pathname.startsWith("/cards/");
  if (href === "/books/library") return pathname.startsWith("/books/");
  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function TopNav() {
  const pathname = usePathname();
  const { data: myProfile, isError } = useMyProfileQuery({ retry: false });
  const hasProfile = !isError && Boolean(myProfile?.id);
  const isLanding = pathname === "/";
  const landingLinks = [
    { href: "#about", label: "서비스 소개" },
    { href: "#how-it-works", label: "사용 방법" },
    { href: "/community", label: "공개 덱" },
  ];

  const navLinks = [
    { href: "/books", label: "홈", mobileLabel: "홈", icon: House },
    { href: "/books/library", label: "내 서재", mobileLabel: "내 서재", icon: Library },
    { href: "/decks", label: "내 덱", mobileLabel: "내 덱", icon: Layers },
    { href: "/community", label: "공개 덱", mobileLabel: "공개 덱", icon: Users },
  ] as const;

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:flex-initial">
            <Link href="/" aria-label="ReadingDeck 서비스 소개" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Image
                src="/favicon.svg"
                alt="ReadingDeck"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 rounded-lg object-cover"
              />
              <span className="truncate text-base font-bold sm:text-lg">
                ReadingDeck
              </span>
            </Link>
          </div>
          <nav className="hidden gap-8 md:flex" aria-label="메인 네비게이션">
            {(isLanding ? landingLinks : navLinks).map(({ href, label }) => {
              const active = !isLanding && isActive(pathname ?? "", href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
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
            {isLanding ? (
              <Button as={Link} href={hasProfile ? "/books" : "/login"} size="sm">
                {hasProfile ? "내 기록으로" : "시작하기"}
              </Button>
            ) : hasProfile ? (
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
                로그인
              </Button>
            )}
          </div>
        </div>
        {isLanding && (
          <nav aria-label="모바일 소개 메뉴" className="flex justify-center gap-7 border-t border-border/60 px-4 md:hidden">
            {landingLinks.map(({ href, label }) => <Link key={href} href={href} className="flex min-h-11 items-center text-xs font-medium text-muted-foreground hover:text-primary">{label}</Link>)}
          </nav>
        )}
      </header>
      {!isLanding && <nav
        aria-label="모바일 내비게이션"
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {navLinks.map(({ href, mobileLabel, icon: Icon }) => {
          const active = isActive(pathname ?? "", href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-16 min-w-0 flex-col items-center justify-center gap-1.5 text-[11px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring ${active ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {active && <span aria-hidden="true" className="absolute top-0 h-0.5 w-6 bg-primary" />}
              <Icon aria-hidden="true" className="size-[22px]" strokeWidth={active ? 2 : 1.7} />
              <span>{mobileLabel}</span>
            </Link>
          );
        })}
      </nav>}
    </>
  );
}
