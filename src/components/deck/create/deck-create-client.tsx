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
import { LayoutGrid, Plus, Rows3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DeckCardDeckMode, {
  type DeckModeCardItem,
} from "@/components/deck/create/deck-card-deck-mode";
import DeckCreateCanvas from "@/components/deck/create/deck-create-canvas";
import DeckCardDetailSidebar from "@/components/deck/create/deck-card-detail-sidebar";
import DeckCreateSidebar from "@/components/deck/create/deck-create-sidebar";
import MobileGraphDeckView, {
  type MobileGraphDeckEntry,
  type MobileGraphPreviewEdge,
  type MobileGraphPreviewNode,
} from "@/components/deck/mobile-graph-deck-view";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getLayoutedElements } from "@/components/deck/create/hooks/use-auto-layout";
import { useDeckEditorNavBinding } from "@/components/deck/create/hooks/use-deck-editor-nav-binding";
import { useDeckHistoryGraph } from "@/components/deck/create/hooks/use-deck-history-graph";
import { useDeckNodeDnd } from "@/components/deck/create/hooks/use-deck-node-dnd";
import type {
  CardNodeData,
  DeckFlowEdge,
  DeckFlowNode,
  DeckSidebarBookItem,
  DeckSidebarCardItem,
} from "@/components/deck/create/types";
import { useCardUpdateMutation } from "@/hooks/card/react-query/useCardUpdateMutation";
import { useDeckCreateMutation } from "@/hooks/deck/react-query/useDeckCreateMutation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useDeckGraphUpdateMutation } from "@/hooks/deck/react-query/useDeckGraphUpdateMutation";
import { useDeckPublishMutation } from "@/hooks/deck/react-query/useDeckPublishMutation";
import { useDeckUpdateMutation } from "@/hooks/deck/react-query/useDeckUpdateMutation";
import type { ResGetDeckDetail } from "@/service/deck/getDeckDetail";
import type {
  DeckGraphConnectionPayload,
  DeckGraphNodePayload,
} from "@/service/deck/types";

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
    return pageStart === pageEnd
      ? `${pageStart}페이지`
      : `${pageStart}-${pageEnd}페이지`;
  }
  if (pageStart != null) return `${pageStart}페이지`;
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

const buildGraphPayload = (
  nodes: DeckFlowNode[],
  edges: DeckFlowEdge[]
): GraphPayload => {
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
    type: "deletable", // 항상 deletable 타입으로 저장되도록 고정
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

const buildEditorGraphPreview = (
  nodes: DeckFlowNode[],
  edges: DeckFlowEdge[]
): { nodes: MobileGraphPreviewNode[]; edges: MobileGraphPreviewEdge[] } => {
  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const minX = Math.min(...nodes.map((node) => node.position.x));
  const maxX = Math.max(...nodes.map((node) => node.position.x));
  const minY = Math.min(...nodes.map((node) => node.position.y));
  const maxY = Math.max(...nodes.map((node) => node.position.y));
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const normalizeX = (value: number) => 10 + ((value - minX) / width) * 80;
  const normalizeY = (value: number) => 12 + ((value - minY) / height) * 76;

  const normalizedNodes = nodes.map<MobileGraphPreviewNode>((node) => ({
    id: node.id,
    x: normalizeX(node.position.x),
    y: normalizeY(node.position.y),
    type: node.type,
  }));

  const nodeById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const normalizedEdges = edges
    .map<MobileGraphPreviewEdge | null>((edge, index) => {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) return null;

      return {
        id: edge.id || `edge-${index}`,
        sx: source.x,
        sy: source.y,
        tx: target.x,
        ty: target.y,
        fromNodeId: edge.source,
        toNodeId: edge.target,
      };
    })
    .filter((edge): edge is MobileGraphPreviewEdge => edge !== null);

  return { nodes: normalizedNodes, edges: normalizedEdges };
};

const toSnapshotKey = (payload: GraphPayload) => JSON.stringify(payload);
const toDeckMode = (editorMode: "graph" | "deck") =>
  editorMode === "deck" ? "list" : "graph";

const getInitialCardOrder = (detail?: ResGetDeckDetail) => {
  if (!detail) return [];
  return detail.nodes
    .filter(
      (node): node is typeof node & { type: "card" } => node.type === "card"
    )
    .sort((a, b) => a.order - b.order)
    .map((node) =>
      node.clientKey?.trim() ? node.clientKey : `node-${node.id}`
    );
};

const mapDeckDetailToFlowGraph = (detail: ResGetDeckDetail) => {
  const nodeIdMap = new Map<number, string>();

  const mappedNodes: DeckFlowNode[] = detail.nodes.map((node) => {
    const flowNodeId = node.clientKey?.trim()
      ? node.clientKey
      : `node-${node.id}`;
    nodeIdMap.set(node.id, flowNodeId);

    if (node.type === "book") {
      const bookTitle =
        node.book?.title ?? (node.bookId ? `Book #${node.bookId}` : "Book");
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

      const sourceNode = detail.nodes.find(
        (n) => n.id === connection.fromNodeId
      );
      const isCardToCard = sourceNode?.type === "card";

      acc.push({
        id: `edge-${connection.id}`,
        source,
        target,
        type: "deletable", // 서버에서 어떤 타입으로 오든 무조건 커스텀 엣지로 렌더링
        style:
          connection.style ??
          (isCardToCard
            ? {
                stroke: "var(--primary)",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }
            : { stroke: "var(--primary)", strokeWidth: 3 }),
        animated: connection.animated ?? isCardToCard,
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

export default function DeckCreateClient({
  initialDeckDetail,
}: DeckCreateClientProps) {
  const isDetailPage = Boolean(initialDeckDetail);
  const isDesktop = useMediaQuery();
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
        : { nodes: [], edges: [] },
    [initialDeckDetail]
  );
  const initialGraphSnapshotKey = useMemo(() => {
    try {
      const payload = buildGraphPayload(
        initialFlowGraph.nodes,
        initialFlowGraph.edges
      );
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

  const [deckId, setDeckId] = useState<number | null>(
    initialDeckDetail?.id ?? null
  );
  const [deckStatus, setDeckStatus] = useState<"draft" | "published">(
    initialDeckDetail?.status ?? "draft"
  );
  const [deckTitle, setDeckTitle] = useState(
    initialDeckDetail?.name ?? "My Reading Flow"
  );
  const [deckDescription, setDeckDescription] = useState(
    initialDeckDetail?.description ?? ""
  );
  const [savedTitle, setSavedTitle] = useState(
    initialDeckDetail?.name ?? "My Reading Flow"
  );
  const [savedDescription, setSavedDescription] = useState(
    initialDeckDetail?.description ?? ""
  );
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >(initialDeckDetail ? "saved" : "idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(
    initialDeckDetail?.updatedAt
      ? new Date(initialDeckDetail.updatedAt).getTime()
      : null
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [editorMode, setEditorMode] = useState<"graph" | "deck">(
    initialDeckDetail
      ? initialDeckDetail.mode === "list"
        ? "deck"
        : "graph"
      : "deck"
  );
  const [savedMode, setSavedMode] = useState<"graph" | "deck">(
    initialDeckDetail
      ? initialDeckDetail.mode === "list"
        ? "deck"
        : "graph"
      : "deck"
  );
  const showMobileGraphReadView = !isDesktop && editorMode === "graph";
  const effectiveEditorMode = isDesktop
    ? editorMode
    : showMobileGraphReadView
    ? "graph"
    : "deck";
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedBookIdFromCanvas, setSelectedBookIdFromCanvas] = useState<
    number | null
  >(null);
  const [cardDeckOrder, setCardDeckOrder] = useState<string[]>(() =>
    getInitialCardOrder(initialDeckDetail)
  );
  const [savedCardDeckOrderSnapshot, setSavedCardDeckOrderSnapshot] =
    useState<string>(JSON.stringify(getInitialCardOrder(initialDeckDetail)));
  const [isDeckOrderTouched, setIsDeckOrderTouched] = useState(false);
  const [hasAppliedInitialDeckLayout, setHasAppliedInitialDeckLayout] =
    useState(initialDeckDetail?.mode === "graph");
  const [needsGraphAutoLayout, setNeedsGraphAutoLayout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        error:
          error instanceof Error
            ? error.message
            : "그래프 저장 데이터가 올바르지 않습니다.",
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
    graphPayloadResult.snapshotKey !== null &&
    graphPayloadResult.snapshotKey !== savedSnapshotKey;
  const normalizedDeckModeCardOrder = useMemo(() => {
    const cardIdSet = new Set(
      nodes
        .filter(
          (node): node is Extract<DeckFlowNode, { type: "card" }> =>
            node.type === "card"
        )
        .map((node) => node.id)
    );

    return [
      ...cardDeckOrder.filter((id) => cardIdSet.has(id)),
      ...[...cardIdSet].filter((id) => !cardDeckOrder.includes(id)),
    ];
  }, [cardDeckOrder, nodes]);
  const cardDeckOrderSnapshot = useMemo(
    () => JSON.stringify(normalizedDeckModeCardOrder),
    [normalizedDeckModeCardOrder]
  );
  const isCardDeckOrderDirty =
    isDeckOrderTouched || cardDeckOrderSnapshot !== savedCardDeckOrderSnapshot;
  const isTitleDirty = deckTitle !== savedTitle;
  const isDescriptionDirty = deckDescription !== savedDescription;
  const isModeDirty = effectiveEditorMode !== savedMode;
  const isDirty =
    isGraphDirty ||
    isCardDeckOrderDirty ||
    isTitleDirty ||
    isDescriptionDirty ||
    isModeDirty;
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

      commitGraphChange((current) => {
        const sourceNode = current.nodes.find(
          (n) => n.id === connection.source
        );
        const isCardToCard = sourceNode?.type === "card";

        return {
          nodes: current.nodes,
          edges: addEdge(
            {
              ...connection,
              type: "deletable",
              animated: isCardToCard,
              style: isCardToCard
                ? {
                    stroke: "var(--primary)",
                    strokeWidth: 2,
                    strokeDasharray: "5 5",
                  }
                : { stroke: "var(--primary)", strokeWidth: 3 },
            },
            current.edges
          ),
        };
      });
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

      if (effectiveEditorMode === "deck") {
        setNeedsGraphAutoLayout(true);
      }
    },
    [commitGraphChange, effectiveEditorMode, flowInstance]
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
      const numericCardId = Number(card.id);
      const resolvedCardId = Number.isFinite(numericCardId)
        ? numericCardId
        : undefined;

      if (resolvedCardId == null) {
        toast.error("카드 정보를 확인할 수 없어 추가할 수 없습니다.");
        return;
      }

      const node: DeckFlowNode = {
        id: createNodeId("card"),
        type: "card",
        position: nextPosition,
        data: {
          cardId: resolvedCardId,
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

      let isDuplicated = false;

      commitGraphChange((current) => {
        const alreadyExists = current.nodes.some(
          (currentNode) =>
            currentNode.type === "card" &&
            currentNode.data.cardId === resolvedCardId
        );

        if (alreadyExists) {
          isDuplicated = true;
          return current;
        }

        return {
          nodes: [...current.nodes, node],
          edges: current.edges,
        };
      });

      if (isDuplicated) {
        toast.error("이미 추가된 생각 카드입니다.");
      } else if (effectiveEditorMode === "deck") {
        setNeedsGraphAutoLayout(true);
      }
    },
    [commitGraphChange, effectiveEditorMode, flowInstance]
  );

  const { onBookDragStart, onCardDragStart, onCanvasDragOver, onCanvasDrop } =
    useDeckNodeDnd({
      onDropBook: addBookNodeToCanvas,
      onDropCard: addCardNodeToCanvas,
      getFlowPosition: (point) =>
        flowInstance?.screenToFlowPosition(point) ?? null,
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

  const deckModeCards = useMemo<DeckModeCardItem[]>(() => {
    const cardNodes = nodes.filter(
      (node): node is Extract<DeckFlowNode, { type: "card" }> =>
        node.type === "card"
    );

    const cardById = new Map<string, DeckModeCardItem>(
      cardNodes.map((node) => [
        node.id,
        {
          id: node.id,
          nodeId: node.id,
          kind: node.data.kind,
          thought: node.data.thought,
          quote: node.data.quote,
          meta: node.data.meta,
          bookTitle: node.data.bookTitle,
          bookAuthor: node.data.bookAuthor,
          bookCover: node.data.bookCover,
        } satisfies DeckModeCardItem,
      ])
    );

    const orderedIds = [
      ...cardDeckOrder.filter((id) => cardById.has(id)),
      ...cardNodes
        .map((node) => node.id)
        .filter((id) => !cardDeckOrder.includes(id)),
    ];

    const orderedCards = orderedIds.reduce<DeckModeCardItem[]>((acc, id) => {
      const item = cardById.get(id);
      if (item) acc.push(item);
      return acc;
    }, []);

    return orderedCards;
  }, [cardDeckOrder, nodes]);
  const mobileGraphPreview = useMemo(
    () => buildEditorGraphPreview(nodes, edges),
    [edges, nodes]
  );
  const mobileGraphEntries = useMemo<MobileGraphDeckEntry[]>(
    () =>
      nodes.reduce<MobileGraphDeckEntry[]>((acc, node) => {
        if (node.type === "card") {
          const pageMeta = buildPageMeta(node.data.pageStart, node.data.pageEnd);
          acc.push({
              id: node.id,
              type: "card" as const,
              title: node.data.thought,
              quote: node.data.quote,
              badgeLabel: node.data.kind,
              badgeClass: "border-border/60 bg-muted/50 text-foreground",
              meta: [node.data.bookTitle, pageMeta].filter(Boolean).join(" · "),
            });
          return acc;
        }

        acc.push({
          id: node.id,
          type: "book" as const,
          title: node.data.title,
          secondary: node.data.author,
        });
        return acc;
      }, []),
    [nodes]
  );

  const handleSelectDeckModeCard = useCallback(
    (nodeId: string) => {
      setSelectedCardId(nodeId);
      setNodesDirect((previous) =>
        previous.map((item) => {
          if (item.type !== "card") return item;
          return {
            ...item,
            data: {
              ...item.data,
              highlighted: item.id === nodeId,
            },
          };
        })
      );
    },
    [setNodesDirect]
  );

  const handleMoveDeckModeCard = useCallback(
    (nodeId: string, direction: "up" | "down") => {
      setCardDeckOrder((previous) => {
        const currentIds = [
          ...previous,
          ...nodes
            .filter(
              (node): node is Extract<DeckFlowNode, { type: "card" }> =>
                node.type === "card"
            )
            .map((node) => node.id)
            .filter((id) => !previous.includes(id)),
        ];

        const fromIndex = currentIds.indexOf(nodeId);
        if (fromIndex < 0) return currentIds;

        const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= currentIds.length) return currentIds;

        const next = [...currentIds];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setIsDeckOrderTouched(true);
        return next;
      });
    },
    [nodes]
  );

  const handleReorderDeckModeCards = useCallback((orderedNodeIds: string[]) => {
    setIsDeckOrderTouched(true);
    setCardDeckOrder(orderedNodeIds);
  }, []);

  const handleRemoveDeckModeCard = useCallback(
    (nodeId: string) => {
      handleDeleteNode(nodeId);
      setCardDeckOrder((previous) => previous.filter((id) => id !== nodeId));
    },
    [handleDeleteNode]
  );

  const persistDeckDraft = useCallback(async () => {
    if (!graphPayloadResult.payload || !graphPayloadResult.snapshotKey) {
      setSaveState("error");
      toast.error(graphPayloadResult.error ?? "그래프를 저장할 수 없습니다.");
      return null;
    }

    if (
      deckId &&
      !isGraphDirty &&
      !isCardDeckOrderDirty &&
      !isTitleDirty &&
      !isDescriptionDirty &&
      !isModeDirty
    ) {
      setSaveState("saved");
      setLastSavedAt(Date.now());
      return deckId;
    }

    setSaveState("saving");

    try {
      let resolvedDeckId = deckId;
      const deckMode = toDeckMode(effectiveEditorMode);
      const cardOrderMap = new Map(
        normalizedDeckModeCardOrder.map(
          (nodeId, index) => [nodeId, index] as const
        )
      );
      const orderedGraphNodes = graphPayloadResult.payload.nodes.map(
        (node, index) => {
          if (node.type !== "card") {
            return {
              ...node,
              order: node.order ?? index,
            };
          }

          const orderByDeckMode =
            node.clientKey != null
              ? cardOrderMap.get(node.clientKey)
              : undefined;
          return {
            ...node,
            order: orderByDeckMode ?? node.order ?? index,
          };
        }
      );

      if (!resolvedDeckId) {
        const created = await deckCreateMutation.mutateAsync({
          body: {
            name: deckTitle,
            description: deckDescription,
            mode: deckMode,
            nodes: orderedGraphNodes,
            connections: graphPayloadResult.payload.connections,
          },
        });

        resolvedDeckId = created.id;
        setDeckId(created.id);
        setDeckStatus(created.status);
        setDeckTitle(created.name);
        setDeckDescription(created.description ?? "");
        setSavedTitle(created.name);
        setSavedDescription(created.description ?? "");
        setSavedMode(effectiveEditorMode);
      } else {
        if (isTitleDirty || isDescriptionDirty || isModeDirty) {
          const updated = await deckUpdateMutation.mutateAsync({
            path: { deckId: resolvedDeckId },
            body: {
              name: deckTitle,
              description: deckDescription,
              mode: deckMode,
            },
          });
          setDeckTitle(updated.name);
          setDeckStatus(updated.status);
          setDeckDescription(updated.description ?? "");
          setSavedTitle(updated.name);
          setSavedDescription(updated.description ?? "");
          setSavedMode(effectiveEditorMode);
        }

        if (isGraphDirty || isCardDeckOrderDirty) {
          const updatedGraph = await deckGraphUpdateMutation.mutateAsync({
            path: { deckId: resolvedDeckId },
            body: {
              nodes: orderedGraphNodes,
              connections: graphPayloadResult.payload.connections,
            },
          });
          setDeckStatus(updatedGraph.status);
        }
      }

      setSavedSnapshotKey(graphPayloadResult.snapshotKey);
      setSavedCardDeckOrderSnapshot(cardDeckOrderSnapshot);
      setIsDeckOrderTouched(false);
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
    deckDescription,
    deckTitle,
    deckUpdateMutation,
    graphPayloadResult.error,
    graphPayloadResult.payload,
    graphPayloadResult.snapshotKey,
    cardDeckOrderSnapshot,
    effectiveEditorMode,
    isCardDeckOrderDirty,
    isDescriptionDirty,
    isGraphDirty,
    isModeDirty,
    isTitleDirty,
    normalizedDeckModeCardOrder,
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
        body: { name: deckTitle, description: deckDescription },
      });

      setDeckTitle(published.name);
      setDeckStatus(published.status);
      setDeckDescription(published.description ?? "");
      setSavedTitle(published.name);
      setSavedDescription(published.description ?? "");
      setSavedMode(effectiveEditorMode);
      setSaveState("saved");
      setLastSavedAt(Date.now());
      toast.success("덱이 발행되었습니다.");
      router.push(`/decks/${published.id}`);
    } catch {
      setSaveState("error");
      toast.error("덱 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsPublishing(false);
    }
  }, [
    deckPublishMutation,
    deckDescription,
    deckTitle,
    effectiveEditorMode,
    nodes.length,
    persistDeckDraft,
    router,
  ]);

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

  const handleDescriptionCommit = useCallback(
    (description: string) => {
      if (description === deckDescription) return;

      setDeckDescription(description);
      if (saveState === "saved") {
        setSaveState("idle");
      }
    },
    [deckDescription, saveState]
  );

  const canSave = Boolean(graphPayloadResult.payload) && (isDirty || !deckId);
  const canPublish =
    deckStatus === "draft" &&
    Boolean(graphPayloadResult.payload) &&
    nodes.length > 0;

  useDeckEditorNavBinding({
    editorMode: effectiveEditorMode,
    deckStatus,
    undo,
    redo,
    canUndo,
    canRedo,
    title: deckTitle,
    description: deckDescription,
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
    onDescriptionCommit: handleDescriptionCommit,
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
            ...(payload.pageStart != null
              ? { pageStart: payload.pageStart }
              : {}),
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

  const handleLayout = useCallback(() => {
    commitGraphChange((current) => {
      const layoutedNodes = getLayoutedElements(
        current.nodes,
        current.edges,
        "LR"
      );
      return {
        nodes: layoutedNodes,
        edges: current.edges,
      };
    });
    setTimeout(() => {
      flowInstance?.fitView({ padding: 0.2, duration: 800 });
    }, 50);
  }, [commitGraphChange, flowInstance]);

  const handleSwitchEditorMode = useCallback(
    (nextMode: "graph" | "deck") => {
      if (!isDesktop && nextMode === "graph") return;
      if (nextMode === editorMode) return;
      setEditorMode(nextMode);

      if (nextMode !== "graph") return;

      if (needsGraphAutoLayout) {
        if (nodes.length === 0) {
          setNeedsGraphAutoLayout(false);
          return;
        }

        commitGraphChange((current) => ({
          nodes: getLayoutedElements(current.nodes, current.edges, "LR"),
          edges: current.edges,
        }));
        setNeedsGraphAutoLayout(false);
        setHasAppliedInitialDeckLayout(true);
        setTimeout(() => {
          flowInstance?.fitView({ padding: 0.2, duration: 800 });
        }, 50);
        toast.message("새 카드가 추가되어 그래프를 자동 재배치했어요.");
        return;
      }

      if (hasAppliedInitialDeckLayout) return;
      if (nodes.length === 0) {
        setHasAppliedInitialDeckLayout(true);
        return;
      }

      commitGraphChange((current) => ({
        nodes: getLayoutedElements(current.nodes, current.edges, "LR"),
        edges: current.edges,
      }));
      setHasAppliedInitialDeckLayout(true);
      setTimeout(() => {
        flowInstance?.fitView({ padding: 0.2, duration: 800 });
      }, 50);
      toast.message("리스트 순서를 기준으로 그래프를 자동 배치했어요.");
    },
    [
      commitGraphChange,
      editorMode,
      flowInstance,
      hasAppliedInitialDeckLayout,
      isDesktop,
      needsGraphAutoLayout,
      nodes.length,
    ]
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="flex h-full min-h-0">
        <div className="relative flex min-w-0 flex-1">
          {!isDetailPage ? (
            <div className="absolute left-4 top-4 z-20 hidden items-center rounded-lg border border-border bg-card/95 p-1 shadow backdrop-blur md:inline-flex">
              <button
                type="button"
                onClick={() => handleSwitchEditorMode("deck")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  effectiveEditorMode === "deck"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Rows3 className="h-3.5 w-3.5" />
                List
              </button>
              <button
                type="button"
                onClick={() => handleSwitchEditorMode("graph")}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  effectiveEditorMode === "graph"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Graph
              </button>
            </div>
          ) : null}

          {showMobileGraphReadView ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              <MobileGraphDeckView
                modeLabel="Graph deck"
                statusLabel={deckStatus === "draft" ? "Draft" : "Published"}
                title={deckTitle}
                description={deckDescription || null}
                entries={mobileGraphEntries}
                previewNodes={mobileGraphPreview.nodes}
                previewEdges={mobileGraphPreview.edges}
                initialSelectedId={selectedCardId ?? mobileGraphEntries[0]?.id ?? null}
                emptyMessage="아직 그래프를 미리 볼 수 있는 노드가 없습니다."
              />
            </div>
          ) : effectiveEditorMode === "graph" ? (
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
              onLayout={handleLayout}
            />
          ) : (
            <DeckCardDeckMode
              cards={deckModeCards}
              selectedCardNodeId={selectedCardId}
              onSelectCard={handleSelectDeckModeCard}
              onMoveCard={handleMoveDeckModeCard}
              onReorderCards={handleReorderDeckModeCards}
              onRemoveCard={handleRemoveDeckModeCard}
              emptyStateHint={
                isDesktop
                  ? undefined
                  : "아직 추가된 카드가 없습니다. 아래 버튼을 눌러 카드를 추가해보세요."
              }
            />
          )}
        </div>
        {isDesktop ? (
          effectiveEditorMode === "graph" && selectedCard ? (
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
              enableBookNodeActions={effectiveEditorMode === "graph"}
              instantAddCardOnClick={effectiveEditorMode === "deck"}
              externalSelectedBookId={selectedBookIdFromCanvas}
              onClearExternalBookId={() => setSelectedBookIdFromCanvas(null)}
            />
          )
        ) : null}
      </div>

      {!isDesktop && !showMobileGraphReadView ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 z-20 h-14 w-14 rounded-full shadow-lg md:hidden"
              aria-label="카드 추가"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-full w-[85vw] max-w-sm flex-col gap-0 overflow-hidden p-0"
          >
            <SheetTitle className="sr-only">카드 추가</SheetTitle>
            <div className="flex h-full min-h-0 flex-col">
              <DeckCreateSidebar
                variant="sheet"
                onBookDragStart={onBookDragStart}
                onCardDragStart={onCardDragStart}
                onAddSelectedBook={onAddSelectedBook}
                onAddSelectedCard={onAddSelectedCard}
                enableBookNodeActions={false}
                instantAddCardOnClick={true}
                externalSelectedBookId={selectedBookIdFromCanvas}
                onClearExternalBookId={() => setSelectedBookIdFromCanvas(null)}
              />
            </div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
