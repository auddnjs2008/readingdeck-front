"use client";

import { useState } from "react";
import Image from "next/image";
import { Book, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { BookNodeData, CardNodeData } from "./types";

function BookNode({ id, data, selected }: NodeProps<Node<BookNodeData, "book">>) {
  return (
    <div
      className={`group relative w-56 cursor-pointer overflow-visible rounded-md border bg-card text-card-foreground transition-colors ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border/70 hover:border-primary/40"
      }`}
    >
      {selected ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onDeleteNode?.(id);
          }}
          className="absolute -right-2 -top-2 z-20 rounded-md bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive"
          aria-label="노드 삭제"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <div className="relative h-36 overflow-hidden rounded-t-md bg-muted/20 flex items-center justify-center">
        {data.cover ? (
          <Image
            src={data.cover}
            alt={data.title}
            fill
            sizes="224px"
            className="object-contain p-4"
          />
        ) : (
          <Book className="h-8 w-8 text-muted-foreground/50" />
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 text-sm font-bold font-serif">{data.title}</h3>
        <p className="text-xs text-muted-foreground">{data.author}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="h-5 w-5 border-[3px] border-background bg-primary opacity-70 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

function CardNode({ id, data, selected }: NodeProps<Node<CardNodeData, "card">>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const displayTitle = data.title?.trim() || null;

  const kindLabel: Record<CardNodeData["kind"], string> = {
    Insight: "인사이트", Change: "변화", Action: "실천", Question: "질문", Quote: "인용",
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
      className={`group relative ${isCollapsed ? "h-auto" : "h-[236px]"} w-72 cursor-pointer rounded-md border bg-card p-4 text-card-foreground transition-colors  ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"
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
            className="rounded-md bg-secondary p-1.5 text-secondary-foreground shadow-sm hover:bg-secondary/80 border border-border"
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
            className="rounded-md bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive border border-destructive/50"
            aria-label="노드 삭제"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      <Handle
        type="target"
        position={Position.Left}
        className={`h-5 w-5 border-[3px] border-background opacity-70 group-hover:opacity-100 transition-opacity ${
          selected ? "bg-primary" : "bg-muted-foreground"
        }`}
      />
      <div className="mb-3 flex items-center justify-between">
        <span
          className="text-xs font-medium text-primary"
        >
          {kindLabel[data.kind]}
        </span>
      </div>
      {!isCollapsed && (
        <div className="flex h-[calc(100%-2.25rem)] flex-col gap-3">
          {displayTitle ? (
            <p className="line-clamp-1 text-sm font-medium leading-relaxed text-foreground">
              {displayTitle}
            </p>
          ) : null}
          <p
            className={`leading-relaxed font-serif ${
              displayTitle
                ? "line-clamp-2 text-sm font-medium text-foreground/90"
                : "line-clamp-3 text-base font-normal"
            }`}
          >
            {data.thought}
          </p>
          <div className="border-l-2 border-primary/30 pl-3">
            <p className="line-clamp-2 text-xs text-muted-foreground font-serif">
              {data.quote?.trim() ? data.quote : "인용구 없음"}
            </p>
          </div>
          <div className="mt-auto pt-2 text-xs text-muted-foreground">
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
        className={`h-5 w-5 border-[3px] border-background opacity-70 group-hover:opacity-100 transition-opacity ${
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
