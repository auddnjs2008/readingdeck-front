"use client";

import { useCallback, useState, type DragEvent as ReactDragEvent } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeckCreateCanvas from "@/components/deck/create/deck-create-canvas";
import DeckCardDetailSidebar from "@/components/deck/create/deck-card-detail-sidebar";
import DeckCreateSidebar from "@/components/deck/create/deck-create-sidebar";
import {
  cardLibraryItems,
  initialEdges,
  initialNodes,
  libraryItems,
} from "@/components/deck/create/mock-data";
import type {
  CardNodeData,
  DeckFlowEdge,
  DeckFlowNode,
  DeckSidebarBookItem,
  DeckSidebarCardItem,
} from "@/components/deck/create/types";

const DND_NODE_MIME = "application/readingdeck-node";

type DragBookPayload = {
  kind: "book";
  item: DeckSidebarBookItem;
};

type DragCardPayload = {
  kind: "card";
  item: DeckSidebarCardItem;
};

type DragPayload = DragBookPayload | DragCardPayload;

const CARD_KIND_MAP: Record<DeckSidebarCardItem["type"], CardNodeData["kind"]> = {
  insight: "Insight",
  change: "Change",
  question: "Question",
  quote: "Quote",
};

const createNodeId = (prefix: "book" | "card") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function DeckCreatePage() {
  const [nodes, setNodes] = useState<DeckFlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<DeckFlowEdge[]>(initialEdges);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [flowInstance, setFlowInstance] = useState<
    ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null
  >(null);

  const onNodesChange = useCallback<OnNodesChange<DeckFlowNode>>((changes) => {
    setNodes((snapshot) => applyNodeChanges(changes, snapshot));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange<DeckFlowEdge>>((changes) => {
    setEdges((snapshot) => applyEdgeChanges(changes, snapshot));
  }, []);

  const onConnect = useCallback<OnConnect>((connection) => {
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
  }, []);

  const onNodeClick = useCallback<NodeMouseHandler<DeckFlowNode>>(
    (_event, node) => {
      if (node.type !== "card") return;
      const targetId = node.id;
      setSelectedCardId(targetId);
      setNodes((prev) =>
        prev.map((item) => {
          if (item.type !== "card") return item;
          return {
            ...item,
            data: {
              ...item.data,
              highlighted: item.id === targetId,
            },
          };
        })
      );
    },
    []
  );

  const onBookDragStart = useCallback(
    (book: DeckSidebarBookItem, event: ReactDragEvent) => {
      const payload: DragBookPayload = { kind: "book", item: book };
      event.dataTransfer.setData(DND_NODE_MIME, JSON.stringify(payload));
      event.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const onCardDragStart = useCallback(
    (card: DeckSidebarCardItem, event: ReactDragEvent) => {
      const payload: DragCardPayload = { kind: "card", item: card };
      event.dataTransfer.setData(DND_NODE_MIME, JSON.stringify(payload));
      event.dataTransfer.effectAllowed = "copy";
    },
    []
  );

  const onCanvasDragOver = useCallback((event: ReactDragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onCanvasDrop = useCallback(
    (event: ReactDragEvent<HTMLElement>) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData(DND_NODE_MIME);
      if (!raw) return;

      let payload: DragPayload | null = null;
      try {
        payload = JSON.parse(raw) as DragPayload;
      } catch {
        return;
      }
      if (!payload) return;

      const flowPosition = flowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const fallback = { x: 360, y: 260 };
      const position = flowPosition ?? fallback;

      if (payload.kind === "book") {
        const node: DeckFlowNode = {
          id: createNodeId("book"),
          type: "book",
          position,
          data: {
            title: payload.item.title,
            author: payload.item.author,
            cover: payload.item.cover,
          },
        };
        setNodes((prev) => [...prev, node]);
        return;
      }

      const node: DeckFlowNode = {
        id: createNodeId("card"),
        type: "card",
        position,
        data: {
          kind: CARD_KIND_MAP[payload.item.type],
          thought: payload.item.text,
          quote: "",
          meta: payload.item.used ? "Used" : "Unused",
          bookTitle: payload.item.bookTitle,
          bookAuthor: payload.item.bookAuthor,
          bookCover: payload.item.bookCover,
          tags: [],
          highlighted: false,
        },
      };
      setNodes((prev) => [...prev, node]);
    },
    [flowInstance]
  );

  const selectedCard = nodes.find(
    (node): node is Extract<DeckFlowNode, { type: "card" }> =>
      node.type === "card" && node.id === selectedCardId
  )?.data as CardNodeData | undefined;

  const handleBackFromDetail = () => {
    setSelectedCardId(null);
    setNodes((prev) =>
      prev.map((item) => {
        if (item.type !== "card") return item;
        return {
          ...item,
          data: {
            ...item.data,
            highlighted: false,
          },
        };
      })
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="flex h-full min-h-0">
        <DeckCreateCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onCanvasDragOver={onCanvasDragOver}
          onCanvasDrop={onCanvasDrop}
          setFlowInstance={setFlowInstance}
          flowInstance={flowInstance}
        />
        {selectedCard ? (
          <DeckCardDetailSidebar
            card={selectedCard}
            onBack={handleBackFromDetail}
          />
        ) : (
          <DeckCreateSidebar
            bookItems={libraryItems}
            cardItems={cardLibraryItems}
            onBookDragStart={onBookDragStart}
            onCardDragStart={onCardDragStart}
          />
        )}
      </div>
    </div>
  );
}
