"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { BookNodeData, CardNodeData } from "./types";

function BookNode({ id, data, selected }: NodeProps<Node<BookNodeData, "book">>) {
  return (
    <div
      className={`relative w-56 overflow-visible rounded-xl border bg-card text-card-foreground shadow-xl ${
        selected ? "border-primary ring-1 ring-primary/40" : "border-border"
      }`}
    >
      {selected ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onDeleteNode?.(id);
          }}
          className="absolute right-2 top-2 z-20 rounded bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive"
          aria-label="Delete node"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <div className="relative h-32 overflow-hidden rounded-t-xl">
        <Image
          src={data.cover}
          alt={data.title}
          fill
          sizes="224px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-3">
          <span className="rounded bg-primary/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Book
          </span>
        </div>
      </div>
      <div className="space-y-1 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold">{data.title}</h3>
        <p className="text-xs text-muted-foreground">{data.author}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="h-5 w-5 border-[3px] border-background bg-primary"
      />
    </div>
  );
}

function CardNode({ id, data, selected }: NodeProps<Node<CardNodeData, "card">>) {
  const typeStyle: Record<CardNodeData["kind"], string> = {
    Insight: "bg-blue-500/10 text-blue-500",
    Change: "bg-emerald-500/10 text-emerald-500",
    Action: "bg-cyan-500/10 text-cyan-500",
    Question: "bg-amber-500/10 text-amber-500",
    Quote: "bg-purple-500/10 text-purple-500",
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
      className={`relative h-[236px] w-72 rounded-xl border bg-card p-4 text-card-foreground shadow-xl ${
        selected ? "border-primary ring-1 ring-primary/40" : "border-border"
      }`}
    >
      {selected ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onDeleteNode?.(id);
          }}
          className="absolute right-2 top-2 z-20 rounded bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive"
          aria-label="Delete node"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <Handle
        type="target"
        position={Position.Left}
        className={`h-5 w-5 border-[3px] border-background ${
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
      <div className="flex h-[calc(100%-2.25rem)] flex-col gap-3">
        <p className="line-clamp-4 text-base leading-snug font-medium">
          {data.thought}
        </p>
        <div className="rounded-md border-l-2 border-primary/30 bg-primary/5 px-3 py-2">
          <p className="line-clamp-2 text-xs italic text-muted-foreground">
            {data.quote?.trim() ? data.quote : "인용구 없음"}
          </p>
        </div>
        <div className="mt-auto border-t border-border pt-2 text-xs text-muted-foreground">
          {pageMeta}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className={`h-5 w-5 border-[3px] border-background ${
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
