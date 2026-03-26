"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { ArrowUpRight, BookOpenText, Network, Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/components/ui/utils";
import type { CommunityPost } from "@/service/community/types";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

function CommunityPreview({ post }: { post: CommunityPost }) {
  if (post.preview.kind === "graph") {
    return (
      <div className="relative h-20 overflow-hidden rounded-[18px] border border-border/45 bg-[linear-gradient(180deg,rgba(244,238,232,0.78),rgba(228,216,207,0.62))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(193,92,61,0.14),transparent_42%)]" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {post.preview.edges.map((edge, index) => (
            <line
              key={`${post.id}-edge-${index}`}
              x1={edge.sx * 100}
              y1={edge.sy * 100}
              x2={edge.tx * 100}
              y2={edge.ty * 100}
              stroke="rgba(112,96,87,0.38)"
              strokeWidth="1.2"
            />
          ))}
          {post.preview.nodes.map((node, index) => (
            <circle
              key={`${post.id}-node-${index}`}
              cx={node.x * 100}
              cy={node.y * 100}
              r={node.t === "card" ? 2.9 : 2.1}
              fill={node.t === "card" ? "rgba(193,92,61,0.82)" : "rgba(99,85,76,0.52)"}
            />
          ))}
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2 text-[10px] text-[rgba(110,93,84,0.72)]">
          <span className="inline-flex items-center gap-1">
            <Network className="h-3.5 w-3.5" />
            Graph preview
          </span>
          <span>{post.preview.nodeCount} nodes</span>
        </div>
      </div>
    );
  }
  return null;
}

export function CommunityFeedCard({
  post,
  index,
}: {
  post: CommunityPost;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      className="mb-5 break-inside-avoid"
    >
      <Link
        href={`/community/${post.id}`}
        className="group block overflow-hidden rounded-[28px] border border-border/80 bg-card/96 shadow-[0_18px_40px_rgba(63,54,49,0.08)] transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="border-b border-border/70 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src={post.author.profile ?? undefined} alt={post.author.name} />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dayjs(post.createdAt).format("YYYY.MM.DD")}
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {post.deckMode === "graph" ? "Graph deck" : "List deck"}
            </span>
            {post.bookTitle ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                <BookOpenText className="h-3.5 w-3.5" />
                {post.bookTitle}
              </span>
            ) : null}
          </div>

          {post.primaryQuote ? (
            <blockquote className="border-l-2 border-primary/35 pl-4 text-[21px] leading-9 font-serif text-foreground md:text-[24px]">
              “{post.primaryQuote}”
            </blockquote>
          ) : (
            <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(193,92,61,0.14),rgba(244,238,232,0.44))] px-5 py-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/85 text-primary shadow-sm">
                <Quote className="h-4 w-4" />
              </div>
              <p className="text-[24px] leading-9 font-serif text-foreground md:text-[28px] md:leading-10">
                {post.primaryThought}
              </p>
            </div>
          )}

          {post.caption ? (
            <p className="text-sm leading-6 text-muted-foreground">{post.caption}</p>
          ) : null}

          {post.primaryQuote ? (
            <p className="text-base leading-7 text-foreground/90">{post.primaryThought}</p>
          ) : null}

          {post.preview.kind === "graph" ? (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
                Deck preview
              </p>
              <CommunityPreview post={post} />
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-4 border-t border-border/70 pt-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {post.deckName}
              </p>
              {post.deckDescription ? (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/80">
                  {post.deckDescription}
                </p>
              ) : null}
              {post.preview.kind === "list" ? (
                <p className="mt-2 text-xs text-muted-foreground/80">
                  {post.preview.itemCount} cards
                  {post.bookTitle ? ` · ${post.bookTitle}` : ""}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 text-xs font-medium text-primary">Read deck</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
