"use client";

import { useId, useRef, useState } from "react";
import {
  Dialog, DialogCloseButton, DialogContent, DialogDescription, DialogTitle,
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

function DeckMetaForm({ title, description, onApply, onClose }: Omit<Props, "open">) {
  const [titleDraft, setTitleDraft] = useState(title);
  const [descriptionDraft, setDescriptionDraft] = useState(description);
  const [submitted, setSubmitted] = useState(false);
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const titleInvalid = submitted && !titleDraft.trim();

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      setSubmitted(true);
      const trimmedTitle = titleDraft.trim();
      if (!trimmedTitle) {
        const input = event.currentTarget.elements.namedItem(titleId);
        if (input instanceof HTMLInputElement) input.focus();
        return;
      }
      onApply({ title: trimmedTitle, description: descriptionDraft });
      onClose();
    }}>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <DialogTitle className="font-serif text-2xl! font-normal! tracking-normal! leading-snug!">덱 정보</DialogTitle>
          <DialogDescription className="mt-3 leading-relaxed">제목과 설명</DialogDescription>
        </div>
        <DialogCloseButton aria-label="닫기" className="-mr-2 -mt-2 shrink-0" />
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor={titleId} className="block text-sm font-medium">제목</label>
          <Input
            id={titleId}
            value={titleDraft}
            maxLength={255}
            onChange={(event) => setTitleDraft(event.target.value)}
            placeholder="덱 제목"
            aria-invalid={titleInvalid}
            aria-describedby={titleInvalid ? `${titleId}-error` : undefined}
            className="rounded-[6px]!"
          />
          {titleInvalid ? (
            <p id={`${titleId}-error`} role="alert" className="text-sm text-destructive">
              덱 제목을 입력해 주세요.
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label htmlFor={descriptionId} className="block text-sm font-medium">
            설명 <span className="ml-1 font-normal text-muted-foreground">선택</span>
          </label>
          <Textarea
            id={descriptionId}
            value={descriptionDraft}
            maxLength={500}
            onChange={(event) => setDescriptionDraft(event.target.value)}
            placeholder="덱에 대한 짧은 소개"
            aria-describedby={`${descriptionId}-count`}
            className="min-h-36 rounded-[6px]! leading-7"
          />
          <p id={`${descriptionId}-count`} className="text-right text-xs tabular-nums text-muted-foreground">
            {descriptionDraft.length} / 500
          </p>
        </div>
      </div>
      <div className="mt-7 flex justify-end gap-2">
        <Button type="button" variant="ghost" className="rounded-[6px]!" onClick={onClose}>취소</Button>
        <Button type="submit" className="rounded-[6px]! px-6">적용</Button>
      </div>
    </form>
  );
}

export default function DeckMetaPanel({ open, title, description, onClose, onApply }: Props) {
  const triggerRef = useRef<HTMLElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto rounded-[8px]! bg-background! p-6 sm:p-8"
        onOpenAutoFocus={() => {
          triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        {open ? <DeckMetaForm title={title} description={description} onApply={onApply} onClose={onClose} /> : null}
      </DialogContent>
    </Dialog>
  );
}
