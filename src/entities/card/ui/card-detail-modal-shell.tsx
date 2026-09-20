"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";

type CardDetailModalShellProps = {
  children: React.ReactNode;
  shouldWarn?: boolean;
  onCloseConfirmed?: () => void;
  compact?: boolean;
};

export default function CardDetailModalShell({
  children,
  shouldWarn = false,
  onCloseConfirmed,
  compact = false,
}: CardDetailModalShellProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          if (shouldWarn && !window.confirm("저장하지 않은 생각이 있어요. 닫을까요?")) return;
          onCloseConfirmed?.();
          router.back();
        }
      }}
    >
      <DialogContent className={`flex max-h-[90dvh] w-[94vw] ${compact ? "max-w-[640px]" : "max-w-[960px]"} flex-col overflow-hidden rounded-lg border-[#dedbd3] bg-[#f9f8f4] p-0 text-[#292724] shadow-lg dark:border-[#3a3834] dark:bg-[#242320] dark:text-[#ebe7df]`}>
        <div className="flex shrink-0 justify-end border-b border-[#8a857d] px-5 py-3 dark:border-[#77726b]">
          <DialogTitle className="sr-only">{compact ? "지금의 생각 남기기" : "카드 상세"}</DialogTitle>
          <DialogCloseButton className="h-10 w-10 text-[#746f68] hover:bg-black/5 hover:text-[#292724] dark:text-[#aaa49b] dark:hover:bg-white/5 dark:hover:text-[#ebe7df]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
