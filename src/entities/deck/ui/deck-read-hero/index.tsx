"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PenSquare, Share2 } from "lucide-react";

import type { ResGetDeckDetail } from "@/entities/deck/api/getDeckDetail";
import { Button } from "@/shared/ui/button";

type DeckReadHeroProps = {
  deck: ResGetDeckDetail;
  isDesktop: boolean;
  isShared: boolean;
  isSharePending: boolean;
  isUnsharePending: boolean;
  onShareClick: () => void;
  onUnshareClick: () => void;
};

export function DeckReadHero({
  deck,
  isDesktop,
  isShared,
  isSharePending,
  isUnsharePending,
  onShareClick,
  onUnshareClick,
}: DeckReadHeroProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href="/decks"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />덱 목록으로
      </Link>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isShared ? "outline" : "secondary"}
          className="gap-2"
          onClick={() => {
            if (isShared) {
              onUnshareClick();
              return;
            }
            onShareClick();
          }}
          disabled={isSharePending || isUnsharePending}
        >
          <Share2 className="h-4 w-4" />
          {isShared
            ? isUnsharePending
              ? "취소 중..."
              : "공유 취소"
            : isSharePending
              ? "공유 중..."
              : "커뮤니티 공유"}
        </Button>

        {isDesktop ? (
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => router.push(`/decks/${deck.id}/edit`)}
          >
            <PenSquare className="h-4 w-4" />
            편집하기
          </Button>
        ) : null}
      </div>
    </div>
  );
}
