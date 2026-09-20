"use client";

import axios from "axios";
import Link from "next/link";
import { ReflectionHistory } from "@/features/card/reflect-card/ui";
import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useCardDeleteMutation } from "@/entities/card/model/queries/useCardDeleteMutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import type { BookDetailCardItem } from "../types";

type Props = {
  card: BookDetailCardItem;
};

const typeLabels: Record<BookDetailCardItem["type"], string> = {
  insight: "인사이트",
  change: "변화",
  action: "행동",
  question: "질문",
  quote: "인용",
};

export default function BookDetailCard({ card }: Props) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteCardMutation = useCardDeleteMutation();
  const title = card.title?.trim();
  const contentId = `book-card-${card.id}-content`;
  const page =
    card.pageStart == null
      ? null
      : card.pageEnd != null && card.pageEnd !== card.pageStart
        ? `p.${card.pageStart}-${card.pageEnd}`
        : `p.${card.pageStart}`;

  const handleDeleteCard = async () => {
    try {
      await deleteCardMutation.mutateAsync({
        path: { cardId: card.id },
      });
      toast.success("카드를 삭제했습니다.");
      setShowDeleteAlert(false);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "카드를 삭제하지 못했습니다."
        : "카드를 삭제하지 못했습니다.";
      toast.error(message);
    }
  };

  return (
    <>
      <article className="min-w-0 border-b border-border/70 [overflow-wrap:anywhere]">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-start gap-4 py-5 text-left"
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="font-medium text-primary">
                {typeLabels[card.type]}
              </span>
              {page ? <span>{page}</span> : null}
            </div>
            {title ? (
              <p className="mt-2 text-base font-semibold leading-relaxed text-foreground">
                {title}
              </p>
            ) : (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/80">
                {card.thought}
              </p>
            )}
            {(card.reflectionCount ?? 0) > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                다시 남긴 생각 {card.reflectionCount}개
              </p>
            )}
          </div>
        </button>

        {isExpanded ? (
          <div id={contentId} className="pb-6 pl-8">
            <div className="space-y-6 border-l border-border pl-5">
              {card.quote ? (
                <section>
                  <p className="mb-2 text-xs font-medium text-primary">
                    원문 인용
                  </p>
                  <blockquote className="whitespace-pre-line font-serif text-base italic leading-relaxed text-foreground/80">
                    &ldquo;{card.quote}&rdquo;
                  </blockquote>
                </section>
              ) : null}

              <section>
                <p className="mb-2 text-xs font-medium text-primary">처음 남긴 생각</p>
                <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
                  {card.thought}
                </p>
              </section>
            </div>

            <section className="mt-8 space-y-6 border-t border-border/60 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold">다시 읽고 남긴 생각</h3>
                <Link
                  href={`/cards/${card.id}?mode=reflect`}
                  scroll={false}
                  className="inline-flex h-9 items-center rounded border border-border px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  생각 남기기
                </Link>
              </div>
              <ReflectionHistory cardId={card.id} />
            </section>

            <div className="mt-5 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteAlert(true)}
                aria-label={`카드 ${card.id} 삭제`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </article>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="border-border bg-popover p-6 sm:rounded-xl">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-lg font-bold text-foreground">
              이 카드를 삭제할까요?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              삭제한 카드는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 flex w-full items-center justify-between sm:justify-between">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
              <AlertDialogCancel className="h-10 px-4">취소</AlertDialogCancel>
              <AlertDialogAction
                className="h-10 bg-destructive px-4 text-destructive-foreground hover:bg-destructive/90"
                onClick={(event) => {
                  event.preventDefault();
                  void handleDeleteCard();
                }}
                disabled={deleteCardMutation.isPending}
              >
                {deleteCardMutation.isPending ? "삭제 중..." : "삭제하기"}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
