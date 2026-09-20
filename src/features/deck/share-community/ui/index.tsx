"use client";

import { useId, useState } from "react";
import { Globe, Loader2, Share2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

type CommunityShareDialogProps = {
  deckName: string;
  isPending: boolean;
  onClose: () => void;
  onRestoreFocus: () => void;
  onConfirm: (caption: string) => Promise<void>;
};

export default function CommunityShareDialog({
  deckName,
  isPending,
  onClose,
  onRestoreFocus,
  onConfirm,
}: CommunityShareDialogProps) {
  const [caption, setCaption] = useState("");
  const captionId = useId();

  return (
    <Dialog open onOpenChange={(open) => { if (!open && !isPending) onClose(); }}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] max-w-lg overflow-y-auto rounded-[8px]! bg-background! p-6 sm:p-8"
        onCloseAutoFocus={(event) => { event.preventDefault(); onRestoreFocus(); }}
      >
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <DialogTitle className="font-serif text-2xl! font-normal! tracking-normal! leading-snug!">
              덱 공개
            </DialogTitle>
            <DialogDescription className="mt-3 leading-relaxed">
              공유한 덱은 로그인하지 않은 사람도 볼 수 있습니다.
            </DialogDescription>
          </div>
          <DialogCloseButton disabled={isPending} aria-label="닫기" className="-mr-2 -mt-2 shrink-0" />
        </div>

        <div className="mb-7">
          <p className="break-words font-serif text-xl leading-relaxed [overflow-wrap:anywhere]">{deckName}</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="size-3.5" aria-hidden="true" /> 전체 공개
          </p>
        </div>

        <form onSubmit={(event) => {
          event.preventDefault();
          if (!isPending) void onConfirm(caption.trim());
        }}>
          <label htmlFor={captionId} className="mb-3 block text-sm font-medium">
            남길 글 <span className="ml-1 font-normal text-muted-foreground">선택</span>
          </label>
          <Textarea
            id={captionId}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={280}
            disabled={isPending}
            aria-describedby={`${captionId}-count`}
            placeholder="이 덱을 공유하는 이유나 함께 나누고 싶은 생각"
            className="min-h-36 leading-7"
          />
          <p id={`${captionId}-count`} className="mt-2 text-right text-xs tabular-nums text-muted-foreground">
            {caption.length} / 280
          </p>
          <div className="mt-7 flex justify-end gap-2">
            <Button type="button" variant="ghost" disabled={isPending} onClick={onClose} className="rounded-[6px]!">
              취소
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2 rounded-[6px]!">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}
              {isPending ? "공유 중..." : "공유하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
