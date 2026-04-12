"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
  type DragEvent as ReactDragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { ArrowLeft, Book, Plus, Search, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  enableBookNodeActions?: boolean;
  instantAddCardOnClick?: boolean;
  externalSelectedBookId?: number | null;
  onClearExternalBookId?: () => void;
  variant?: "sidebar" | "sheet";
};

const CARD_TYPE_STYLE: Record<string, string> = {
  insight:
    "text-emerald-700 bg-emerald-600/10 border-emerald-600/30 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  question:
    "text-rose-700 bg-rose-600/10 border-rose-600/30 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20",
  change:
    "text-orange-700 bg-orange-600/10 border-orange-600/30 dark:text-orange-400 dark:bg-orange-500/10 dark:border-orange-500/20",
  action:
    "text-sky-700 bg-sky-600/10 border-sky-600/30 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
  quote:
    "text-sky-700 bg-sky-600/10 border-sky-600/30 dark:text-sky-400 dark:bg-sky-500/10 dark:border-sky-500/20",
};

const CARD_FILTER_TYPES = ["insight", "question", "change", "action"] as const;

const SIDEBAR_WIDTH_KEY = "readingdeck-deck-sidebar-width";
const DEFAULT_WIDTH = 320;
const MIN_WIDTH = 280;
const MAX_WIDTH = 520;
const formatPageMeta = (pageStart?: number | null, pageEnd?: number | null) => {
  if (pageStart == null && pageEnd == null) return null;
  if (pageStart != null && pageEnd != null) {
    return pageStart === pageEnd
      ? `${pageStart}페이지`
      : `${pageStart}-${pageEnd}페이지`;
  }
  if (pageStart != null) return `${pageStart}페이지`;
  return `${pageEnd}페이지까지`;
};

export default function DeckCreateSidebar({
  onBookDragStart,
  onCardDragStart,
  onAddSelectedBook,
  onAddSelectedCard,
  enableBookNodeActions = true,
  instantAddCardOnClick = false,
  externalSelectedBookId,
  onClearExternalBookId,
  variant = "sidebar",
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

  useEffect(() => {
    if (
      externalSelectedBookId !== undefined &&
      externalSelectedBookId !== null
    ) {
      const timer = window.setTimeout(() => {
        setSelectedBookId(externalSelectedBookId);
        setMode("cards");
        onClearExternalBookId?.();
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [externalSelectedBookId, onClearExternalBookId]);

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
          } satisfies DeckSidebarBookItem)
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
        types: selectedTypes as (
          | "insight"
          | "change"
          | "action"
          | "question"
        )[],
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
        title: item.title?.trim() || null,
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
        (item.title?.toLowerCase().includes(term) ?? false) ||
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
      const nextWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startWidth + delta)
      );
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
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
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

  const handleCardClick = (card: DeckSidebarCardItem) => {
    if (instantAddCardOnClick) {
      onAddSelectedCard(card);
      return;
    }
    setSelectedCardId(card.id);
  };

  const isSheet = variant === "sheet";

  return (
    <aside
      className={
        isSheet
          ? "relative flex h-full w-full flex-col overflow-hidden bg-card "
          : "relative flex h-full w-80 shrink-0 flex-col overflow-hidden border-l border-border bg-card md:w-auto"
      }
      style={isSheet ? undefined : { width: sidebarWidth }}
      suppressHydrationWarning
    >
      {!isSheet ? (
        <div
          className="group absolute left-0 top-0 z-30 hidden h-full w-4 -translate-x-1/2 cursor-col-resize md:block"
          onMouseDown={handleResizeStart}
          onDoubleClick={resetSidebarWidth}
          role="separator"
          aria-label="Resize sidebar"
        >
          <div className="mx-auto h-full w-[2px] rounded-full bg-transparent transition-colors group-hover:bg-primary/50" />
        </div>
      ) : null}

      {mode === "books" ? (
        <>
          <div
            className={`shrink-0 space-y-4 p-4 ${
              !isSheet ? "border-b border-border" : ""
            }`}
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              내 서재
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={bookQuery}
                onChange={(event) => setBookQuery(event.target.value)}
                placeholder="책 제목이나 저자로 검색해보세요..."
                className="w-full rounded-full border border-border/70 bg-muted/30 py-2 pl-10 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-primary"
              />
              {bookQuery ? (
                <button
                  type="button"
                  className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setBookQuery("")}
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 p-3">
              {isBooksPending ? (
                <p className="p-2 text-xs text-muted-foreground">
                  책을 불러오는 중...
                </p>
              ) : null}

              {!isBooksPending && !books.length ? (
                <p className="p-2 text-xs text-muted-foreground">
                  등록된 책이 없습니다. 먼저 새 책을 추가해주세요.
                </p>
              ) : null}

              {books.map((book) => (
                <article
                  key={book.id}
                  className="group cursor-pointer rounded-lg border border-border bg-background p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-paper"
                  draggable
                  onDragStart={(event) => onBookDragStart(book, event)}
                  onClick={() => openBookCards(book)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-muted/30">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        <Book className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-sm font-bold font-serif">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {book.author}
                        </p>
                        <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                          {book.cards} 카드
                        </div>
                      </div>
                      {enableBookNodeActions ? (
                        <button
                          type="button"
                          className="rounded p-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                          onClick={(event) => {
                            event.stopPropagation();
                            onAddSelectedBook(book);
                          }}
                          aria-label="책 노드 추가"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ScrollArea>

          {enableBookNodeActions ? (
            <div
              className={`shrink-0 p-4 ${
                !isSheet ? "border-t border-border" : ""
              }`}
            >
              <button
                type="button"
                disabled={!currentBook}
                onClick={() => currentBook && onAddSelectedBook(currentBook)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                현재 책을 캔버스에 추가
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={`shrink-0 space-y-4 p-4 ${
              !isSheet ? "border-b border-border" : ""
            }`}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={backToBooks}
            >
              <ArrowLeft className="h-4 w-4" />
              서재로 돌아가기
            </button>

            {currentBook ? (
              <div className="rounded-lg border border-border bg-background p-3">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-muted/30">
                    {currentBook.cover ? (
                      <Image
                        src={currentBook.cover}
                        alt={currentBook.title}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <Book className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {currentBook.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {currentBook.author}
                    </p>
                    <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                      {currentBook.cards} 카드
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
                placeholder="이 책의 카드를 검색해보세요..."
                className="w-full rounded-full border border-border/70 bg-muted/30 py-2 pl-10 pr-9 text-sm outline-none transition focus:ring-2 focus:ring-primary"
              />
              {cardQuery ? (
                <button
                  type="button"
                  className="absolute right-2 top-1.5 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setCardQuery("")}
                  aria-label="검색어 지우기"
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
                          : "border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
                    onCheckedChange={(checked) =>
                      setHasQuoteOnly(checked === true)
                    }
                  />
                  <span>인용구 포함</span>
                </label>

                <Select
                  value={sort}
                  onValueChange={(value) =>
                    setSort(value as "latest" | "oldest")
                  }
                >
                  <SelectTrigger className="h-8 w-[140px] rounded-full border-border/70 bg-muted/30 text-xs text-muted-foreground focus:ring-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-3 px-3 py-2">
              {isCardsPending || isCardsFetching ? (
                <p className="text-xs text-muted-foreground">
                  카드를 불러오는 중...
                </p>
              ) : null}

              {!isCardsPending && !isCardsFetching && !filteredCards.length ? (
                <p className="text-xs text-muted-foreground">
                  이 책에 등록된 카드가 없습니다.
                </p>
              ) : null}

              {filteredCards.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-lg p-3 transition-all hover:-translate-y-0.5 ${
                    instantAddCardOnClick
                      ? "cursor-pointer"
                      : "cursor-grab active:cursor-grabbing"
                  } ${
                    selectedCardId === item.id
                      ? "bg-primary/10 ring-1 ring-primary/30"
                      : "bg-muted/50 hover:bg-muted/70"
                  }`}
                  draggable={!instantAddCardOnClick}
                  onDragStart={(event) => onCardDragStart(item, event)}
                  onClick={() => handleCardClick(item)}
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
                  {item.title ? (
                    <p className="line-clamp-1 text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                  ) : null}
                  <p
                    className={`text-xs leading-relaxed text-muted-foreground font-serif ${
                      item.title ? "mt-1 line-clamp-2" : "line-clamp-3"
                    }`}
                  >
                    {item.text}
                  </p>
                  <div className="mt-2 border-t border-border pt-2 text-[10px] font-medium text-muted-foreground">
                    {item.bookTitle}
                    {formatPageMeta(item.pageStart, item.pageEnd)
                      ? ` · ${formatPageMeta(item.pageStart, item.pageEnd)}`
                      : ""}
                  </div>
                </article>
              ))}
            </div>
          </ScrollArea>

          {!instantAddCardOnClick ? (
            <div
              className={`shrink-0 p-4 ${
                !isSheet ? "border-t border-border" : ""
              }`}
            >
              <button
                type="button"
                disabled={!selectedCard}
                onClick={() => selectedCard && onAddSelectedCard(selectedCard)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                선택한 카드를 캔버스에 추가
              </button>
            </div>
          ) : (
            <div
              className={`shrink-0 p-4 ${
                !isSheet ? "border-t border-border" : ""
              }`}
            >
              <p className="text-center text-xs text-muted-foreground">
                카드를 클릭하면 즉시 리스트에 추가됩니다.
              </p>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
