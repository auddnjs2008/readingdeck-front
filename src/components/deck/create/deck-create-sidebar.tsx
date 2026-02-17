"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
  type DragEvent as ReactDragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ArrowLeft, Plus, Search, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookCardsQuery } from "@/hooks/book/react-query/useBookCardsQuery";
import { useBooksQuery } from "@/hooks/book/react-query/useBooksQuery";
import type { DeckSidebarBookItem, DeckSidebarCardItem } from "./types";

type Props = {
  onBookDragStart: (book: DeckSidebarBookItem, event: ReactDragEvent) => void;
  onCardDragStart: (card: DeckSidebarCardItem, event: ReactDragEvent) => void;
  onAddSelectedBook: (book: DeckSidebarBookItem) => void;
  onAddSelectedCard: (card: DeckSidebarCardItem) => void;
};

const CARD_TYPE_STYLE: Record<string, string> = {
  insight: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  question: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  change: "text-green-500 bg-green-500/10 border-green-500/30",
  action: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
  quote: "text-purple-500 bg-purple-500/10 border-purple-500/30",
};

const CARD_FILTER_TYPES = ["insight", "question", "change", "action"] as const;

const SIDEBAR_WIDTH_KEY = "readingdeck-deck-sidebar-width";
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 280;
const MAX_WIDTH = 520;

export default function DeckCreateSidebar({
  onBookDragStart,
  onCardDragStart,
  onAddSelectedBook,
  onAddSelectedCard,
}: Props) {
  const [mode, setMode] = useState<"books" | "cards">("books");
  const [bookQuery, setBookQuery] = useState("");
  const [cardQuery, setCardQuery] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "insight",
    "question",
    "change",
    "action",
  ]);
  const [hasQuoteOnly, setHasQuoteOnly] = useState(false);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_WIDTH;
    const raw = window.localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const parsed = raw ? Number(raw) : Number.NaN;
    if (Number.isNaN(parsed)) return DEFAULT_WIDTH;
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed));
  });

  const { data: booksData, isPending: isBooksPending } = useBooksQuery({
    query: {
      page: 1,
      take: 100,
      sort: "createdAt",
      keyword: bookQuery.trim() || undefined,
    },
  });

  const books = useMemo(
    () =>
      (booksData?.items ?? []).map(
        (item) =>
          ({
            id: String(item.id),
            title: item.title,
            author: item.author,
            cards: item.cardCount,
            cover: item.backgroundImage ?? "",
          }) satisfies DeckSidebarBookItem
      ),
    [booksData]
  );

  const currentBook = useMemo(() => {
    if (!books.length) return null;
    if (selectedBookId === null) return books[0];
    return books.find((book) => Number(book.id) === selectedBookId) ?? books[0];
  }, [books, selectedBookId]);

  const {
    data: cardsData,
    isPending: isCardsPending,
    isFetching: isCardsFetching,
  } = useBookCardsQuery(
    {
      path: { bookId: currentBook ? Number(currentBook.id) : 0 },
      query: {
        take: 100,
        sort,
        types: selectedTypes as ("insight" | "change" | "action" | "question")[],
        hasQuote: hasQuoteOnly || undefined,
      },
    },
    { enabled: mode === "cards" && Boolean(currentBook) }
  );

  const rawCards = useMemo(() => cardsData?.items ?? [], [cardsData]);

  const filteredCards = useMemo(() => {
    const term = cardQuery.trim().toLowerCase();
    const mappedCards = rawCards.map((item) => {
      const type: DeckSidebarCardItem["type"] = item.type;
      const text = item.thought?.trim() || item.quote?.trim() || "";
      const quote = item.quote?.trim() || "";

      return {
        id: String(item.id),
        type,
        text,
        quote,
        pageStart: item.pageStart,
        pageEnd: item.pageEnd,
        bookTitle: currentBook?.title ?? "Unknown Book",
        bookAuthor: currentBook?.author ?? "Unknown Author",
        bookCover: currentBook?.cover ?? "",
        used: false,
      } satisfies DeckSidebarCardItem;
    });

    const result = mappedCards.filter((item) => {
      if (!term) return true;

      return (
        item.text.toLowerCase().includes(term) ||
        (item.quote?.toLowerCase().includes(term) ?? false) ||
        item.bookTitle.toLowerCase().includes(term)
      );
    });
    return result;
  }, [cardQuery, currentBook, rawCards]);

  const selectedCard = filteredCards.find((card) => card.id === selectedCardId);

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

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const openBookCards = (book: DeckSidebarBookItem) => {
    setSelectedBookId(Number(book.id));
    setSelectedCardId(null);
    setMode("cards");
  };

  const backToBooks = () => {
    setMode("books");
    setSelectedCardId(null);
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

      {mode === "books" ? (
        <>
          <div className="shrink-0 space-y-4 border-b border-border p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Library
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={bookQuery}
                onChange={(event) => setBookQuery(event.target.value)}
                placeholder="Search books by title or author..."
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-9 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
              {bookQuery ? (
                <button
                  type="button"
                  className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setBookQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {isBooksPending ? (
              <p className="p-2 text-xs text-muted-foreground">Loading books...</p>
            ) : null}

            {!isBooksPending && !books.length ? (
              <p className="p-2 text-xs text-muted-foreground">
                No books found. Create a new book first.
              </p>
            ) : null}

            {books.map((book) => (
              <article
                key={book.id}
                className="group cursor-pointer rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md"
                draggable
                onDragStart={(event) => onBookDragStart(book, event)}
                onClick={() => openBookCards(book)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-border bg-muted/30">
                    {book.cover ? (
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-sm font-semibold">{book.title}</h3>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                        {book.cards} Cards
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        onAddSelectedBook(book);
                      }}
                      aria-label="Add book node"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="shrink-0 border-t border-border p-4">
            <button
              type="button"
              disabled={!currentBook}
              onClick={() => currentBook && onAddSelectedBook(currentBook)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Add Current Book to Canvas
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="shrink-0 space-y-4 border-b border-border p-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={backToBooks}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </button>

            {currentBook ? (
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded border border-border bg-muted/30">
                    {currentBook.cover ? (
                      <Image
                        src={currentBook.cover}
                        alt={currentBook.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 text-sm font-semibold">{currentBook.title}</h3>
                    <p className="text-xs text-muted-foreground">{currentBook.author}</p>
                    <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                      {currentBook.cards} Cards
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={cardQuery}
                onChange={(event) => setCardQuery(event.target.value)}
                placeholder="Search cards in this book..."
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-9 text-sm outline-none ring-primary/30 transition focus:ring-2"
              />
              {cardQuery ? (
                <button
                  type="button"
                  className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setCardQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CARD_FILTER_TYPES.map((type) => {
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleType(type)}
                      className={`rounded-full border px-2 py-1 text-xs font-medium capitalize transition-colors ${
                        active
                          ? CARD_TYPE_STYLE[type] ??
                            "text-primary border-primary/30 bg-primary/10"
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
                    checked={hasQuoteOnly}
                    onCheckedChange={(checked) => setHasQuoteOnly(checked === true)}
                  />
                  <span>Has Quote</span>
                </label>

                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as "latest" | "oldest")}
                >
                  <SelectTrigger className="h-7 w-[140px] text-xs text-muted-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="latest">Sort: Latest</SelectItem>
                    <SelectItem value="oldest">Sort: Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {isCardsPending || isCardsFetching ? (
              <p className="text-xs text-muted-foreground">Loading cards...</p>
            ) : null}

            {!isCardsPending && !isCardsFetching && !filteredCards.length ? (
              <p className="text-xs text-muted-foreground">
                No cards found for this book.
              </p>
            ) : null}

            {filteredCards.map((item) => (
              <article
                key={item.id}
                className={`cursor-grab rounded-lg border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md active:cursor-grabbing ${
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
              disabled={!selectedCard}
              onClick={() => selectedCard && onAddSelectedCard(selectedCard)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              Add Selected Card to Canvas
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
