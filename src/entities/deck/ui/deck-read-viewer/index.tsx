"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import CommunityUnshareDialog from "@/features/deck/unshare-community/ui";
import CommunityShareDialog from "@/features/deck/share-community/ui";
import type { ResGetDeckDetail } from "@/entities/deck/api/getDeckDetail";
import { useCommunityPostCreateMutation } from "@/entities/community/model/queries/useCommunityPostCreateMutation";
import { useCommunityPostDeleteMutation } from "@/entities/community/model/queries/useCommunityPostDeleteMutation";
import {
  getOrderedCardNodes,
  type ReadView,
} from "@/entities/deck/lib/deck-read-viewer";
import { DeckReadCardList } from "@/entities/deck/ui/deck-read-card-list";
import { DeckReadGraphView } from "@/entities/deck/ui/deck-read-graph-view";
import { DeckReadHero } from "@/entities/deck/ui/deck-read-hero";
import { DeckReadViewTabs } from "@/entities/deck/ui/deck-read-view-tabs";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { ScrollToTopButton } from "@/shared/ui/scroll-to-top-button";

type DeckReadViewerProps = {
  deck: ResGetDeckDetail;
};

export function DeckReadViewer({ deck }: DeckReadViewerProps) {
  const isDesktop = useMediaQuery();
  const shareMutation = useCommunityPostCreateMutation();
  const unshareMutation = useCommunityPostDeleteMutation();
  const [manualView, setManualView] = useState<ReadView | null>(null);
  const [unshareDialogOpen, setUnshareDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const shareTriggerRef = useRef<HTMLElement | null>(null);

  const orderedCardNodes = useMemo(
    () => getOrderedCardNodes(deck.nodes),
    [deck.nodes]
  );
  const defaultView: ReadView = deck.mode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const heroDescription = deck.description?.trim() ?? null;

  const handleCommunityShare = async (caption: string) => {
    try {
      await shareMutation.mutateAsync({
        body: {
          deckId: deck.id,
          caption: caption || undefined,
        },
      });
      setShareDialogOpen(false);
      toast.success("덱을 공개했습니다.");
    } catch {
      toast.error("덱 공개에 실패했습니다.");
    }
  };

  const handleCommunityUnshare = async () => {
    if (!deck.sharedPostId) return;

    try {
      await unshareMutation.mutateAsync({
        path: {
          postId: deck.sharedPostId,
        },
      });
      setUnshareDialogOpen(false);
      toast.success("덱 공개를 취소했습니다.");
    } catch {
      toast.error("공유 취소에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4] text-[#292724] dark:bg-[#242320] dark:text-[#ebe7df]">
      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-5 py-10 md:px-8 md:py-14">
        <DeckReadHero
          deck={deck}
          isDesktop={isDesktop}
          isShared={deck.isShared}
          isSharePending={shareMutation.isPending}
          isUnsharePending={unshareMutation.isPending}
          onShareClick={() => {
            shareTriggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            setShareDialogOpen(true);
          }}
          onUnshareClick={() => setUnshareDialogOpen(true)}
        />

        <header className="min-w-0">
          <h1 className="max-w-4xl break-keep font-serif text-3xl font-semibold leading-snug [overflow-wrap:anywhere]">
            {deck.name}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {deck.mode === "graph" ? "그래프 덱" : "목록 덱"} · 카드 {orderedCardNodes.length}개
          </p>
          {heroDescription ? (
            <p className="mt-5 max-w-3xl whitespace-pre-line break-words text-sm leading-7 text-muted-foreground [overflow-wrap:anywhere] md:text-base">
              {heroDescription}
            </p>
          ) : null}
        </header>
        <section className="min-w-0">
          {deck.mode === "graph" ? (
            <DeckReadViewTabs activeView={activeView} onViewChange={setManualView} />
          ) : null}
          <div className={activeView === "list" ? "mx-auto max-w-3xl py-8" : "py-8"}>
            {activeView === "list" ? (
              <DeckReadCardList nodes={deck.nodes} />
            ) : (
              <DeckReadGraphView deck={deck} onListViewClick={() => setManualView("list")} />
            )}
          </div>
        </section>
      </main>

      {shareDialogOpen ? (
        <CommunityShareDialog
          deckName={deck.name}
          isPending={shareMutation.isPending}
          onClose={() => setShareDialogOpen(false)}
          onRestoreFocus={() => shareTriggerRef.current?.focus()}
          onConfirm={handleCommunityShare}
        />
      ) : null}
      <CommunityUnshareDialog
        open={unshareDialogOpen}
        isPending={unshareMutation.isPending}
        onOpenChange={setUnshareDialogOpen}
        onConfirm={handleCommunityUnshare}
      />
      {activeView === "list" ? <ScrollToTopButton /> : null}
    </div>
  );
}
