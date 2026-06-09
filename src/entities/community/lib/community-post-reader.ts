import type {
  CommunityPostSnapshotConnection,
  CommunityPostSnapshotNode,
} from "@/entities/community/model/types";

export type ReadView = "graph" | "list";

export type GraphPreviewNode = {
  id: number;
  x: number;
  y: number;
  type: "book" | "card";
};

export type GraphPreviewEdge = {
  id: number;
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  fromNodeId: number;
  toNodeId: number;
};

export const CARD_LABELS: Record<string, string> = {
  insight: "인사이트",
  change: "변화",
  action: "액션",
  question: "질문",
};

export const CARD_BADGE_CLASSES: Record<string, string> = {
  insight:
    "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  question:
    "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  change:
    "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  action:
    "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
};

export const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export const formatPageRange = (
  pageStart: number | null,
  pageEnd: number | null
) => {
  if (pageStart && pageEnd) return `p.${pageStart}-${pageEnd}`;
  if (pageStart) return `p.${pageStart}`;
  if (pageEnd) return `p.${pageEnd}`;
  return null;
};

export const buildGraphPreview = (
  nodes: CommunityPostSnapshotNode[],
  connections: CommunityPostSnapshotConnection[]
): { nodes: GraphPreviewNode[]; edges: GraphPreviewEdge[] } => {
  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const minX = Math.min(...nodes.map((node) => node.positionX));
  const maxX = Math.max(...nodes.map((node) => node.positionX));
  const minY = Math.min(...nodes.map((node) => node.positionY));
  const maxY = Math.max(...nodes.map((node) => node.positionY));
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);
  const normalizeX = (value: number) => 10 + ((value - minX) / width) * 80;
  const normalizeY = (value: number) => 12 + ((value - minY) / height) * 76;

  const normalizedNodes = nodes.map((node) => ({
    id: node.id,
    x: normalizeX(node.positionX),
    y: normalizeY(node.positionY),
    type: node.type,
  }));

  const nodeById = new Map(normalizedNodes.map((node) => [node.id, node]));
  const normalizedEdges = connections
    .map((connection) => {
      const source = nodeById.get(connection.fromNodeId);
      const target = nodeById.get(connection.toNodeId);

      if (!source || !target) return null;

      return {
        id: connection.id,
        sx: source.x,
        sy: source.y,
        tx: target.x,
        ty: target.y,
        fromNodeId: connection.fromNodeId,
        toNodeId: connection.toNodeId,
      };
    })
    .filter((edge): edge is GraphPreviewEdge => edge !== null);

  return { nodes: normalizedNodes, edges: normalizedEdges };
};
