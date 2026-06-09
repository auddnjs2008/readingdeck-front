import dayjs from "dayjs";
import Link from "next/link";
import { ArrowLeft, BookOpenText } from "lucide-react";

import type { CommunityPostDetail } from "@/entities/community/model/types";
import { getInitials } from "@/entities/community/lib/community-post-reader";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";

type CommunityPostHeroProps = {
  post: CommunityPostDetail;
  isOwner: boolean;
};

export function CommunityPostHero({ post, isOwner }: CommunityPostHeroProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          커뮤니티로
        </Link>

        {isOwner ? (
          <Button
            as={Link}
            href={`/decks/${post.deckId}`}
            variant="outline"
            size="sm"
          >
            원본 덱 보기
          </Button>
        ) : null}
      </div>

      <div className="border-b border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(193,92,61,0.12),transparent_30%),linear-gradient(180deg,rgba(238,229,221,0.82),rgba(215,201,190,0.52))] px-6 py-7 md:px-8 md:py-8">
        <div className="min-w-0 max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/70 bg-background/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {post.deckMode === "graph" ? "Graph deck" : "List deck"}
            </span>
            <span className="rounded-full border border-border/70 bg-background/78 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Shared snapshot
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight font-serif text-foreground md:text-5xl">
            {post.deckName}
          </h1>

          {post.caption ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/78 md:text-base">
              {post.caption}
            </p>
          ) : post.deckDescription ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/78 md:text-base">
              {post.deckDescription}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-foreground/72">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                <AvatarImage
                  src={post.author.profile ?? undefined}
                  alt={post.author.name}
                />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-foreground/64">
                  {dayjs(post.createdAt).format("YYYY.MM.DD")}
                </p>
              </div>
            </div>

            {post.bookTitle ? (
              <>
                <span className="hidden text-foreground/30 md:inline">·</span>
                <div className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4 text-primary" />
                  <p>
                    <span className="font-medium text-foreground">
                      {post.bookTitle}
                    </span>
                    {post.bookAuthor ? (
                      <span className="text-foreground/60">{` · ${post.bookAuthor}`}</span>
                    ) : null}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
