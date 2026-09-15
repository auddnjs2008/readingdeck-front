"use client";

import Link from "next/link";
import dayjs from "dayjs";

import { getInitials } from "@/entities/community/lib/community-post-reader";
import type { CommunityPost } from "@/entities/community/model/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export function CommunityFeedCard({
  post,
  featured = false,
}: {
  post: CommunityPost;
  featured?: boolean;
}) {
  const deckMode = post.deckMode === "graph" ? "Graph" : "List";
  const deckSize =
    post.preview.kind === "list"
      ? `${post.preview.itemCount}개 카드`
      : `${post.preview.nodeCount}개 노드`;
  const quote = post.primaryQuote?.trim();
  const thought = post.primaryThought.trim();
  const hasDistinctThought = quote && thought !== quote;
  const caption = post.caption?.trim();
  const hasDistinctCaption =
    caption &&
    caption !== thought &&
    caption !== quote;

  return (
    <article className="h-full min-w-0 border-b border-[#d8d4cc] dark:border-[#4b4842]">
      <Link
        href={`/community/${post.id}`}
        className={`flex h-full min-w-0 flex-col wrap-anywhere focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a45138] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f8f4] dark:focus-visible:ring-[#d77b5e] dark:focus-visible:ring-offset-[#242320] ${
          featured ? "py-10 md:py-12" : "py-8"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="sm">
            <AvatarImage src={post.author.profile ?? undefined} alt={post.author.name} />
            <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-xs text-[#77726b] dark:text-[#aaa49b]">
            <p className="truncate font-semibold text-[#292724] dark:text-[#ebe7df]">
              {post.author.name}
            </p>
            <p>{dayjs(post.createdAt).format("YYYY.MM.DD")}</p>
          </div>
        </div>

        {quote ? (
          <>
            <blockquote
              className={`font-serif text-[#292724] dark:text-[#ebe7df] ${
                featured
                  ? "mt-8 line-clamp-5 max-w-4xl text-3xl leading-relaxed"
                  : "mt-6 line-clamp-4 text-xl leading-relaxed"
              }`}
            >
              “{quote}”
            </blockquote>
            {hasDistinctThought ? (
              <p className="mt-5 line-clamp-2 text-sm leading-7 text-[#514d47] dark:text-[#cbc5bc]">
                {thought}
              </p>
            ) : null}
          </>
        ) : (
          <p
            className={`font-serif text-[#292724] dark:text-[#ebe7df] ${
              featured
                ? "mt-8 line-clamp-5 max-w-4xl text-3xl leading-relaxed"
                : "mt-6 line-clamp-4 text-xl leading-relaxed"
            }`}
          >
            {thought}
          </p>
        )}

        {hasDistinctCaption ? (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#77726b] dark:text-[#aaa49b]">
            {caption}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-4 pt-7 text-xs text-[#77726b] dark:text-[#aaa49b]">
          <div className="min-w-0">
            {post.bookTitle ? <p className="truncate">{post.bookTitle}</p> : null}
            <p className="mt-1 truncate">
              {post.deckName} · {deckMode} · {deckSize}
            </p>
          </div>
          <span className="shrink-0 font-semibold text-[#a45138] dark:text-[#d77b5e]">
            덱 읽기 →
          </span>
        </div>
      </Link>
    </article>
  );
}
