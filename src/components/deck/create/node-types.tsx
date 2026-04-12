"use client";

import { useState } from "react";
import Image from "next/image";
import { Book, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { BookNodeData, CardNodeData } from "./types";

function BookNode({ id, data, selected }: NodeProps<Node<BookNodeData, "book">>) {
  return (
    <div
      className={`group relative w-56 cursor-pointer overflow-visible rounded-xl border bg-card text-card-foreground transition-all shadow-paper ${
        selected ? "border-primary ring-2 ring-primary/20 shadow-paper-lg scale-[1.02]" : "border-border/70 hover:border-primary/40 hover:shadow-paper-lg"
      }`}
    >
      {selected ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onDeleteNode?.(id);
          }}
          className="absolute -right-2 -top-2 z-20 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive"
          aria-label="노드 삭제"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <div className="relative h-32 overflow-hidden rounded-t-xl bg-muted/30 flex items-center justify-center">
        {data.cover ? (
          <Image
            src={data.cover}
            alt={data.title}
            fill
            sizes="224px"
            className="object-cover"
          />
        ) : (
          <Book className="h-8 w-8 text-muted-foreground/50" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-3">
          <span className="rounded bg-primary/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Book
          </span>
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 text-sm font-bold font-serif">{data.title}</h3>
        <p className="text-xs text-muted-foreground">{data.author}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="h-5 w-5 border-[3px] border-background bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

function CardNode({ id, data, selected }: NodeProps<Node<CardNodeData, "card">>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayTitle = data.title?.trim() || null;

  const typeStyle: Record<CardNodeData["kind"], string> = {
    Insight: "text-emerald-700 bg-emerald-600/10 dark:text-emerald-400 dark:bg-emerald-500/10",
    Change: "text-orange-700 bg-orange-600/10 dark:text-orange-400 dark:bg-orange-500/10",
    Action: "text-sky-700 bg-sky-600/10 dark:text-sky-400 dark:bg-sky-500/10",
    Question: "text-rose-700 bg-rose-600/10 dark:text-rose-400 dark:bg-rose-500/10",
    Quote: "text-sky-700 bg-sky-600/10 dark:text-sky-400 dark:bg-sky-500/10",
  };

  const typeBorderStyle: Record<CardNodeData["kind"], string> = {
    Insight: "border-l-emerald-500",
    Change: "border-l-orange-500",
    Action: "border-l-sky-500",
    Question: "border-l-rose-500",
    Quote: "border-l-sky-500",
  };

  const pageMeta =
    data.pageStart != null && data.pageEnd != null
      ? data.pageStart === data.pageEnd
        ? `${data.pageStart}페이지`
        : `${data.pageStart}-${data.pageEnd}페이지`
      : data.pageStart != null
        ? `${data.pageStart}페이지부터`
        : data.pageEnd != null
          ? `${data.pageEnd}페이지까지`
          : data.meta ?? "페이지 정보 없음";

  return (
    <div
      className={`group relative ${isCollapsed ? "h-auto" : "h-[236px]"} w-72 cursor-pointer rounded-xl border bg-card p-4 text-card-foreground transition-all shadow-paper border-l-[6px] ${typeBorderStyle[data.kind]} ${
        selected ? "border-primary ring-2 ring-primary/20 shadow-paper-lg scale-[1.02]" : "border-r-border/70 border-y-border/70 hover:border-r-primary/40 hover:border-y-primary/40 hover:shadow-paper-lg"
      }`}
    >
      {selected ? (
        <div className="absolute -right-2 -top-2 z-20 flex gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="rounded-full bg-secondary p-1.5 text-secondary-foreground shadow-sm hover:bg-secondary/80 border border-border"
            aria-label={isCollapsed ? "노드 확장" : "노드 축소"}
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              data.onDeleteNode?.(id);
            }}
            className="rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive border border-destructive/50"
            aria-label="노드 삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      <Handle
        type="target"
        position={Position.Left}
        className={`h-5 w-5 border-[3px] border-background opacity-0 group-hover:opacity-100 transition-opacity ${
          selected ? "bg-primary" : "bg-muted-foreground"
        }`}
      />
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
            typeStyle[data.kind]
          }`}
        >
          {data.kind}
        </span>
      </div>
      {!isCollapsed && (
        <div className="flex h-[calc(100%-2.25rem)] flex-col gap-3">
          {displayTitle ? (
            <p className="whitespace-pre-line text-sm font-bold leading-relaxed text-foreground">
              {displayTitle}
            </p>
          ) : null}
          <p
            className={`leading-relaxed font-serif ${
              displayTitle
                ? "line-clamp-2 text-sm font-medium text-foreground/90"
                : "line-clamp-4 text-base font-bold"
            }`}
          >
            {data.thought}
          </p>
          <div className="rounded-md border-l-2 border-primary/30 bg-primary/5 px-3 py-2">
            <p className="line-clamp-2 text-xs italic text-muted-foreground font-serif">
              {data.quote?.trim() ? data.quote : "인용구 없음"}
            </p>
          </div>
          <div className="mt-auto border-t border-border/70 pt-2 text-xs text-muted-foreground">
            {pageMeta}
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="space-y-1">
          <p className="line-clamp-1 text-base leading-relaxed font-bold font-serif">
            {displayTitle ?? data.thought}
          </p>
          {displayTitle ? (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {data.thought}
            </p>
          ) : null}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className={`h-5 w-5 border-[3px] border-background opacity-0 group-hover:opacity-100 transition-opacity ${
          selected ? "bg-primary" : "bg-muted-foreground"
        }`}
      />
    </div>
  );
}

export const deckCreateNodeTypes = {
  book: BookNode,
  card: CardNode,
};
