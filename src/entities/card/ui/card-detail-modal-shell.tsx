"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";

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
      <DialogContent className="max-h-[90vh] w-[94vw] max-w-[860px] overflow-hidden rounded-lg border-[#dedbd3] bg-[#f9f8f4] p-0 text-[#292724] shadow-lg dark:border-[#3a3834] dark:bg-[#242320] dark:text-[#ebe7df]">
        <DialogTitle className="sr-only">카드 상세</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
