"use client";

import Link from "next/link";
import {
  CheckCheck,
  Edit3,
  LibraryBig,
  Redo2,
  Save,
  Undo2,
} from "lucide-react";

export default function DeckEditorNav() {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-card px-4 shadow-md">
      <div className="relative mx-auto flex h-full max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="mr-2 flex items-center gap-2 text-primary">
            <LibraryBig className="h-7 w-7" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              DeckBuilder
            </span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/"
            >
              Home
            </Link>
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/books"
            >
              Books
            </Link>
            <Link
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              href="/consult"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
          <LibraryBig className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold tracking-wide text-foreground">
            My Reading Flow
          </h1>
          <button className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground">
            <Edit3 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background p-1">
            <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Undo2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Redo2 className="h-4 w-4" />
            </button>
          </div>
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Save"
          >
            <Save className="h-5 w-5" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <CheckCheck className="h-4 w-4" />
            Create Deck
          </button>
        </div>
      </div>
    </header>
  );
}

