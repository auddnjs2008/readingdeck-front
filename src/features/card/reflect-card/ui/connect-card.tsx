"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getRelatedCards,
  type RelatedCard,
} from "@/entities/card/api/reflections";
import type { ResGetCardDetail } from "@/entities/card/api/getCardDetail";
import { getBooks } from "@/entities/book/api/getBooks";
import { getBookCards } from "@/entities/book/api/getBookCards";
import { getDecks } from "@/entities/deck/api/getDecks";
import { createDeck } from "@/entities/deck/api/createDeck";
import {
  addCardConnection,
  RELATIONS,
  type CardRelation,
} from "@/entities/deck/api/addCardConnection";
import { Button } from "@/shared/ui/button";

const focusHeading = (node: HTMLHeadingElement | null) => { node?.focus(); };

export default function ConnectCard({
  card,
  onDirtyChange,
  onBack,
  onFinish,
}: {
  card: ResGetCardDetail;
  onDirtyChange: (dirty: boolean) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [manual, setManual] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [bookId, setBookId] = useState<number | null>(null);
  const [selected, setSelected] = useState<RelatedCard | null>(null);
  const [relation, setRelation] = useState<CardRelation | "">("");
  const [deckChoice, setDeckChoice] = useState<string | null>(null);
  const [name, setName] = useState("오늘 이어진 생각");
  const request = useRef<{ signature: string; id: string } | null>(null);
  const id = useId();
  const client = useQueryClient();
  const related = useQuery({
    queryKey: ["cards", "related", card.id],
    queryFn: () => getRelatedCards(card.id),
    retry: false,
  });
  const books = useInfiniteQuery({
    queryKey: ["books", "connection-picker", keyword],
    initialPageParam: 1,
    enabled: manual,
    queryFn: ({ pageParam }) =>
      getBooks({ query: { page: pageParam, take: 20, keyword } }),
    getNextPageParam: (page) =>
      page.meta.page < page.meta.totalPages ? page.meta.page + 1 : undefined,
  });
  const cards = useInfiniteQuery({
    queryKey: ["cards", "connection-picker", bookId],
    initialPageParam: undefined as number | undefined,
    enabled: bookId !== null,
    queryFn: ({ pageParam }) =>
      getBookCards({
        path: { bookId: bookId! },
        query: { take: 20, cursor: pageParam },
      }),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  const decks = useInfiniteQuery({
    queryKey: ["deck", "connection-picker"],
    initialPageParam: 0,
    enabled: selected !== null,
    queryFn: ({ pageParam }) =>
      getDecks({
        query: {
          mode: "graph",
          status: "draft",
          shared: false,
          cursor: pageParam,
          take: 50,
        },
      }),
    getNextPageParam: (page) => page.meta.nextCursor ?? undefined,
  });
  const deckItems = decks.data?.pages.flatMap((page) => page.items) ?? [];
  const [lastDeck] = useState(() => {
    try {
      return sessionStorage.getItem("reflection-last-deck");
    } catch {
      return null;
    }
  });
  const target =
    deckChoice ??
    (deckItems.some((deck) => String(deck.id) === lastDeck)
      ? lastDeck!
      : "new");
  const save = useMutation({
    mutationFn: async () => {
      if (!selected || !relation)
        throw new Error("카드와 관계를 선택해 주세요.");
      if (target !== "new") {
        const response = await addCardConnection(Number(target), {
          fromCardId: card.id,
          toCardId: selected.id,
          relation,
        });
        return { id: response.deckId, existing: response.alreadyConnected };
      }
      const signature = JSON.stringify([selected.id, relation, name.trim()]);
      if (request.current?.signature !== signature)
        request.current = { signature, id: crypto.randomUUID() };
      const deck = await createDeck({
        body: {
          requestId: request.current.id,
          name: name.trim(),
          status: "draft",
          mode: "graph",
          nodes: [card.id, selected.id].map((cardId, index) => ({
            clientKey: `card-${cardId}`,
            type: "card",
            cardId,
            positionX: index * 400,
            positionY: 0,
            order: index,
          })),
          connections: [
            {
              fromNodeClientKey: `card-${card.id}`,
              toNodeClientKey: `card-${selected.id}`,
              type: relation,
              label: RELATIONS[relation],
            },
          ],
        },
      });
      return { id: deck.id, existing: false };
    },
    onSuccess: (value) => {
      try {
        sessionStorage.setItem("reflection-last-deck", String(value.id));
      } catch {
        /* Storage is optional. */
      }
      void client.invalidateQueries({ queryKey: ["deck"] });
      void client.invalidateQueries({ queryKey: ["me", "homeSummary"] });
    },
    onError: () =>
      toast.error(
        "연결을 저장하지 못했어요. 선택은 유지됩니다. 덱이 비공개 초안인지 확인하고 다시 시도해 주세요.",
      ),
  });
  const result = save.data;
  useEffect(() => {
    onDirtyChange(!result && Boolean(selected));
  }, [selected, result, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  if (result)
    return (
      <div className="space-y-6 py-8">
        <h2 tabIndex={-1} ref={focusHeading} className="font-serif text-2xl outline-none">
          {result.existing
            ? "이미 연결된 카드예요. 기존 관계를 유지했어요."
            : "두 생각을 덱에 연결했어요."}
        </h2>
        <div className="flex flex-wrap gap-3">
        <Button onClick={onFinish}>마치기</Button>
        <Button variant="outline" as={Link} href={`/decks/${result.id}/edit`}>
          연결된 덱 보기
        </Button>
        </div>
      </div>
    );

  const choose = (item: RelatedCard) => (
    <button
      type="button"
      key={item.id}
      onClick={() => { setSelected(item); setRelation(""); }}
      className="w-full space-y-2 rounded border border-border p-4 text-left"
    >
      <span className="block text-xs text-muted-foreground">
        {item.bookTitle} · {item.author}
      </span>
      <span className="block whitespace-pre-wrap break-words text-sm leading-relaxed">
        {item.thought}
      </span>
    </button>
  );
  const currentBook = books.data?.pages
    .flatMap((page) => page.items)
    .find((book) => book.id === bookId);
  return (
    <section
      className="space-y-4"
      aria-label="다른 책의 카드 연결"
    >
      <Button variant="ghost" disabled={save.isPending} onClick={() => selected ? setSelected(null) : onBack()}>
        {selected ? "카드 다시 고르기" : "완료 화면으로"}
      </Button>
      <h2 key={selected ? "configure" : "choose"} tabIndex={-1} ref={focusHeading} className="font-serif text-2xl outline-none">
        {selected ? "두 생각은 어떻게 이어지나요?" : "이 생각과 이어지는 기록이 있나요?"}
      </h2>
      {!selected && <>
      {related.isPending && (
        <p role="status" className="text-sm">
          다른 책의 기록을 찾는 중…
        </p>
      )}
      {related.isError && (
        <p className="text-sm text-muted-foreground">
          후보를 불러오지 못했어요. 직접 찾아 연결할 수 있어요.
        </p>
      )}
      {related.data?.items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          추천할 카드가 아직 없어요. 다른 책에 남긴 카드가 있다면 직접 골라
          보세요.
        </p>
      )}
      {related.data?.items.map(choose)}
      <Button
        variant="outline"
        onClick={() => setManual(!manual)}
      >
        {manual ? "직접 찾기 접기" : "직접 찾기"}
      </Button>
      {manual && (
        <div className="space-y-3">
          <label htmlFor={`${id}-search`} className="block text-sm">
            내 책 검색
          </label>
          <input
            id={`${id}-search`}
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              setBookId(null);
            }}
            className="w-full rounded border border-border bg-background p-3 text-sm"
          />
          {books.isPending && <p role="status">책을 불러오는 중…</p>}
          {books.isError && (
            <Button variant="outline" onClick={() => void books.refetch()}>
              책 다시 불러오기
            </Button>
          )}
          <div className="flex flex-wrap gap-2">
            {books.data?.pages
              .flatMap((page) => page.items)
              .filter((book) => book.id !== card.book.id)
              .map((book) => (
                <Button
                  key={book.id}
                  variant={bookId === book.id ? undefined : "outline"}
                  onClick={() => setBookId(book.id)}
                >
                  {book.title}
                </Button>
              ))}
          </div>
          {books.data &&
            !books.hasNextPage &&
            books.data.pages
              .flatMap((page) => page.items)
              .every((book) => book.id === card.book.id) && (
              <p className="text-sm">
                다른 책에도 카드를 남기면 연결할 수 있어요.
              </p>
            )}
          {books.hasNextPage && (
            <Button
              variant="ghost"
              disabled={books.isFetchingNextPage}
              onClick={() => void books.fetchNextPage()}
            >
              책 더 보기
            </Button>
          )}
          {bookId && cards.isPending && (
            <p role="status">카드를 불러오는 중…</p>
          )}
          {bookId && cards.isError && (
            <Button variant="outline" onClick={() => void cards.refetch()}>
              카드 다시 불러오기
            </Button>
          )}
          {currentBook &&
            cards.data?.pages
              .flatMap((page) => page.items)
              .map((item) =>
                choose({
                  ...item,
                  bookId: currentBook.id,
                  bookTitle: currentBook.title,
                  author: currentBook.author,
                }),
              )}
          {cards.data?.pages[0].items.length === 0 && (
            <p className="text-sm">이 책에는 아직 카드가 없어요.</p>
          )}
          {cards.hasNextPage && (
            <Button
              variant="ghost"
              disabled={cards.isFetchingNextPage}
              onClick={() => void cards.fetchNextPage()}
            >
              카드 더 보기
            </Button>
          )}
        </div>
      )}
      </>}
      {selected && (
        <fieldset
          disabled={save.isPending}
          className="space-y-4 border-t border-border pt-4"
        >
          <legend className="sr-only">연결 관계와 저장할 덱</legend>
          <p className="text-sm">선택한 기록: {selected.bookTitle}</p>
          <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">{selected.thought}</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(RELATIONS).map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded border border-border p-3 text-sm"
              >
                <input
                  type="radio"
                  name={`${id}-relation`}
                  checked={relation === value}
                  onChange={() => setRelation(value as CardRelation)}
                />
                {label}
              </label>
            ))}
          </div>
          <label htmlFor={`${id}-deck`} className="block text-sm">
            저장할 덱
          </label>
          <select
            id={`${id}-deck`}
            value={target}
            onChange={(event) => setDeckChoice(event.target.value)}
            className="w-full rounded border border-border bg-background p-3 text-sm"
          >
            <option value="new">새 비공개 덱 만들기</option>
            {deckItems.map((deck) => (
              <option key={deck.id} value={String(deck.id)}>
                {deck.name}
              </option>
            ))}
          </select>
          {decks.isError && (
            <Button variant="outline" onClick={() => void decks.refetch()}>
              덱 목록 다시 불러오기
            </Button>
          )}
          {decks.hasNextPage && (
            <Button
              variant="ghost"
              disabled={decks.isFetchingNextPage}
              onClick={() => void decks.fetchNextPage()}
            >
              덱 더 보기
            </Button>
          )}
          {target === "new" && (
            <>
              <label htmlFor={`${id}-name`} className="block text-sm">
                새 덱 이름
              </label>
              <input
                id={`${id}-name`}
                maxLength={255}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded border border-border bg-background p-3 text-sm"
              />
            </>
          )}
          <p className="text-xs text-muted-foreground">
            반응 메모는 나만 볼 수 있어요. 덱에는 선택한 카드와 연결 관계만
            담깁니다.
          </p>
          <Button
            disabled={
              !relation ||
              save.isPending ||
              decks.isPending ||
              (target === "new" && !name.trim())
            }
            onClick={() => save.mutate()}
          >
            {save.isPending ? "연결 저장 중…" : "연결 저장"}
          </Button>
        </fieldset>
      )}
    </section>
  );
}
