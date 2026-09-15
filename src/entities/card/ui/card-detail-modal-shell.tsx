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
};

export default function CardDetailModalShell({
  children,
}: CardDetailModalShellProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          router.back();
        }
      }}
    >
      <DialogContent className="flex max-h-[90vh] w-[94vw] max-w-[960px] flex-col overflow-hidden rounded-lg border-[#dedbd3] bg-[#f9f8f4] p-0 text-[#292724] shadow-lg dark:border-[#3a3834] dark:bg-[#242320] dark:text-[#ebe7df]">
        <div className="flex shrink-0 justify-end border-b border-[#8a857d] px-5 py-3 dark:border-[#77726b]">
          <DialogTitle className="sr-only">카드 상세</DialogTitle>
          <DialogCloseButton className="h-10 w-10 text-[#746f68] hover:bg-black/5 hover:text-[#292724] dark:text-[#aaa49b] dark:hover:bg-white/5 dark:hover:text-[#ebe7df]" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
