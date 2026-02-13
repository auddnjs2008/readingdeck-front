"use client";

import { Upload } from "lucide-react";

type Props = {
  items: ReadonlyArray<{
    id: string;
    title: string;
    author: string;
    cards: number;
  }>;
};

export default function DeckCreateSidebar({ items }: Props) {
  return (
    <aside className="w-80 shrink-0 border-l border-border bg-card">
      <div className="space-y-4 border-b border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Library & Assets
        </h2>
        <input
          type="text"
          placeholder="Search books, tags..."
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
        />
      </div>

      <div className="max-h-[calc(100%-8.5rem)] space-y-3 overflow-y-auto p-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="cursor-move rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md"
            draggable
          >
            <h3 className="line-clamp-1 text-sm font-semibold">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.author}</p>
            <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              {item.cards} Cards
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">
          <Upload className="h-4 w-4" />
          Import New Book
        </button>
      </div>
    </aside>
  );
}
