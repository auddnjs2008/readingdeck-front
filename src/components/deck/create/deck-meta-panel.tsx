"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      <DialogHeader className="gap-2 border-b border-border px-6 py-5 text-left">
        <DialogTitle className="text-xl font-semibold">덱 정보</DialogTitle>
        <DialogDescription>
          제목과 설명은 리스트/그래프 모드에서 공통으로 사용됩니다.
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
            className="min-h-36"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border bg-background/80 px-6 py-4">
        <Button variant="ghost" onClick={() => attemptClose()}>
          닫기
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
      <DialogContent className="w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-2xl border-border bg-card p-0 shadow-2xl">
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
