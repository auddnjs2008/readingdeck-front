"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpenText } from "lucide-react";

import CommunityUnshareDialog from "@/features/deck/unshare-community/ui";
import type { ResGetDeckDetail } from "@/entities/deck/api/getDeckDetail";
import { RQdeckQueryKey } from "@/entities/deck/model/queries/RQdeckQueryKey";
import { useCommunityPostCreateMutation } from "@/entities/community/model/queries/useCommunityPostCreateMutation";
import { useCommunityPostDeleteMutation } from "@/entities/community/model/queries/useCommunityPostDeleteMutation";
import {
  buildGraphPreview,
  getOrderedCardNodes,
  MODE_COPY,
  type ReadView,
  toMobileGraphEntries,
} from "@/entities/deck/lib/deck-read-viewer";
import { DeckReadCardList } from "@/entities/deck/ui/deck-read-card-list";
import { DeckReadGraphView } from "@/entities/deck/ui/deck-read-graph-view";
import { DeckReadHero } from "@/entities/deck/ui/deck-read-hero";
import { DeckReadViewTabs } from "@/entities/deck/ui/deck-read-view-tabs";
import MobileGraphDeckView from "@/entities/deck/ui/mobile-graph-deck-view";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { ScrollToTopButton } from "@/shared/ui/scroll-to-top-button";

type DeckReadViewerProps = {
  deck: ResGetDeckDetail;
};

export function DeckReadViewer({ deck }: DeckReadViewerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery();
  const shareMutation = useCommunityPostCreateMutation();
  const unshareMutation = useCommunityPostDeleteMutation();
  const [manualView, setManualView] = useState<ReadView | null>(null);
  const [unshareDialogOpen, setUnshareDialogOpen] = useState(false);
  const [shareState, setShareState] = useState({
    isShared: deck.isShared,
    sharedPostId: deck.sharedPostId,
  });

  const orderedCardNodes = useMemo(
    () => getOrderedCardNodes(deck.nodes),
    [deck.nodes]
  );
  const graphPreview = useMemo(
    () => buildGraphPreview(deck.nodes, deck.connections),
    [deck.connections, deck.nodes]
  );
  const defaultView: ReadView = deck.mode === "graph" ? "graph" : "list";
  const activeView = manualView ?? defaultView;
  const deckCopy = MODE_COPY[deck.mode];
  const heroDescription = deck.description?.trim() ?? null;
  const mobileGraphEntries = useMemo(
    () => toMobileGraphEntries(deck.nodes),
    [deck.nodes]
  );
  const initialSelectedNodeId =
    orderedCardNodes[0]?.id ?? deck.nodes[0]?.id ?? null;

  const handleCommunityShare = async () => {
    try {
      const createdPost = await shareMutation.mutateAsync({
        body: {
          deckId: deck.id,
          caption: deck.description ?? undefined,
        },
      });
      setShareState({ isShared: true, sharedPostId: createdPost.id });
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.list() });
      router.refresh();
      toast.success("커뮤니티에 덱을 공유했습니다.");
    } catch {
      toast.error("커뮤니티 공유에 실패했습니다.");
    }
  };

  const handleCommunityUnshare = async () => {
    if (!shareState.sharedPostId) return;

    try {
      await unshareMutation.mutateAsync({
        path: {
          postId: shareState.sharedPostId,
        },
      });
      setShareState({ isShared: false, sharedPostId: null });
      queryClient.invalidateQueries({ queryKey: RQdeckQueryKey.list() });
      setUnshareDialogOpen(false);
      router.refresh();
      toast.success("커뮤니티 공유를 취소했습니다.");
    } catch {
      toast.error("공유 취소에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-10 md:px-10 xl:px-16">
        <DeckReadHero
          deck={deck}
          isDesktop={isDesktop}
          isShared={shareState.isShared}
          isSharePending={shareMutation.isPending}
          isUnsharePending={unshareMutation.isPending}
          onShareClick={() => void handleCommunityShare()}
          onUnshareClick={() => setUnshareDialogOpen(true)}
        />

        {deck.mode === "graph" && !isDesktop ? (
          <MobileGraphDeckView
            modeLabel={deckCopy.label}
            statusLabel="Published"
            title={deck.name}
            description={heroDescription}
            entries={mobileGraphEntries}
            previewNodes={graphPreview.nodes}
            previewEdges={graphPreview.edges}
            initialSelectedId={initialSelectedNodeId}
            emptyMessage="그래프 미리보기를 만들 수 있는 노드가 없습니다."
          />
        ) : (
          <section className="overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_14px_40px_rgba(63,54,49,0.08)]">
            <div className="border-b border-border bg-[radial-gradient(circle_at_top_left,rgba(184,115,51,0.12),transparent_42%),linear-gradient(180deg,rgba(250,246,242,0.6),transparent)] px-6 py-8 md:px-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {deckCopy.label}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground">
                  <BookOpenText className="h-4 w-4" />
                  카드 {orderedCardNodes.length}개
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-bold tracking-tight font-serif md:text-[2.5rem]">
                {deck.name}
              </h1>

              {heroDescription ? (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                  {heroDescription}
                </p>
              ) : null}
            </div>

            {deck.mode === "graph" ? (
              <DeckReadViewTabs
                activeView={activeView}
                onViewChange={setManualView}
              />
            ) : null}

            <div className="px-6 py-8 md:px-8">
              {activeView === "list" ? (
                <DeckReadCardList nodes={deck.nodes} />
              ) : (
                <DeckReadGraphView
                  deck={deck}
                  onListViewClick={() => setManualView("list")}
                />
              )}
            </div>
          </section>
        )}
      </main>

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
