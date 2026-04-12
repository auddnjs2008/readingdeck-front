"use client";

import axios from "axios";
import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cardStyles } from "@/components/card/card-style";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCardDeleteMutation } from "@/hooks/card/react-query/useCardDeleteMutation";
import type { BookDetailCardItem } from "../types";

type Props = {
  card: BookDetailCardItem;
};

const defaultStyle = {
  badgeClass: "bg-muted text-muted-foreground border-border",
  borderClass: "",
};

export default function BookDetailCard({ card }: Props) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const deleteCardMutation = useCardDeleteMutation();
  const styles =
    card.type in cardStyles
      ? cardStyles[card.type as keyof typeof cardStyles]
      : defaultStyle;
  const hasTitle = Boolean(card.title?.trim());

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

  if (hasTitle) {
    return (
      <>
        <div
          className={`group relative overflow-hidden rounded-xl border border-border bg-card/80 shadow-paper transition-all hover:-translate-y-0.5 hover:shadow-paper-lg ${styles.borderClass}`}
        >
          {card.backgroundImage ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{
                  backgroundImage: `url(${card.backgroundImage})`,
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-linear-to-b from-background/75 via-background/85 to-background/95" />
            </>
          ) : null}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex w-full items-start gap-4 px-6 py-5 text-left"
              aria-expanded={isExpanded}
            >
              <ChevronDown
                className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-base font-semibold leading-relaxed text-foreground">
                  {card.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-bold uppercase tracking-wider ${styles.badgeClass}`}
                  >
                    {card.type}
                  </span>
                  {card.pageStart != null ? (
                    <span>
                      {card.pageEnd != null && card.pageEnd !== card.pageStart
                        ? `p.${card.pageStart}-${card.pageEnd}`
                        : `p.${card.pageStart}`}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>

            {isExpanded ? (
              <div className="border-t border-border/60 px-6 pb-6 pt-5">
                <div className="flex items-center justify-end pb-4">
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

                <div className="space-y-5">
                  {card.quote ? (
                    <div className="border-l-2 border-primary/40 pl-5">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                        Quote
                      </p>
                      <p className="whitespace-pre-line text-base font-medium font-serif italic leading-relaxed text-foreground">
                        &ldquo;{card.quote}&rdquo;
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      Thought
                    </p>
                    <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">
                      {card.thought}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
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
                <AlertDialogCancel className="h-10 px-4">
                  취소
                </AlertDialogCancel>
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

  return (
    <>
      <div
        className={`group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card/80 p-8 shadow-paper transition-all hover:-translate-y-1 hover:shadow-paper-lg ${styles.borderClass}`}
      >
        {card.backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url(${card.backgroundImage})`,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/70 to-background/95" />
          </>
        ) : null}
        <div className="relative flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badgeClass}`}
            >
              {card.type}
            </span>
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

          {card.quote ? (
            <div className="border-l-2 border-primary/40 pl-6">
              <p className="whitespace-pre-line text-lg font-medium font-serif italic leading-relaxed text-foreground">
                &ldquo;{card.quote}&rdquo;
              </p>
            </div>
          ) : null}

          <p className="whitespace-pre-line text-lg font-medium leading-relaxed text-foreground/90">
            {card.thought}
          </p>

          <div className="flex items-center justify-between border-t border-border/60 pt-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Card #{card.id}
            </span>
            {card.pageStart != null ? (
              <span className="text-[11px] text-muted-foreground">
                {card.pageEnd != null && card.pageEnd !== card.pageStart
                  ? `p.${card.pageStart}-${card.pageEnd}`
                  : `p.${card.pageStart}`}
              </span>
            ) : null}
          </div>
        </div>
      </div>
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
              <AlertDialogCancel className="h-10 px-4">
                취소
              </AlertDialogCancel>
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
