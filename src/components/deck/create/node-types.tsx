"use client";

import Image from "next/image";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import type { BookNodeData, CardNodeData } from "./types";

function BookNode({ data }: NodeProps<Node<BookNodeData, "book">>) {
  return (
    <div className="relative w-56 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl">
      <Handle
        type="target"
        position={Position.Left}
        className="h-4 w-4 border-[3px] border-background bg-muted-foreground"
      />
      <div className="relative h-32">
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
        className="h-4 w-4 border-[3px] border-background bg-primary"
      />
    </div>
  );
}

function CardNode({ data }: NodeProps<Node<CardNodeData, "card">>) {
  const typeStyle =
    data.kind === "Action"
      ? "bg-amber-500/15 text-amber-500"
      : "bg-emerald-500/15 text-emerald-500";

  return (
    <div
      className={`relative w-64 rounded-xl border bg-card p-4 shadow-xl ${
        data.highlighted
          ? "border-primary ring-1 ring-primary/40"
          : "border-border text-card-foreground"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={`h-4 w-4 border-[3px] border-background ${
          data.highlighted ? "bg-primary" : "bg-muted-foreground"
        }`}
      />
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${typeStyle}`}
        >
          {data.kind}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed">{data.quote}</p>
      <div className="border-t border-border pt-3 text-xs text-muted-foreground">
        {data.meta}
      </div>
    </div>
  );
}

export const deckCreateNodeTypes = {
  book: BookNode,
  card: CardNode,
};
