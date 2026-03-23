"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Play,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";
import { toast } from "sonner";
import { useBookCardCreateMutation } from "@/hooks/book/react-query/useBookCardCreateMutation";

type CardType = "Insight" | "Change" | "Action" | "Question";

const cardTypes: Array<{
  type: CardType;
  icon: typeof Lightbulb;
  selectedClass: string;
  dotClass: string;
}> = [
  {
    type: "Insight",
    icon: Lightbulb,
    selectedClass:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    dotClass: "bg-emerald-600 dark:bg-emerald-500",
  },
  {
    type: "Change",
    icon: Triangle,
    selectedClass:
      "border-orange-600/30 bg-orange-600/10 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400",
    dotClass: "bg-orange-600 dark:bg-orange-500",
  },
  {
    type: "Action",
    icon: Play,
    selectedClass:
      "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400",
    dotClass: "bg-sky-600 dark:bg-sky-500",
  },
  {
    type: "Question",
    icon: HelpCircle,
    selectedClass:
      "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
    dotClass: "bg-rose-600 dark:bg-rose-500",
  },
];

const CARD_TYPE_TO_API: Record<
  CardType,
  "insight" | "change" | "action" | "question"
> = {
  Insight: "insight",
  Change: "change",
  Action: "action",
  Question: "question",
};

type Props = {
  bookId: number;
};

const CARD_TYPE_HELPER: Record<CardType, string> = {
  Insight: "책에서 얻은 통찰이나 새롭게 이해한 관점을 남겨보세요.",
  Change: "내 생각이 달라진 지점이나 흔들린 믿음을 적어보세요.",
  Action: "읽고 나서 바로 해보고 싶은 행동이나 실천을 적어보세요.",
  Question: "더 생각해보고 싶은 질문이나 남은 의문을 적어보세요.",
};

type CardDraft = {
  selectedType: CardType;
  quote: string;
  pageStart: string;
  pageEnd: string;
  thought: string;
};

export function CreateCardModal({ bookId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>("Insight");
  const [quote, setQuote] = useState("");
  const [pageStart, setPageStart] = useState("");
  const [pageEnd, setPageEnd] = useState("");
  const [thought, setThought] = useState("");

  const createCard = useBookCardCreateMutation();
  const draftStorageKey = useMemo(
    () => `create-card-draft:${bookId}`,
    [bookId]
  );

  const resetForm = () => {
    setSelectedType("Insight");
    setQuote("");
    setPageStart("");
    setPageEnd("");
    setThought("");
  };

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(draftStorageKey);
  };

  const restoreDraft = () => {
    if (typeof window === "undefined") return false;

    const rawDraft = window.sessionStorage.getItem(draftStorageKey);
    if (!rawDraft) return false;

    try {
      const draft = JSON.parse(rawDraft) as Partial<CardDraft>;
      setSelectedType(draft.selectedType ?? "Insight");
      setQuote(draft.quote ?? "");
      setPageStart(draft.pageStart ?? "");
      setPageEnd(draft.pageEnd ?? "");
      setThought(draft.thought ?? "");
      return true;
    } catch {
      window.sessionStorage.removeItem(draftStorageKey);
      return false;
    }
  };

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const draft: CardDraft = {
      selectedType,
      quote,
      pageStart,
      pageEnd,
      thought,
    };

    const isEmpty =
      !draft.quote.trim() &&
      !draft.pageStart &&
      !draft.pageEnd &&
      !draft.thought.trim() &&
      draft.selectedType === "Insight";

    if (isEmpty) {
      window.sessionStorage.removeItem(draftStorageKey);
      return;
    }

    window.sessionStorage.setItem(draftStorageKey, JSON.stringify(draft));
  }, [draftStorageKey, open, pageEnd, pageStart, quote, selectedType, thought]);

  const getValidationError = () => {
    const thoughtTrimmed = thought.trim();

    if (thoughtTrimmed.length < 3) {
      return "생각은 3자 이상 입력해 주세요";
    }

    const startNumber = pageStart !== "" ? Number(pageStart) : null;
    const endNumber = pageEnd !== "" ? Number(pageEnd) : null;

    if (
      startNumber !== null &&
      endNumber !== null &&
      Number.isFinite(startNumber) &&
      Number.isFinite(endNumber) &&
      startNumber > endNumber
    ) {
      return "시작 페이지는 끝 페이지보다 클 수 없어요";
    }

    return null;
  };

  const applyDraft = (draft: CardDraft) => {
    setSelectedType(draft.selectedType);
    setQuote(draft.quote);
    setPageStart(draft.pageStart);
    setPageEnd(draft.pageEnd);
    setThought(draft.thought);
  };

  const handleSave = () => {
    const validationError = getValidationError();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const thoughtTrimmed = thought.trim();
    const payload = {
      path: { bookId },
      body: {
        type: CARD_TYPE_TO_API[selectedType],
        thought: thoughtTrimmed,
        ...(quote.trim() && { quote: quote.trim() }),
        ...(pageStart !== "" && { pageStart: Number(pageStart) }),
        ...(pageEnd !== "" && { pageEnd: Number(pageEnd) }),
      },
    } as const;

    const submittedDraft: CardDraft = {
      selectedType,
      quote,
      pageStart,
      pageEnd,
      thought,
    };

    setOpen(false);
    resetForm();

    createCard.mutate(payload, {
      onSuccess: (card) => {
        clearDraft();
        toast.success("카드를 저장했어요.", {
          action: {
            label: "방금 카드 보기",
            onClick: () => router.push(`/cards/${card.id}`),
          },
        });
      },
      onError: () => {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(
            draftStorageKey,
            JSON.stringify(submittedDraft)
          );
        }
        applyDraft(submittedDraft);
        setOpen(true);
        toast.error("카드 저장에 실패했습니다.");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          restoreDraft();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full gap-2 sm:w-auto">카드 추가</Button>
      </DialogTrigger>
      <DialogContent className="flex w-[92vw] max-h-[90vh] flex-col max-w-none overflow-hidden p-0 sm:max-w-[720px] lg:max-w-[820px]">
        <div className="flex shrink-0 items-start justify-between px-5 pb-4 pt-6 sm:px-8 sm:pt-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              새 읽기 카드
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              인사이트, 변화, 액션, 질문을 남겨보세요.
            </DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6 custom-scrollbar sm:px-8">
          <div className="flex flex-col gap-8 pt-4">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                타입 선택
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {cardTypes.map((card) => {
                  const isSelected = card.type === selectedType;
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setSelectedType(card.type)}
                      className={cn(
                        "relative flex h-[100px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-all hover:-translate-y-1 hover:shadow-sm",
                        isSelected
                          ? card.selectedClass
                          : "border-border/60 bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                      )}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? (
                        <span
                          className={cn(
                            "absolute right-2 top-2 h-1.5 w-1.5 rounded-full",
                            card.dotClass
                          )}
                        />
                      ) : null}
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-semibold">{card.type}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                {CARD_TYPE_HELPER[selectedType]}
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                원문
                <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                  (선택)
                </span>
              </label>
              <Textarea
                placeholder="책에서 발췌한 문장이나 하이라이트를 붙여넣으세요..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="min-h-[120px] rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm font-serif italic text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[140px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                페이지 / 위치
                <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                  (선택)
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
                  <Input
                    type="number"
                    min={1}
                    placeholder="시작"
                    value={pageStart}
                    onChange={(e) => setPageStart(e.target.value)}
                    className="w-full rounded-xl border-border/70 bg-muted/30 text-sm sm:w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">
                    –
                  </span>
                  <Input
                    type="number"
                    min={1}
                    placeholder="끝"
                    value={pageEnd}
                    onChange={(e) => setPageEnd(e.target.value)}
                    className="w-full rounded-xl border-border/70 bg-muted/30 text-sm sm:w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  한 페이지만 해당하면 끝은 비워두세요
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />내 생각
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (필수)
                  </span>
                </label>
                <span className="text-[10px] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground/80">
                    Tab
                  </span>
                  으로 전환
                </span>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="생각을 적어보세요..."
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  className="min-h-[200px] rounded-xl border-border/70 bg-muted/30 px-4 py-3.5 text-base font-serif text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[240px] sm:px-5 sm:py-4 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                임시 저장돼요. 닫았다가 다시 열어도 이어서 작성할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-4 border-t border-border/70 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                Esc
              </kbd>
              닫기
            </span>
            <span className="flex items-center gap-2">
              <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                ⌘
              </kbd>
              +
              <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                Enter
              </kbd>
              저장
            </span>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={Boolean(getValidationError()) || createCard.isPending}
            >
              {createCard.isPending ? "저장 중…" : "카드 저장"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
