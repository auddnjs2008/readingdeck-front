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
  const quote = post.primaryQuote?.trim();
  const thought = post.primaryThought.trim();
  const caption = post.caption?.trim();
  const description = post.deckDescription?.trim();
  const hasDistinctThought = quote && thought && thought !== quote;
  const hasDistinctCaption =
    caption && caption !== quote && caption !== thought;
  const hasDistinctDescription =
    description &&
    description !== quote &&
    description !== thought &&
    description !== caption;
  const deckSize =
    post.deckMode === "graph"
      ? `${post.snapshot.nodes.length}개 노드`
      : `${post.snapshot.nodes.filter((node) => node.type === "card").length}개 카드`;

  return (
    <header className="border-b border-[#d8d4cc] pb-10 dark:border-[#4b4842]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#77726b] transition-colors hover:text-[#292724] dark:text-[#aaa49b] dark:hover:text-[#ebe7df]"
        >
          <ArrowLeft className="h-4 w-4" />
          커뮤니티로
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

        {quote ? (
          <blockquote className="mt-10 whitespace-pre-line font-serif text-3xl leading-relaxed text-[#292724] dark:text-[#ebe7df] md:text-4xl">
            “{quote}”
          </blockquote>
        ) : (
          <p className="mt-10 whitespace-pre-line font-serif text-3xl leading-relaxed text-[#292724] dark:text-[#ebe7df] md:text-4xl">
            {thought}
          </p>
        )}

        {hasDistinctThought ? (
          <p className="mt-7 whitespace-pre-line text-base leading-8 text-[#514d47] dark:text-[#cbc5bc]">
            {thought}
          </p>
        ) : null}

        {hasDistinctCaption ? (
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#77726b] dark:text-[#aaa49b]">
            {caption}
          </p>
        ) : null}

        {hasDistinctDescription ? (
          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#77726b] dark:text-[#aaa49b]">
            {description}
          </p>
        ) : null}

        <div className="mt-9 border-t border-[#d8d4cc] pt-5 text-xs text-[#77726b] dark:border-[#4b4842] dark:text-[#aaa49b]">
          <h1 className="font-serif text-base font-semibold text-[#292724] dark:text-[#ebe7df]">
            {post.deckName}
          </h1>
          <p className="mt-1">
            {post.deckMode === "graph" ? "그래프 덱" : "리스트 덱"} · {deckSize}
          </p>
        </div>
      </div>
    </header>
  );
}
