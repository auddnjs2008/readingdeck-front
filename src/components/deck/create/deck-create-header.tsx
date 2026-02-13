"use client";

import { CheckCheck, Edit3, LibraryBig, Save, Undo2 } from "lucide-react";

export default function DeckCreateHeader() {
  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <LibraryBig className="h-5 w-5 text-primary" />
        <span className="text-sm font-semibold">Untitled Deck</span>
        <button
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Edit title"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Undo"
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Save"
        >
          <Save className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <CheckCheck className="h-4 w-4" />
          Create Deck
        </button>
      </div>
    </div>
  );
}

