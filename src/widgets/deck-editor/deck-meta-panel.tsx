"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

type Props = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onApply: (payload: { title: string; description: string }) => void;
};

export type DeckMetaFormRef = { attemptClose: () => boolean };

const DeckMetaForm = forwardRef<
  DeckMetaFormRef,
  { title: string; description: string; onApply: Props["onApply"]; onClose: () => void }
>(function DeckMetaForm({ title, description, onApply, onClose }, ref) {
  const [titleDraft, setTitleDraft] = useState(title);
  const [descriptionDraft, setDescriptionDraft] = useState(description);

  const attemptClose = () => {
    const trimmedTitle = titleDraft.trim();
    if (!trimmedTitle) {
      toast.error("덱 제목을 입력해 주세요");
      return false;
    }
    onApply({ title: trimmedTitle, description: descriptionDraft });
    onClose();
    return true;
  };

  useImperativeHandle(ref, () => ({ attemptClose }));

  return (
    <div className="flex flex-col">
      <DialogHeader className="gap-2 px-6 pb-4 pt-6 text-left">
        <DialogTitle className="font-serif text-2xl font-normal">덱 정보</DialogTitle>
        <DialogDescription>
          이 덱을 다시 알아볼 수 있는 제목과 짧은 설명을 남겨주세요.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 px-6 py-6">
        <div className="space-y-2">
          <label
            htmlFor="deck-meta-title"
            className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
          >
            제목
          </label>
          <Input
            id="deck-meta-title"
            value={titleDraft}
            maxLength={255}
            onChange={(event) => setTitleDraft(event.target.value)}
            placeholder="덱 제목을 입력하세요"
            className="rounded-none border-x-0 border-t-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="deck-meta-description"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
            >
              설명
            </label>
            <span className="text-xs text-muted-foreground">
              {descriptionDraft.length}/500
            </span>
          </div>
          <Textarea
            id="deck-meta-description"
            value={descriptionDraft}
            maxLength={500}
            onChange={(event) => setDescriptionDraft(event.target.value)}
            placeholder="이 덱을 왜 만들었는지 간단히 적어보세요. 예: 습관 형성과 행동 설계에 대한 책 인사이트 정리"
            className="min-h-36 rounded-md shadow-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end px-6 pb-6">
        <Button className="rounded-md px-6" onClick={() => attemptClose()}>
          적용
        </Button>
      </div>
    </div>
  );
});

export default function DeckMetaPanel({
  open,
  title,
  description,
  onClose,
  onApply,
}: Props) {
  const formRef = useRef<DeckMetaFormRef>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) formRef.current?.attemptClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-md border-border bg-card p-0 shadow-xl">
        {open && (
          <DeckMetaForm
            ref={formRef}
            title={title}
            description={description}
            onApply={onApply}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
