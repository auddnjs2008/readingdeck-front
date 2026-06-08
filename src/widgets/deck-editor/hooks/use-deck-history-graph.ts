"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowProps,
} from "@xyflow/react";
import type { DeckFlowEdge, DeckFlowNode } from "../types";

type GraphSnapshot = {
  nodes: DeckFlowNode[];
  edges: DeckFlowEdge[];
};

type HistoryState = {
  past: GraphSnapshot[];
  future: GraphSnapshot[];
};

const HISTORY_LIMIT = 100;

function resolveStateAction<T>(
  action: SetStateAction<T>,
  previous: T
): T {
  return typeof action === "function"
    ? (action as (value: T) => T)(previous)
    : action;
}

export function useDeckHistoryGraph(
  initialNodes: DeckFlowNode[],
  initialEdges: DeckFlowEdge[]
) {
  const [nodes, setNodes] = useState<DeckFlowNode[]>(initialNodes);
  const [edges, setEdges] = useState<DeckFlowEdge[]>(initialEdges);
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const historyRef = useRef(history);
  const dragStartSnapshotRef = useRef<GraphSnapshot | null>(null);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const setNodesDirect = useCallback((updater: SetStateAction<DeckFlowNode[]>) => {
    setNodes((previous) => {
      const next = resolveStateAction(updater, previous);
      nodesRef.current = next;
      return next;
    });
  }, []);

  const setEdgesDirect = useCallback((updater: SetStateAction<DeckFlowEdge[]>) => {
    setEdges((previous) => {
      const next = resolveStateAction(updater, previous);
      edgesRef.current = next;
      return next;
    });
  }, []);

  const pushHistorySnapshot = useCallback((snapshot: GraphSnapshot) => {
    setHistory((previous) => {
      const next: HistoryState = {
        past: [...previous.past, snapshot].slice(-HISTORY_LIMIT),
        future: [],
      };
      historyRef.current = next;
      return next;
    });
  }, []);

  const commitGraphChange = useCallback(
    (updater: (current: GraphSnapshot) => GraphSnapshot) => {
      const current: GraphSnapshot = {
        nodes: nodesRef.current,
        edges: edgesRef.current,
      };
      const next = updater(current);

      if (next.nodes === current.nodes && next.edges === current.edges) return;

      pushHistorySnapshot(current);
      setNodes(next.nodes);
      setEdges(next.edges);
      nodesRef.current = next.nodes;
      edgesRef.current = next.edges;
    },
    [pushHistorySnapshot]
  );

  const onNodesChange = useCallback<OnNodesChange<DeckFlowNode>>(
    (changes) => {
      const hasStructuralChange = changes.some(
        (change) =>
          change.type !== "select" &&
          change.type !== "position" &&
          change.type !== "dimensions"
      );

      if (!hasStructuralChange) {
        setNodes((snapshot) => {
          const next = applyNodeChanges(changes, snapshot);
          nodesRef.current = next;
          return next;
        });
        return;
      }

      commitGraphChange((current) => ({
        nodes: applyNodeChanges(changes, current.nodes),
        edges: current.edges,
      }));
    },
    [commitGraphChange]
  );

  const onEdgesChange = useCallback<OnEdgesChange<DeckFlowEdge>>(
    (changes) => {
      const hasStructuralChange = changes.some((change) => change.type !== "select");

      if (!hasStructuralChange) {
        setEdges((snapshot) => {
          const next = applyEdgeChanges(changes, snapshot);
          edgesRef.current = next;
          return next;
        });
        return;
      }

      commitGraphChange((current) => ({
        nodes: current.nodes,
        edges: applyEdgeChanges(changes, current.edges),
      }));
    },
    [commitGraphChange]
  );

  const onNodeDragStart = useCallback<
    NonNullable<ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStart"]>
  >(() => {
    if (dragStartSnapshotRef.current) return;

    dragStartSnapshotRef.current = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    };
  }, []);

  const onNodeDragStop = useCallback<
    NonNullable<ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStop"]>
  >((_event, node) => {
    const startSnapshot = dragStartSnapshotRef.current;
    dragStartSnapshotRef.current = null;
    if (!startSnapshot) return;

    const before = startSnapshot.nodes.find((item) => item.id === node.id);
    const after = nodesRef.current.find((item) => item.id === node.id);
    if (!before || !after) return;

    const moved =
      before.position.x !== after.position.x ||
      before.position.y !== after.position.y;
    if (!moved) return;

    pushHistorySnapshot(startSnapshot);
  }, [pushHistorySnapshot]);

  const undo = useCallback(() => {
    const currentHistory = historyRef.current;
    if (!currentHistory.past.length) return;

    const previous = currentHistory.past[currentHistory.past.length - 1];
    const current: GraphSnapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    };
    const nextHistory: HistoryState = {
      past: currentHistory.past.slice(0, -1),
      future: [current, ...currentHistory.future],
    };

    setHistory(nextHistory);
    historyRef.current = nextHistory;
    setNodes(previous.nodes);
    setEdges(previous.edges);
    nodesRef.current = previous.nodes;
    edgesRef.current = previous.edges;
  }, []);

  const redo = useCallback(() => {
    const currentHistory = historyRef.current;
    if (!currentHistory.future.length) return;

    const [nextSnapshot, ...restFuture] = currentHistory.future;
    const current: GraphSnapshot = {
      nodes: nodesRef.current,
      edges: edgesRef.current,
    };
    const nextHistory: HistoryState = {
      past: [...currentHistory.past, current].slice(-HISTORY_LIMIT),
      future: restFuture,
    };

    setHistory(nextHistory);
    historyRef.current = nextHistory;
    setNodes(nextSnapshot.nodes);
    setEdges(nextSnapshot.edges);
    nodesRef.current = nextSnapshot.nodes;
    edgesRef.current = nextSnapshot.edges;
  }, []);

  return {
    nodes,
    edges,
    setNodesDirect,
    setEdgesDirect,
    commitGraphChange,
    onNodesChange,
    onEdgesChange,
    onNodeDragStart,
    onNodeDragStop,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}

