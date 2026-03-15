"use client";

import { useState } from "react";
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

const CARD_TYPE_TO_API: Record<CardType, "insight" | "change" | "action" | "question"> = {
  Insight: "insight",
  Change: "change",
  Action: "action",
  Question: "question",
};

type Props = {
  bookId: number;
};

export function CreateCardModal({ bookId }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>("Insight");
  const [quote, setQuote] = useState("");
  const [pageStart, setPageStart] = useState("");
  const [pageEnd, setPageEnd] = useState("");
  const [thought, setThought] = useState("");

  const createCard = useBookCardCreateMutation();

  const resetForm = () => {
    setSelectedType("Insight");
    setQuote("");
    setPageStart("");
    setPageEnd("");
    setThought("");
  };

  const handleSave = () => {
    const thoughtTrimmed = thought.trim();
    if (!thoughtTrimmed) {
      toast.error("생각을 입력해 주세요");
      return;
    }

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

    resetForm();
    setOpen(false);

    createCard.mutate(
      payload,
      {
        onError: () => {
          toast.error("카드 저장에 실패했습니다.");
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">카드 추가</Button>
      </DialogTrigger>
      <DialogContent className="flex w-[92vw] max-h-[90vh] flex-col max-w-none overflow-hidden p-0 sm:max-w-[720px] lg:max-w-[820px]">
        <div className="flex shrink-0 items-start justify-between px-8 pb-4 pt-8">
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

        <div className="flex-1 overflow-y-auto px-8 pb-6 custom-scrollbar">
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
                className="min-h-[140px] rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm font-serif italic text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
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
                  <span className="shrink-0 text-sm text-muted-foreground">–</span>
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
                  <MessageSquare className="h-4 w-4" />
                  내 생각
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
                  className="min-h-[240px] rounded-xl border-border/70 bg-muted/30 px-5 py-4 text-base font-serif text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-4 border-t border-border/70 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
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
              disabled={!thought.trim() || createCard.isPending}
            >
              {createCard.isPending ? "저장 중…" : "카드 저장"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
