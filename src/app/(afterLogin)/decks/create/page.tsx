"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import {
  CheckCheck,
  Edit3,
  LibraryBig,
  Minus,
  Plus,
  Scan,
  Save,
  Undo2,
  Upload,
} from "lucide-react";
import "@xyflow/react/dist/style.css";

type BookNodeData = {
  title: string;
  author: string;
  cover: string;
};

type CardNodeData = {
  kind: "Concept" | "Action";
  quote: string;
  meta: string;
  highlighted?: boolean;
};

type DeckNode = Node<BookNodeData, "book"> | Node<CardNodeData, "card">;

const initialNodes: DeckNode[] = [
  {
    id: "book-1",
    type: "book",
    position: { x: 120, y: 200 },
    data: {
      title: "Atomic Habits",
      author: "James Clear",
      cover:
        "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=1200&auto=format&fit=crop",
    },
  },
  {
    id: "card-1",
    type: "card",
    position: { x: 560, y: 120 },
    data: {
      kind: "Concept",
      quote:
        '"You do not rise to the level of your goals. You fall to the level of your systems."',
      meta: "Page 27",
    },
  },
  {
    id: "card-2",
    type: "card",
    position: { x: 560, y: 360 },
    data: {
      kind: "Action",
      quote:
        "Identity-based habits focus on who you wish to become, not just what you want to achieve.",
      meta: "#identity #psychology",
      highlighted: true,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "book-1-card-1",
    source: "book-1",
    target: "card-1",
    type: "smoothstep",
    style: { stroke: "color-mix(in oklab, var(--muted-foreground) 40%, transparent)" },
  },
  {
    id: "book-1-card-2",
    source: "book-1",
    target: "card-2",
    type: "smoothstep",
    style: { stroke: "var(--primary)", strokeWidth: 2.5 },
  },
];

const libraryItems = [
  { id: "b1", title: "The Psychology of Money", author: "Morgan Housel", cards: 12 },
  { id: "b2", title: "Deep Work", author: "Cal Newport", cards: 8 },
  { id: "b3", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", cards: 24 },
  { id: "b4", title: "Antifragile", author: "Nassim Taleb", cards: 15 },
];

function BookNode({ data }: NodeProps<Node<BookNodeData, "book">>) {
  return (
    <div className="relative w-56 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-4 !w-4 !border-[3px] !border-background !bg-muted-foreground"
      />
      <div className="relative h-32">
        <Image src={data.cover} alt={data.title} fill sizes="224px" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3">
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
        className="!h-4 !w-4 !border-[3px] !border-background !bg-primary"
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
        className={`!h-4 !w-4 !border-[3px] !border-background ${data.highlighted ? "!bg-primary" : "!bg-muted-foreground"}`}
      />
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${typeStyle}`}>
          {data.kind}
        </span>
      </div>
      <p className="mb-3 text-sm leading-relaxed">{data.quote}</p>
      <div className="border-t border-border pt-3 text-xs text-muted-foreground">{data.meta}</div>
    </div>
  );
}

const nodeTypes = {
  book: BookNode,
  card: CardNode,
};

export default function DeckCreatePage() {
  const [nodes, setNodes] = useState<DeckNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<DeckNode, Edge> | null>(null);

  const onNodesChange = useCallback<OnNodesChange<DeckNode>>((changes) => {
    setNodes((snapshot) => applyNodeChanges(changes, snapshot));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange<Edge>>((changes) => {
    setEdges((snapshot) => applyEdgeChanges(changes, snapshot));
  }, []);

  const onConnect = useCallback<OnConnect>(
    (connection) => {
      setEdges((snapshot) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            style: { stroke: "var(--primary)", strokeWidth: 2 },
          },
          snapshot
        )
      );
    },
    []
  );

  return (
    <div className="h-[calc(100vh-4rem)] min-h-[680px] overflow-hidden bg-background">
      <div className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <LibraryBig className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Untitled Deck</span>
          <button className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Edit title">
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Undo">
            <Undo2 className="h-4 w-4" />
          </button>
          <button className="rounded-md border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Save">
            <Save className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <CheckCheck className="h-4 w-4" />
            Create Deck
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100%-3.5rem)]">
        <section className="relative flex-1 overflow-hidden">
          <ReactFlow<DeckNode, Edge>
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setFlowInstance}
            fitView
            fitViewOptions={{ padding: 0.24 }}
            minZoom={0.5}
            maxZoom={1.8}
            className="bg-background"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="var(--border)" />
          </ReactFlow>

          <div className="absolute bottom-5 left-5 z-10 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-lg">
            <button
              className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => flowInstance?.zoomIn()}
              aria-label="Zoom in"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => flowInstance?.zoomOut()}
              aria-label="Zoom out"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => flowInstance?.fitView({ padding: 0.24 })}
              aria-label="Fit view"
            >
              <Scan className="h-4 w-4" />
            </button>
          </div>
        </section>

        <aside className="w-80 shrink-0 border-l border-border bg-card">
          <div className="space-y-4 border-b border-border p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Library & Assets</h2>
            <input
              type="text"
              placeholder="Search books, tags..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-primary/30 transition focus:ring-2"
            />
          </div>

          <div className="max-h-[calc(100%-8.5rem)] space-y-3 overflow-y-auto p-4">
            {libraryItems.map((item) => (
              <article
                key={item.id}
                className="cursor-move rounded-lg border border-border bg-background p-3 transition-all hover:border-primary/50 hover:shadow-md"
                draggable
              >
                <h3 className="line-clamp-1 text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.author}</p>
                <div className="mt-2 inline-flex rounded bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                  {item.cards} Cards
                </div>
              </article>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">
              <Upload className="h-4 w-4" />
              Import New Book
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
