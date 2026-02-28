"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addEdge,
  type IsValidConnection,
  type NodeMouseHandler,
  type OnConnect,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DeckCreateCanvas from "@/components/deck/create/deck-create-canvas";
import DeckCardDetailSidebar from "@/components/deck/create/deck-card-detail-sidebar";
import DeckCreateSidebar from "@/components/deck/create/deck-create-sidebar";
import { useDeckEditorNavBinding } from "@/components/deck/create/hooks/use-deck-editor-nav-binding";
import { useDeckHistoryGraph } from "@/components/deck/create/hooks/use-deck-history-graph";
import { useDeckNodeDnd } from "@/components/deck/create/hooks/use-deck-node-dnd";
import { initialEdges, initialNodes } from "@/components/deck/create/mock-data";
import type {
  CardNodeData,
  DeckFlowEdge,
  DeckFlowNode,
  DeckSidebarBookItem,
  DeckSidebarCardItem,
} from "@/components/deck/create/types";
import { useCardUpdateMutation } from "@/hooks/card/react-query/useCardUpdateMutation";
import { useDeckCreateMutation } from "@/hooks/deck/react-query/useDeckCreateMutation";
import { useDeckGraphUpdateMutation } from "@/hooks/deck/react-query/useDeckGraphUpdateMutation";
import { useDeckPublishMutation } from "@/hooks/deck/react-query/useDeckPublishMutation";
import { useDeckUpdateMutation } from "@/hooks/deck/react-query/useDeckUpdateMutation";
import type { ResGetDeckDetail } from "@/service/deck/getDeckDetail";
import type {
  DeckGraphConnectionPayload,
  DeckGraphNodePayload,
} from "@/service/deck/types";

const CARD_KIND_MAP: Record<DeckSidebarCardItem["type"], CardNodeData["kind"]> = {
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

const CARD_TYPE_TO_KIND_MAP: Record<
  "insight" | "change" | "action" | "question",
  CardNodeData["kind"]
> = {
  insight: "Insight",
  change: "Change",
  action: "Action",
  question: "Question",
};

const buildPageMeta = (pageStart?: number | null, pageEnd?: number | null) => {
  if (pageStart == null && pageEnd == null) return "페이지 정보 없음";
  if (pageStart != null && pageEnd != null) {
    return pageStart === pageEnd ? `${pageStart}페이지` : `${pageStart}-${pageEnd}페이지`;
  }
  if (pageStart != null) return `${pageStart}페이지부터`;
  return `${pageEnd}페이지까지`;
};

const createNodeId = (prefix: "book" | "card") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const FALLBACK_BOOK_COVER = "";

type GraphPayload = {
  nodes: DeckGraphNodePayload[];
  connections: DeckGraphConnectionPayload[];
};

const mapEdgeStyle = (style: DeckFlowEdge["style"]) => {
  if (!style) return null;

  const stroke = typeof style.stroke === "string" ? style.stroke : undefined;
  const strokeWidth =
    typeof style.strokeWidth === "number" ? style.strokeWidth : undefined;

  if (stroke === undefined && strokeWidth === undefined) {
    return null;
  }

  return { stroke, strokeWidth };
};

const buildGraphPayload = (nodes: DeckFlowNode[], edges: DeckFlowEdge[]): GraphPayload => {
  const mappedNodes = nodes.map<DeckGraphNodePayload>((node, index) => {
    if (node.type === "book") {
      if (!node.data.bookId) {
        throw new Error("책 노드에 bookId가 없습니다.");
      }

      return {
        clientKey: node.id,
        type: "book",
        bookId: node.data.bookId,
        positionX: node.position.x,
        positionY: node.position.y,
        order: index,
      };
    }

    if (!node.data.cardId) {
      throw new Error("카드 노드에 cardId가 없습니다.");
    }

    return {
      clientKey: node.id,
      type: "card",
      cardId: node.data.cardId,
      positionX: node.position.x,
      positionY: node.position.y,
      order: index,
    };
  });

  const mappedConnections = edges.map<DeckGraphConnectionPayload>((edge) => ({
    fromNodeClientKey: edge.source,
    toNodeClientKey: edge.target,
    type: edge.type ?? null,
    style: mapEdgeStyle(edge.style),
    animated: edge.animated ?? false,
    markerEnd:
      edge.markerEnd && typeof edge.markerEnd === "object"
        ? { type: "type" in edge.markerEnd ? edge.markerEnd.type : undefined }
        : null,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
    label: typeof edge.label === "string" ? edge.label : null,
  }));

  return {
    nodes: mappedNodes,
    connections: mappedConnections,
  };
};

const toSnapshotKey = (payload: GraphPayload) => JSON.stringify(payload);

const mapDeckDetailToFlowGraph = (detail: ResGetDeckDetail) => {
  const nodeIdMap = new Map<number, string>();

  const mappedNodes: DeckFlowNode[] = detail.nodes.map((node) => {
    const flowNodeId = node.clientKey?.trim() ? node.clientKey : `node-${node.id}`;
    nodeIdMap.set(node.id, flowNodeId);

    if (node.type === "book") {
      const bookTitle = node.book?.title ?? (node.bookId ? `Book #${node.bookId}` : "Book");
      const bookAuthor = node.book?.author ?? "Unknown Author";
      const bookCover = node.book?.backgroundImage ?? FALLBACK_BOOK_COVER;

      return {
        id: flowNodeId,
        type: "book",
        position: { x: node.positionX, y: node.positionY },
        data: {
          bookId: node.bookId ?? undefined,
          title: bookTitle,
          author: bookAuthor,
          cover: bookCover,
        },
      };
    }

    const cardType = node.card?.type ?? "insight";
    const cardKind =
      cardType in CARD_TYPE_TO_KIND_MAP
        ? CARD_TYPE_TO_KIND_MAP[cardType as keyof typeof CARD_TYPE_TO_KIND_MAP]
        : "Insight";
    const pageStart = node.card?.pageStart ?? null;
    const pageEnd = node.card?.pageEnd ?? null;
    const fallbackTitle = node.cardId ? `Card #${node.cardId}` : "Card";
    const cardThought = node.card?.thought?.trim() || fallbackTitle;
    const cardQuote = node.card?.quote ?? "";
    const fallbackCover = node.card?.backgroundImage ?? FALLBACK_BOOK_COVER;

    const bookTitle = node.book?.title ?? fallbackTitle;
    const bookAuthor = node.book?.author ?? "Unknown Author";
    const bookCover = node.book?.backgroundImage ?? fallbackCover;

    return {
      id: flowNodeId,
      type: "card",
      position: { x: node.positionX, y: node.positionY },
      data: {
        cardId: node.cardId ?? undefined,
        kind: cardKind,
        thought: cardThought,
        quote: cardQuote,
        pageStart,
        pageEnd,
        meta: buildPageMeta(pageStart, pageEnd),
        bookTitle,
        bookAuthor,
        bookCover,
        tags: [],
        highlighted: false,
      },
    };
  });

  const mappedEdges = detail.connections.reduce<DeckFlowEdge[]>(
    (acc, connection) => {
      const source = nodeIdMap.get(connection.fromNodeId);
      const target = nodeIdMap.get(connection.toNodeId);
      if (!source || !target) return acc;

      acc.push({
        id: `edge-${connection.id}`,
        source,
        target,
        type: connection.type ?? "smoothstep",
        style: connection.style ?? { stroke: "var(--primary)", strokeWidth: 2 },
        animated: connection.animated ?? false,
        markerEnd: undefined,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
        label: connection.label ?? undefined,
      });

      return acc;
    },
    []
  );

  return {
    nodes: mappedNodes,
    edges: mappedEdges,
  };
};

type DeckCreateClientProps = {
  initialDeckDetail?: ResGetDeckDetail;
};

export default function DeckCreateClient({ initialDeckDetail }: DeckCreateClientProps) {
  const router = useRouter();
  const cardUpdateMutation = useCardUpdateMutation();
  const deckCreateMutation = useDeckCreateMutation();
  const deckGraphUpdateMutation = useDeckGraphUpdateMutation();
  const deckPublishMutation = useDeckPublishMutation();
  const deckUpdateMutation = useDeckUpdateMutation();
  const initialFlowGraph = useMemo(
    () =>
      initialDeckDetail
        ? mapDeckDetailToFlowGraph(initialDeckDetail)
        : { nodes: initialNodes, edges: initialEdges },
    [initialDeckDetail]
  );
  const initialGraphSnapshotKey = useMemo(() => {
    try {
      const payload = buildGraphPayload(initialFlowGraph.nodes, initialFlowGraph.edges);
      return toSnapshotKey(payload);
    } catch {
      return null;
    }
  }, [initialFlowGraph.edges, initialFlowGraph.nodes]);

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
  } = useDeckHistoryGraph(initialFlowGraph.nodes, initialFlowGraph.edges);

  const [deckId, setDeckId] = useState<number | null>(initialDeckDetail?.id ?? null);
  const [deckTitle, setDeckTitle] = useState(initialDeckDetail?.name ?? "My Reading Flow");
  const [savedTitle, setSavedTitle] = useState(initialDeckDetail?.name ?? "My Reading Flow");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    initialDeckDetail ? "saved" : "idle"
  );
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(
    initialDeckDetail?.updatedAt ? new Date(initialDeckDetail.updatedAt).getTime() : null
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedBookIdFromCanvas, setSelectedBookIdFromCanvas] = useState<number | null>(null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    DeckFlowNode,
    DeckFlowEdge
  > | null>(null);

  const graphPayloadResult = useMemo(() => {
    try {
      const payload = buildGraphPayload(nodes, edges);
      return {
        payload,
        snapshotKey: toSnapshotKey(payload),
        error: null as string | null,
      };
    } catch (error) {
      return {
        payload: null,
        snapshotKey: null,
        error: error instanceof Error ? error.message : "그래프 저장 데이터가 올바르지 않습니다.",
      };
    }
  }, [edges, nodes]);

  const [savedSnapshotKey, setSavedSnapshotKey] = useState<string | null>(
    initialGraphSnapshotKey ?? graphPayloadResult.snapshotKey
  );

  useEffect(() => {
    if (savedSnapshotKey !== null) return;
    if (graphPayloadResult.snapshotKey === null) return;
    setSavedSnapshotKey(graphPayloadResult.snapshotKey);
  }, [graphPayloadResult.snapshotKey, savedSnapshotKey]);

  const isGraphDirty =
    graphPayloadResult.snapshotKey !== null && graphPayloadResult.snapshotKey !== savedSnapshotKey;
  const isTitleDirty = deckTitle !== savedTitle;
  const isDirty = isGraphDirty || isTitleDirty;
  const isSaving = saveState === "saving";

  useEffect(() => {
    if (isDirty && saveState === "saved") {
      setSaveState("idle");
    }
  }, [isDirty, saveState]);

  const isValidConnection = useCallback<IsValidConnection<DeckFlowEdge>>(
    (connection) => {
      if (!connection.source || !connection.target) return false;
      if (connection.source === connection.target) return false;

      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (!sourceNode || !targetNode) return false;

      const sourceType = sourceNode.type;
      const targetType = targetNode.type;

      return (sourceType === "book" || sourceType === "card") && targetType === "card";
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
      if (node.type === "card") {
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
      } else if (node.type === "book") {
        setSelectedCardId(null);
        if (node.data.bookId) {
          setSelectedBookIdFromCanvas(node.data.bookId);
        }
      }
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

      const numericBookId = Number(book.id);
      const node: DeckFlowNode = {
        id: createNodeId("book"),
        type: "book",
        position: nextPosition,
        data: {
          bookId: Number.isFinite(numericBookId) ? numericBookId : undefined,
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

  const { onBookDragStart, onCardDragStart, onCanvasDragOver, onCanvasDrop } = useDeckNodeDnd({
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
        edges: current.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
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

  const persistDeckDraft = useCallback(async () => {
    if (!graphPayloadResult.payload || !graphPayloadResult.snapshotKey) {
      setSaveState("error");
      toast.error(graphPayloadResult.error ?? "그래프를 저장할 수 없습니다.");
      return null;
    }

    if (deckId && !isGraphDirty && !isTitleDirty) {
      setSaveState("saved");
      setLastSavedAt(Date.now());
      return deckId;
    }

    setSaveState("saving");

    try {
      let resolvedDeckId = deckId;

      if (!resolvedDeckId) {
        const created = await deckCreateMutation.mutateAsync({
          body: {
            name: deckTitle,
            nodes: graphPayloadResult.payload.nodes,
            connections: graphPayloadResult.payload.connections,
          },
        });

        resolvedDeckId = created.id;
        setDeckId(created.id);
        setDeckTitle(created.name);
        setSavedTitle(created.name);
      } else {
        if (isTitleDirty) {
          const updated = await deckUpdateMutation.mutateAsync({
            path: { deckId: resolvedDeckId },
            body: { name: deckTitle },
          });
          setDeckTitle(updated.name);
          setSavedTitle(updated.name);
        }

        if (isGraphDirty) {
          await deckGraphUpdateMutation.mutateAsync({
            path: { deckId: resolvedDeckId },
            body: {
              nodes: graphPayloadResult.payload.nodes,
              connections: graphPayloadResult.payload.connections,
            },
          });
        }
      }

      setSavedSnapshotKey(graphPayloadResult.snapshotKey);
      setSaveState("saved");
      setLastSavedAt(Date.now());

      return resolvedDeckId;
    } catch {
      setSaveState("error");
      toast.error("저장에 실패했습니다. 다시 시도해 주세요.");
      return null;
    }
  }, [
    deckCreateMutation,
    deckGraphUpdateMutation,
    deckId,
    deckTitle,
    deckUpdateMutation,
    graphPayloadResult.error,
    graphPayloadResult.payload,
    graphPayloadResult.snapshotKey,
    isGraphDirty,
    isTitleDirty,
  ]);

  const handleSave = useCallback(async () => {
    await persistDeckDraft();
  }, [persistDeckDraft]);

  const handlePublish = useCallback(async () => {
    if (nodes.length < 1) {
      toast.error("발행하려면 최소 1개의 노드가 필요합니다.");
      return;
    }

    setIsPublishing(true);

    try {
      const resolvedDeckId = await persistDeckDraft();
      if (!resolvedDeckId) return;

      const published = await deckPublishMutation.mutateAsync({
        path: { deckId: resolvedDeckId },
        body: { name: deckTitle },
      });

      setDeckTitle(published.name);
      setSavedTitle(published.name);
      setSaveState("saved");
      setLastSavedAt(Date.now());
      toast.success("덱이 생성되었습니다.");
      router.push("/");
    } catch {
      setSaveState("error");
      toast.error("덱 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsPublishing(false);
    }
  }, [deckPublishMutation, deckTitle, nodes.length, persistDeckDraft, router]);

  const handleTitleCommit = useCallback(
    (title: string) => {
      const nextTitle = title.trim();
      if (!nextTitle) return;
      if (nextTitle === deckTitle) return;

      setDeckTitle(nextTitle);
      if (saveState === "saved") {
        setSaveState("idle");
      }
    },
    [deckTitle, saveState]
  );

  const canSave = Boolean(graphPayloadResult.payload) && (isDirty || !deckId);
  const canPublish = Boolean(graphPayloadResult.payload) && nodes.length > 0;

  useDeckEditorNavBinding({
    undo,
    redo,
    canUndo,
    canRedo,
    title: deckTitle,
    isDirty,
    canSave,
    canPublish,
    isSaving,
    isPublishing,
    saveState,
    lastSavedAt,
    onSave: handleSave,
    onPublish: handlePublish,
    onTitleCommit: handleTitleCommit,
  });

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
            externalSelectedBookId={selectedBookIdFromCanvas}
            onClearExternalBookId={() => setSelectedBookIdFromCanvas(null)}
          />
        )}
      </div>
    </div>
  );
}
