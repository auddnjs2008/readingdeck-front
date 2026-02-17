"use client";

import { useCallback, useMemo, useState } from "react";
import {
  addEdge,
  type IsValidConnection,
  type NodeMouseHandler,
  type OnConnect,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DeckCreateCanvas from "@/components/deck/create/deck-create-canvas";
import DeckCardDetailSidebar from "@/components/deck/create/deck-card-detail-sidebar";
import {
  useDeckEditorNavBinding,
} from "@/components/deck/create/hooks/use-deck-editor-nav-binding";
import { useDeckHistoryGraph } from "@/components/deck/create/hooks/use-deck-history-graph";
import { useDeckNodeDnd } from "@/components/deck/create/hooks/use-deck-node-dnd";
import DeckCreateSidebar from "@/components/deck/create/deck-create-sidebar";
import { initialEdges, initialNodes } from "@/components/deck/create/mock-data";
import { useCardUpdateMutation } from "@/hooks/card/react-query/useCardUpdateMutation";
import type {
  CardNodeData,
  DeckFlowEdge,
  DeckFlowNode,
  DeckSidebarBookItem,
  DeckSidebarCardItem,
} from "@/components/deck/create/types";
import { toast } from "sonner";

const CARD_KIND_MAP: Record<DeckSidebarCardItem["type"], CardNodeData["kind"]> =
  {
    insight: "Insight",
    change: "Change",
    action: "Action",
    question: "Question",
    quote: "Quote",
  };

const KIND_TO_TYPE_MAP: Partial<
  Record<CardNodeData["kind"], "insight" | "change" | "action" | "question">
> = {
  Insight: "insight",
  Change: "change",
  Action: "action",
  Question: "question",
};

const buildPageMeta = (pageStart?: number | null, pageEnd?: number | null) => {
  if (pageStart == null && pageEnd == null) return "페이지 정보 없음";
  if (pageStart != null && pageEnd != null) {
    return pageStart === pageEnd
      ? `${pageStart}페이지`
      : `${pageStart}-${pageEnd}페이지`;
  }
  if (pageStart != null) return `${pageStart}페이지부터`;
  return `${pageEnd}페이지까지`;
};

const createNodeId = (prefix: "book" | "card") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function DeckCreatePage() {
  const cardUpdateMutation = useCardUpdateMutation();

  const {
    nodes,
    edges,
    setNodesDirect,
    commitGraphChange,
    onNodesChange,
    onEdgesChange,
    onNodeDragStart,
    onNodeDragStop,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDeckHistoryGraph(initialNodes, initialEdges);

  useDeckEditorNavBinding({
    undo,
    redo,
    canUndo,
    canRedo,
  });

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    DeckFlowNode,
    DeckFlowEdge
  > | null>(null);

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
      commitGraphChange((current) => ({
        nodes: current.nodes,
        edges: addEdge(
          {
            ...connection,
            type: "smoothstep",
            style: { stroke: "var(--primary)", strokeWidth: 2 },
          },
          current.edges
        ),
      }));
    },
    [commitGraphChange, isValidConnection]
  );

  const onNodeClick = useCallback<NodeMouseHandler<DeckFlowNode>>(
    (_event, node) => {
      if (node.type !== "card") return;
      const targetId = node.id;
      setSelectedCardId(targetId);
      setNodesDirect((previous) =>
        previous.map((item) => {
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
    [setNodesDirect]
  );

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

      commitGraphChange((current) => ({
        nodes: [...current.nodes, node],
        edges: current.edges,
      }));
    },
    [commitGraphChange, flowInstance]
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
          cardId: Number.isFinite(Number(card.id)) ? Number(card.id) : undefined,
          kind: CARD_KIND_MAP[card.type],
          thought: card.text,
          quote: card.quote ?? "",
          pageStart: card.pageStart ?? null,
          pageEnd: card.pageEnd ?? null,
          meta: buildPageMeta(card.pageStart ?? null, card.pageEnd ?? null),
          bookTitle: card.bookTitle,
          bookAuthor: card.bookAuthor,
          bookCover: card.bookCover,
          tags: [],
          highlighted: false,
        },
      };

      commitGraphChange((current) => ({
        nodes: [...current.nodes, node],
        edges: current.edges,
      }));
    },
    [commitGraphChange, flowInstance]
  );

  const {
    onBookDragStart,
    onCardDragStart,
    onCanvasDragOver,
    onCanvasDrop,
  } = useDeckNodeDnd({
    onDropBook: addBookNodeToCanvas,
    onDropCard: addCardNodeToCanvas,
    getFlowPosition: (point) => flowInstance?.screenToFlowPosition(point) ?? null,
  });

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

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      commitGraphChange((current) => ({
        nodes: current.nodes.filter((node) => node.id !== nodeId),
        edges: current.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      }));
      setSelectedCardId((previous) => (previous === nodeId ? null : previous));
    },
    [commitGraphChange]
  );

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

  const handleUpdateSelectedCard = useCallback(
    (payload: {
      kind: CardNodeData["kind"];
      thought: string;
      quote: string;
      pageStart: number | null;
      pageEnd: number | null;
    }) => {
      if (!selectedCardId || !selectedCardNode) return;

      commitGraphChange((current) => ({
        nodes: current.nodes.map((node) => {
          if (node.type !== "card" || node.id !== selectedCardId) return node;
          return {
            ...node,
            data: {
              ...node.data,
              kind: payload.kind,
              thought: payload.thought,
              quote: payload.quote,
              pageStart: payload.pageStart,
              pageEnd: payload.pageEnd,
              meta: buildPageMeta(payload.pageStart, payload.pageEnd),
            },
          };
        }),
        edges: current.edges,
      }));

      if (!selectedCardNode.data.cardId) return;

      const apiType = KIND_TO_TYPE_MAP[payload.kind];
      cardUpdateMutation.mutate(
        {
          path: { cardId: selectedCardNode.data.cardId },
          body: {
            ...(apiType ? { type: apiType } : {}),
            thought: payload.thought,
            quote: payload.quote,
            ...(payload.pageStart != null ? { pageStart: payload.pageStart } : {}),
            ...(payload.pageEnd != null ? { pageEnd: payload.pageEnd } : {}),
          },
        },
        {
          onError: () => {
            toast.error("카드 수정에 실패했습니다.");
          },
        }
      );
    },
    [cardUpdateMutation, commitGraphChange, selectedCardId, selectedCardNode]
  );

  const handleBackFromDetail = () => {
    setSelectedCardId(null);
    setNodesDirect((previous) =>
      previous.map((item) => {
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
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          onCanvasDragOver={onCanvasDragOver}
          onCanvasDrop={onCanvasDrop}
          setFlowInstance={setFlowInstance}
          flowInstance={flowInstance}
        />
        {selectedCard ? (
          <DeckCardDetailSidebar
            key={selectedCardNode?.id}
            card={selectedCard}
            onBack={handleBackFromDetail}
            onDelete={handleDeleteSelectedCard}
            onUpdate={handleUpdateSelectedCard}
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
