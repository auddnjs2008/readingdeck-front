"use client";

import {
  useCallback,
  useMemo,
  useState,
  type DragEvent as ReactDragEvent,
} from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type IsValidConnection,
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
import { initialEdges, initialNodes } from "@/components/deck/create/mock-data";
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

const CARD_KIND_MAP: Record<DeckSidebarCardItem["type"], CardNodeData["kind"]> =
  {
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
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    DeckFlowNode,
    DeckFlowEdge
  > | null>(null);

  const onNodesChange = useCallback<OnNodesChange<DeckFlowNode>>((changes) => {
    setNodes((snapshot) => applyNodeChanges(changes, snapshot));
  }, []);

  const onEdgesChange = useCallback<OnEdgesChange<DeckFlowEdge>>((changes) => {
    setEdges((snapshot) => applyEdgeChanges(changes, snapshot));
  }, []);

  const isValidConnection = useCallback<IsValidConnection<DeckFlowEdge>>(
    (connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = sourceNode.type;
      const targetType = targetNode.type;

      // Policy: Book -> Card, Card -> Card only
      return (
        (sourceType === "book" || sourceType === "card") &&
        targetType === "card"
      );
    },
    [nodes]
  );

  const onConnect = useCallback<OnConnect>(
    (connection) => {
      if (!isValidConnection(connection)) return;
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
    [isValidConnection]
  );

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

  const addBookNodeToCanvas = useCallback(
    (book: DeckSidebarBookItem, position?: { x: number; y: number }) => {
      const viewportCenter =
        typeof window !== "undefined"
          ? flowInstance?.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            })
          : undefined;
      const nextPosition = position ?? viewportCenter ?? { x: 360, y: 260 };

      const node: DeckFlowNode = {
        id: createNodeId("book"),
        type: "book",
        position: nextPosition,
        data: {
          title: book.title,
          author: book.author,
          cover: book.cover,
        },
      };
      setNodes((prev) => [...prev, node]);
    },
    [flowInstance]
  );

  const addCardNodeToCanvas = useCallback(
    (card: DeckSidebarCardItem, position?: { x: number; y: number }) => {
      const viewportCenter =
        typeof window !== "undefined"
          ? flowInstance?.screenToFlowPosition({
              x: window.innerWidth / 2,
              y: window.innerHeight / 2,
            })
          : undefined;
      const nextPosition = position ?? viewportCenter ?? { x: 360, y: 260 };

      const node: DeckFlowNode = {
        id: createNodeId("card"),
        type: "card",
        position: nextPosition,
        data: {
          kind: CARD_KIND_MAP[card.type],
          thought: card.text,
          quote: card.quote ?? "",
          meta: card.used ? "Used" : "Unused",
          bookTitle: card.bookTitle,
          bookAuthor: card.bookAuthor,
          bookCover: card.bookCover,
          tags: [],
          highlighted: false,
        },
      };
      setNodes((prev) => [...prev, node]);
    },
    [flowInstance]
  );

  const onAddSelectedBook = useCallback(
    (book: DeckSidebarBookItem) => {
      addBookNodeToCanvas(book);
    },
    [addBookNodeToCanvas]
  );

  const onAddSelectedCard = useCallback(
    (card: DeckSidebarCardItem) => {
      addCardNodeToCanvas(card);
    },
    [addCardNodeToCanvas]
  );

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
        addBookNodeToCanvas(payload.item, position);
        return;
      }

      addCardNodeToCanvas(payload.item, position);
    },
    [addBookNodeToCanvas, addCardNodeToCanvas, flowInstance]
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setSelectedCardId((prev) => (prev === nodeId ? null : prev));
  }, []);

  const nodesWithActions = useMemo<DeckFlowNode[]>(
    () =>
      nodes.map((node) => {
        if (node.type === "book") {
          return {
            ...node,
            data: {
              ...node.data,
              onDeleteNode: handleDeleteNode,
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            onDeleteNode: handleDeleteNode,
          },
        };
      }),
    [nodes, handleDeleteNode]
  );

  const selectedCardNode = nodes.find(
    (node): node is Extract<DeckFlowNode, { type: "card" }> =>
      node.type === "card" && node.id === selectedCardId
  );
  const selectedCard = selectedCardNode?.data as CardNodeData | undefined;

  const handleDeleteSelectedCard = () => {
    if (!selectedCardNode) return;
    handleDeleteNode(selectedCardNode.id);
  };

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
          nodes={nodesWithActions}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
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
            onDelete={handleDeleteSelectedCard}
          />
        ) : (
          <DeckCreateSidebar
            onBookDragStart={onBookDragStart}
            onCardDragStart={onCardDragStart}
            onAddSelectedBook={onAddSelectedBook}
            onAddSelectedCard={onAddSelectedCard}
          />
        )}
      </div>
    </div>
  );
}
