"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "sonner";
import { useBookCardCreateMutation } from "@/entities/book/model/queries/useBookCardCreateMutation";

type CardType = "Insight" | "Change" | "Action" | "Question";

const cardTypes: Array<{
  type: CardType;
  label: string;
}> = [
  { type: "Insight", label: "인사이트" },
  { type: "Change", label: "변화" },
  { type: "Action", label: "행동" },
  { type: "Question", label: "질문" },
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
  title: string;
  quote: string;
  pageStart: string;
  pageEnd: string;
  thought: string;
};

export function CreateCardModal({ bookId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>("Insight");
  const [title, setTitle] = useState("");
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
    setTitle("");
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
      setTitle(draft.title ?? "");
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
      title,
      quote,
      pageStart,
      pageEnd,
      thought,
    };

    const isEmpty =
      !draft.title.trim() &&
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
  }, [
    draftStorageKey,
    open,
    pageEnd,
    pageStart,
    quote,
    selectedType,
    thought,
    title,
  ]);

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
    setTitle(draft.title);
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
        ...(title.trim() && { title: title.trim() }),
        thought: thoughtTrimmed,
        ...(quote.trim() && { quote: quote.trim() }),
        ...(pageStart !== "" && { pageStart: Number(pageStart) }),
        ...(pageEnd !== "" && { pageEnd: Number(pageEnd) }),
      },
    } as const;

    const submittedDraft: CardDraft = {
      selectedType,
      title,
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
      <DialogContent className="flex max-h-[90vh] w-[92vw] max-w-none flex-col overflow-hidden border-border bg-background p-0 sm:max-w-[680px]">
        <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-6 sm:px-8 sm:py-7">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">
              새 읽기 카드
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              읽으며 붙잡은 문장과 생각을 남겨보세요.
            </DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-7">
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">
                카드 유형
              </legend>
              <div className="grid grid-cols-2 border border-border sm:grid-cols-4">
                {cardTypes.map(({ type, label }, index) => (
                  <label
                    key={type}
                    className={`relative flex min-h-12 cursor-pointer items-center justify-center border-border text-sm text-muted-foreground transition-colors has-[:focus-visible]:z-10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring ${index < 2 ? "border-b " : ""}${index % 2 === 0 ? "border-r " : ""}sm:border-b-0 ${index < 3 ? "sm:border-r" : ""}`}
                  >
                    <input
                      type="radio"
                      name="card-type"
                      value={type}
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-transparent peer-checked:bg-muted/60"
                    />
                    <span className="relative z-10 peer-checked:text-foreground">
                      {label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1.5 left-1/2 z-10 h-1 w-1 -translate-x-1/2 rounded-full bg-transparent peer-checked:bg-primary"
                    />
                  </label>
                ))}
              </div>
              <p className="min-h-5 text-xs text-muted-foreground">
                {CARD_TYPE_HELPER[selectedType]}
              </p>
            </fieldset>

            <div className="space-y-3">
              <label
                htmlFor="card-title"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                제목
                <span className="text-xs font-normal text-muted-foreground">
                  (선택)
                </span>
              </label>
              <Input
                id="card-title"
                placeholder="이 카드의 핵심을 한 줄로 적어보세요..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="card-quote"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                원문 인용
                <span className="text-xs font-normal text-muted-foreground">
                  (선택)
                </span>
              </label>
              <Textarea
                id="card-quote"
                placeholder="책에서 발췌한 문장이나 하이라이트를 붙여넣으세요..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="min-h-[120px] rounded-none border-y-0 border-r-0 border-l-2 border-l-primary/50 bg-muted/20 px-4 py-3 font-serif text-sm italic leading-7 shadow-none placeholder:text-muted-foreground/70 focus-visible:border-l-primary focus-visible:ring-0 sm:min-h-[140px]"
              />
            </div>

            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                페이지 / 위치
                <span className="text-xs font-normal text-muted-foreground">
                  (선택)
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial">
                  <Input
                    aria-label="시작 페이지"
                    type="number"
                    min={1}
                    placeholder="시작"
                    value={pageStart}
                    onChange={(e) => setPageStart(e.target.value)}
                    className="w-full rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0 sm:w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">
                    –
                  </span>
                  <Input
                    aria-label="끝 페이지"
                    type="number"
                    min={1}
                    placeholder="끝"
                    value={pageEnd}
                    onChange={(e) => setPageEnd(e.target.value)}
                    className="w-full rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0 sm:w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  한 페이지만 해당하면 끝은 비워두세요
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="card-thought"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                내 생각
                <span className="text-xs font-normal text-muted-foreground">
                  (필수)
                </span>
              </label>
              <Textarea
                id="card-thought"
                placeholder="생각을 적어보세요..."
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                className="min-h-[200px] rounded-none border-border bg-transparent px-4 py-3.5 font-serif text-base leading-8 shadow-none placeholder:text-muted-foreground/70 sm:min-h-[240px] sm:px-5 sm:py-4"
              />
              <p className="text-xs text-muted-foreground">
                임시 저장돼요. 닫았다가 다시 열어도 이어서 작성할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-5 py-5 sm:px-8">
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
      </DialogContent>
    </Dialog>
  );
}
