import dayjs from "dayjs";
import Link from "next/link";
import { ArrowLeft, BookOpenText } from "lucide-react";

import type { CommunityPostDetail } from "@/entities/community/model/types";
import { getInitials } from "@/entities/community/lib/community-post-reader";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

type CommunityPostHeroProps = {
  post: CommunityPostDetail;
  isOwner: boolean;
};

export function CommunityPostHero({ post, isOwner }: CommunityPostHeroProps) {
  const description = post.caption?.trim() || post.deckDescription?.trim();
  const deckSize =
    post.deckMode === "graph"
      ? `${post.snapshot.nodes.length}개 노드`
      : `${post.snapshot.nodes.filter((node) => node.type === "card").length}개 카드`;

  return (
    <header className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#77726b] transition-colors hover:text-[#292724] dark:text-[#aaa49b] dark:hover:text-[#ebe7df]"
        >
          <ArrowLeft className="h-4 w-4" />
          공개 덱으로
        </Link>

        {isOwner ? (
          <Link
            href={`/decks/${post.deckId}`}
            className="text-sm font-medium text-[#a45138] underline-offset-4 hover:underline dark:text-[#d77b5e]"
          >
            원본 덱 보기
          </Link>
        ) : null}
      </div>

      <div className="mt-10 min-w-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-[#77726b] dark:text-[#aaa49b]">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarImage
                src={post.author.profile ?? undefined}
                alt={post.author.name}
              />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-[#292724] dark:text-[#ebe7df]">
                {post.author.name}
              </p>
              <p>{dayjs(post.createdAt).format("YYYY.MM.DD")}</p>
            </div>
          </div>

          {post.bookTitle ? (
            <div className="flex items-center gap-2">
              <BookOpenText className="h-4 w-4 text-[#a45138] dark:text-[#d77b5e]" />
              <p>
                <span className="font-medium text-[#292724] dark:text-[#ebe7df]">
                  {post.bookTitle}
                </span>
                {post.bookAuthor ? ` · ${post.bookAuthor}` : null}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-9 text-xs text-[#77726b] dark:text-[#aaa49b]">
          <h1 className="break-words font-serif text-3xl font-semibold leading-snug text-[#292724] [overflow-wrap:anywhere] dark:text-[#ebe7df]">
            {post.deckName}
          </h1>
          <p className="mt-2">
            {post.deckMode === "graph" ? "그래프 덱" : "리스트 덱"} · {deckSize}
          </p>
          {description ? (
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#514d47] dark:text-[#cbc5bc]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
