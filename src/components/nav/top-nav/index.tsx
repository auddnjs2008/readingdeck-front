import ThemeToggle from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TopNav() {
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
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-sm font-bold sm:inline-flex"
          >
            Log in
          </Button>
          <Button size="sm">Sign In</Button>
        </div>
      </div>
    </header>
  );
}
