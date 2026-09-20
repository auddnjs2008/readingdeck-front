"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createReflection,
  deleteReflection,
  getReflections,
  REACTIONS,
  type Reaction,
} from "@/entities/card/api/reflections";
import type { ResGetCardDetail } from "@/entities/card/api/getCardDetail";
import { Button } from "@/shared/ui/button";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/shared/ui/alert-dialog";
import ConnectCard from "./connect-card";
import { RQbookQueryKey } from "@/entities/book/model/queries/RQbookQueryKey";

export default function ReflectCard({
  card,
  onDirtyChange,
  onFinish,
}: {
  card: ResGetCardDetail;
  onDirtyChange: (dirty: boolean) => void;
  onFinish: () => void;
}) {
  const [reaction, setReaction] = useState<Reaction | "">("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<"react" | "saved" | "connect">("react");
  const [connectionDirty, setConnectionDirty] = useState(false);
  const request = useRef<{ signature: string; id: string } | null>(null);
  const noteId = useId();
  const client = useQueryClient();
  const key = ["cards", "reflections", card.id];
  const save = useMutation({
    mutationFn: () => {
      if (!reaction) throw new Error("반응을 선택해 주세요.");
      const signature = JSON.stringify([reaction, note.trim()]);
      if (request.current?.signature !== signature)
        request.current = { signature, id: crypto.randomUUID() };
      return createReflection(card.id, {
        reaction,
        note: note.trim(),
        requestId: request.current.id,
      });
    },
    onSuccess: () => {
      setReaction("");
      setNote("");
      setStep("saved");
      request.current = null;
      void client.invalidateQueries({ queryKey: key });
      void client.invalidateQueries({ queryKey: [...RQbookQueryKey.all, "cards"] });
    },
    onError: () =>
      toast.error(
        "반응을 저장하지 못했어요. 입력은 유지됩니다. 다시 시도해 주세요.",
      ),
  });
  useEffect(() => {
    onDirtyChange(
      Boolean(reaction || note || connectionDirty || save.isPending),
    );
  }, [reaction, note, connectionDirty, save.isPending, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  if (step === "connect") return <ConnectCard card={card} onDirtyChange={setConnectionDirty} onBack={() => setStep("saved")} onFinish={onFinish} />;
  if (step === "saved") return (
    <section className="space-y-6 py-8">
      <h2 tabIndex={-1} ref={(node) => node?.focus()} className="font-serif text-2xl outline-none">오늘의 생각을 남겼어요.</h2>
      <p className="text-sm text-muted-foreground">오늘은 여기서 마쳐도 좋아요. 이어지는 기록이 떠오르면 연결해 보세요.</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onFinish}>마치기</Button>
        <Button variant="outline" onClick={() => setStep("connect")}>다른 카드와 연결하기</Button>
      </div>
    </section>
  );

  return (
    <section
      id="reflection"
      className="space-y-6"
    >
      <div>
        <p className="mb-2 text-xs text-primary">다시 만난 생각</p>
        <h2 className="font-serif text-2xl">지금 이 생각은 어떤가요?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          그때의 기록은 그대로 두고, 오늘의 생각을 덧붙여 보세요.
        </p>
      </div>
      <blockquote className="space-y-2 border-l-2 border-border pl-4">
        <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed">{card.thought}</p>
        <footer className="text-xs text-muted-foreground">{card.book.title}</footer>
      </blockquote>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!save.isPending) save.mutate();
        }}
      >
        <fieldset disabled={save.isPending} className="space-y-4">
          <legend className="sr-only">지금의 반응</legend>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(REACTIONS).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded border p-3 text-sm ${reaction === value ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <input
                  type="radio"
                  name={`reaction-${noteId}`}
                  value={value}
                  checked={reaction === value}
                  onChange={() => {
                    setReaction(value as Reaction);
                  }}
                  className="accent-primary"
                />
                {label}
              </label>
            ))}
          </div>
          <label htmlFor={noteId} className="block text-sm">
            한 줄 덧붙이기 <span className="text-muted-foreground">(선택)</span>
          </label>
          <textarea
            id={noteId}
            maxLength={500}
            rows={3}
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
            }}
            placeholder="지금은 어떻게 생각하나요?"
            className="w-full rounded border border-border bg-background p-3 text-sm"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {note.length} / 500
            </span>
            <Button type="submit" disabled={!reaction || save.isPending}>
              {save.isPending ? "저장 중…" : "지금의 생각 저장"}
            </Button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export function ReflectionHistory({ cardId }: { cardId: number }) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteTrigger = useRef<HTMLButtonElement | null>(null);
  const historyContainer = useRef<HTMLDivElement | null>(null);
  const client = useQueryClient();
  const key = ["cards", "reflections", cardId];
  const history = useInfiniteQuery({
    queryKey: key,
    initialPageParam: undefined as number | undefined,
    queryFn: ({ pageParam }) => getReflections(cardId, pageParam),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  const remove = useMutation({
    mutationFn: (id: number) => deleteReflection(cardId, id),
    onSuccess: () => {
      setDeleteId(null);
      void client.invalidateQueries({ queryKey: key });
      void client.invalidateQueries({ queryKey: [...RQbookQueryKey.all, "cards"] });
    },
    onError: () => toast.error("반응을 삭제하지 못했어요. 다시 시도해 주세요."),
  });
  return (
      <div ref={historyContainer} tabIndex={-1} className="space-y-5 outline-none">
        {history.isPending && (
          <p role="status" className="text-sm">
            기록을 불러오는 중…
          </p>
        )}
        {history.isError && (
          <Button variant="outline" onClick={() => void history.refetch()}>
            기록 다시 불러오기
          </Button>
        )}
        {history.data?.pages
          .flatMap((page) => page.items)
          .map((item) => (
            <article key={item.id} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
              <div className="flex items-start justify-between gap-3 text-xs text-muted-foreground">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 py-2">
                  <time dateTime={item.createdAt}>
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </time>
                  <span>· {REACTIONS[item.reaction]}</span>
                </p>
                <Button
                  variant="ghost"
                  className="h-8 shrink-0 px-2 text-xs text-muted-foreground"
                  disabled={remove.isPending}
                  onClick={(event) => {
                    deleteTrigger.current = event.currentTarget;
                    remove.reset();
                    setDeleteId(item.id);
                  }}
                >
                  삭제
                </Button>
              </div>
              {item.note && (
                <p className="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed">
                  {item.note}
                </p>
              )}
            </article>
          ))}
        {history.data?.pages[0].items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            다시 읽으니 어떤 생각이 드나요?
          </p>
        )}
        {history.hasNextPage && (
          <Button
            variant="outline"
            disabled={history.isFetchingNextPage}
            onClick={() => void history.fetchNextPage()}
          >
            이전 기록 더 보기
          </Button>
        )}
        <AlertDialog
          open={deleteId !== null}
          onOpenChange={(open) => { if (!open && !remove.isPending) setDeleteId(null); }}
        >
          <AlertDialogContent
            onEscapeKeyDown={(event) => { if (remove.isPending) event.preventDefault(); }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              const target = deleteTrigger.current;
              (target?.isConnected ? target : historyContainer.current)?.focus();
            }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle>이 생각 기록을 삭제할까요?</AlertDialogTitle>
              <AlertDialogDescription>
                다시 읽고 남긴 이 기록만 삭제됩니다. 처음 남긴 생각은 유지돼요.
                삭제한 기록은 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {remove.isError && (
              <p role="alert" className="text-sm text-destructive">삭제하지 못했어요. 다시 시도해 주세요.</p>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={remove.isPending}>취소</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={remove.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  if (deleteId !== null && !remove.isPending) remove.mutate(deleteId);
                }}
              >
                {remove.isPending ? "삭제 중…" : "삭제하기"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}
