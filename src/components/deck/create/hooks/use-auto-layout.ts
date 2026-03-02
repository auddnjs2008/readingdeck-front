import dagre from "dagre";
import type { DeckFlowEdge, DeckFlowNode } from "../types";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

// 노드의 기본 크기와 여백 설정
const nodeWidth = 320;
const nodeHeight = 280;

export const getLayoutedElements = (
  nodes: DeckFlowNode[],
  edges: DeckFlowEdge[],
  direction: "TB" | "LR" = "LR"
) => {
  // 방향, 노드 간 간격(nodesep), 랭크 간 간격(ranksep) 설정
  dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return layoutedNodes;
};
