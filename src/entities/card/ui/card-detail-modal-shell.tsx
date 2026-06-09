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
      <DialogContent className="max-h-[90vh] w-[94vw] max-w-[860px] overflow-hidden border-border/70 bg-card p-0 shadow-[0_24px_60px_rgba(63,54,49,0.14)]">
        <DialogTitle className="sr-only">카드 상세</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
