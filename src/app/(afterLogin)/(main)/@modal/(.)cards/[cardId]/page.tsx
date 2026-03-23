"use client";

import { useParams, useRouter } from "next/navigation";

import CardDetailScene from "@/components/card/card-detail-scene";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function CardDetailModalPage() {
  const params = useParams<{ cardId: string }>();
  const router = useRouter();
  const cardId = Number(params?.cardId);

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
        <CardDetailScene cardId={cardId} asModal />
      </DialogContent>
    </Dialog>
  );
}
