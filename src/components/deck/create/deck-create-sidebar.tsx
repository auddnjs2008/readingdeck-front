"use client";

import {
  useMemo,
  useState,
  type DragEvent as ReactDragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BookOpen, FileText, Search, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DeckSidebarBookItem, DeckSidebarCardItem } from "./types";

type Props = {
  bookItems: readonly DeckSidebarBookItem[];
  cardItems: readonly DeckSidebarCardItem[];
  onBookDragStart: (book: DeckSidebarBookItem, event: ReactDragEvent) => void;
  onCardDragStart: (card: DeckSidebarCardItem, event: ReactDragEvent) => void;
  onAddSelectedBook: (book: DeckSidebarBookItem) => void;
  onAddSelectedCard: (card: DeckSidebarCardItem) => void;
};

const CARD_TYPE_STYLE: Record<string, string> = {
  insight: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  question: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  change: "text-green-500 bg-green-500/10 border-green-500/30",
  quote: "text-purple-500 bg-purple-500/10 border-purple-500/30",
};

export default function DeckCreateSidebar({
  bookItems,
  cardItems,
  onBookDragStart,
  onCardDragStart,
  onAddSelectedBook,
  onAddSelectedCard,
}: Props) {
  const SIDEBAR_WIDTH_KEY = "readingdeck-deck-sidebar-width";
  const DEFAULT_WIDTH = 320;
  const MIN_WIDTH = 280;
  const MAX_WIDTH = 520;

  const [activeTab, setActiveTab] = useState<"books" | "cards">("books");
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "insight",
    "question",
    "change",
    "quote",
  ]);
  const [unusedOnly, setUnusedOnly] = useState(false);
  const [sort, setSort] = useState<"recency" | "bookTitle">("recency");
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_WIDTH;
    const raw = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isNaN(parsed)) return DEFAULT_WIDTH;
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed));
  });

  const searchPlaceholder = useMemo(
    () => (activeTab === "books" ? "Search books, tags..." : "Search cards..."),
    [activeTab]
  );

  const footerLabel =
    activeTab === "books"
      ? "Add Selected Book to Canvas"
      : "Add Selected Card to Canvas";
  const cardTypes = ["insight", "question", "change", "quote"];

  const filteredBooks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return bookItems;
    return bookItems.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.author.toLowerCase().includes(term)
    );
  }, [bookItems, query]);

  const filteredCards = useMemo(() => {
    const term = query.trim().toLowerCase();
    const cards = cardItems.filter((item) => {
      if (!selectedTypes.includes(item.type)) return false;
      if (unusedOnly && item.used) return false;
      if (!term) return true;
      return (
        item.text.toLowerCase().includes(term) ||
        item.bookTitle.toLowerCase().includes(term)
      );
    });

    if (sort === "bookTitle") {
      return [...cards].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
    }
    return cards;
  }, [cardItems, query, selectedTypes, sort, unusedOnly]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const selectedBook = filteredBooks.find((book) => book.id === selectedBookId);
  const selectedCard = filteredCards.find((card) => card.id === selectedCardId);
  const canAddSelected =
    activeTab === "books" ? Boolean(selectedBook) : Boolean(selectedCard);

  const handleAddSelected = () => {
    if (activeTab === "books" && selectedBook) {
      onAddSelectedBook(selectedBook);
      return;
    }
    if (activeTab === "cards" && selectedCard) {
      onAddSelectedCard(selectedCard);
    }
  };

  const handleResizeStart = (event: ReactMouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;
    const startWidth = sidebarWidth;
    let latestWidth = startWidth;

    const onMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const nextWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + delta));
      latestWidth = nextWidth;
      setSidebarWidth(nextWidth);
    };

    const onUp = () => {
      window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(latestWidth));
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const resetSidebarWidth = () => {
    setSidebarWidth(DEFAULT_WIDTH);
    window.localStorage.setItem(SIDEBAR_WIDTH_KEY, String(DEFAULT_WIDTH));
  };

  return (
    <aside
      className="relative flex h-full w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-card md:w-auto"
      style={{ width: sidebarWidth }}
      suppressHydrationWarning
    >
      <div
        className="group absolute left-0 top-0 z-30 hidden h-full w-4 -translate-x-1/2 cursor-col-resize md:block"
        onMouseDown={handleResizeStart}
        onDoubleClick={resetSidebarWidth}
        role="separator"
        aria-label="Resize sidebar"
      >
        <div className="mx-auto h-full w-[2px] rounded-full bg-transparent transition-colors group-hover:bg-primary/50" />
      </div>
      <div className="shrink-0 space-y-4 border-b border-border p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Library & Assets
        </h2>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-9 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />
          {query ? (
            <button
              type="button"
              className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {activeTab === "cards" ? (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {cardTypes.map((type) => {
                const active = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`rounded-full border px-2 py-1 text-xs font-medium capitalize transition-colors ${
                      active
                        ? CARD_TYPE_STYLE[type] ?? "text-primary border-primary/30 bg-primary/10"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
                <Checkbox
                  checked={unusedOnly}
                  onCheckedChange={(checked) => setUnusedOnly(checked === true)}
                />
                <span>Unused Only</span>
              </label>

              <Select
                value={sort}
                onValueChange={(value) =>
                  setSort(value as "recency" | "bookTitle")
                }
              >
                <SelectTrigger className="h-7 w-[140px] text-xs text-muted-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="recency">Sort: Recency</SelectItem>
                  <SelectItem value="bookTitle">Sort: Book Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mb-2 shrink-0 flex gap-4 border-b border-border px-4 pt-4">
        <button
          className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
            activeTab === "books"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("books")}
          type="button"
        >
          <BookOpen className="h-4 w-4" />
          Books
        </button>
        <button
          className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
            activeTab === "cards"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("cards")}
          type="button"
        >
          <FileText className="h-4 w-4" />
          Cards
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {activeTab === "books"
          ? filteredBooks.map((item) => (
              <article
                key={item.id}
                className={`cursor-move rounded-lg border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md ${
                  selectedBookId === item.id
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border"
                }`}
                draggable
                onDragStart={(event) => onBookDragStart(item, event)}
                onClick={() => setSelectedBookId(item.id)}
              >
                <h3 className="line-clamp-1 text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.author}</p>
                <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                  {item.cards} Cards
                </div>
              </article>
            ))
          : filteredCards.map((item) => (
              <article
                key={item.id}
                className={`cursor-move rounded-lg border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md ${
                  selectedCardId === item.id
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border"
                }`}
                draggable
                onDragStart={(event) => onCardDragStart(item, event)}
                onClick={() => setSelectedCardId(item.id)}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      CARD_TYPE_STYLE[item.type] ??
                      "text-primary bg-primary/10 border-primary/30"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <div className="mt-2 border-t border-border pt-2 text-[10px] font-medium text-muted-foreground">
                  {item.bookTitle}
                </div>
              </article>
            ))}
      </div>

      <div className="shrink-0 border-t border-border p-4">
        <button
          type="button"
          disabled={!canAddSelected}
          onClick={handleAddSelected}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {footerLabel}
        </button>
      </div>
    </aside>
  );
}
