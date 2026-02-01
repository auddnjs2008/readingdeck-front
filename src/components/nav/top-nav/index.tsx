"use client";

import Link from "next/link";

import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function TopNav() {
  const { data: myProfile } = useMyProfileQuery();
  const hasProfile = Boolean(myProfile?.id);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-primary-foreground">
            RD
          </div>
          <span className="text-lg font-bold tracking-tight">ReadingDeck</span>
        </div>
        <nav className="hidden gap-8 md:flex">
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/books"
          >
            Explore
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            href="/consult"
          >
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {hasProfile ? (
            <Link href="/consult" aria-label="Profile">
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
