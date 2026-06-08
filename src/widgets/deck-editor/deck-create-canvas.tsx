"use client";

import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  type IsValidConnection,
  type NodeMouseHandler,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import { Minus, Plus, Scan, Wand2 } from "lucide-react";
import type { Dispatch, DragEventHandler, SetStateAction } from "react";
import { deckCreateNodeTypes } from "./node-types";
import type { DeckFlowEdge, DeckFlowNode } from "./types";

import DeletableEdge from "./deletable-edge";

const edgeTypes = {
  deletable: DeletableEdge,
};

type Props = {
  nodes: DeckFlowNode[];
  edges: DeckFlowEdge[];
  onNodesChange: OnNodesChange<DeckFlowNode>;
  onEdgesChange: OnEdgesChange<DeckFlowEdge>;
  onConnect: OnConnect;
  isValidConnection: IsValidConnection<DeckFlowEdge>;
  onNodeClick: NodeMouseHandler<DeckFlowNode>;
  onNodeDragStart: NonNullable<
    ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStart"]
  >;
  onNodeDragStop: NonNullable<
    ReactFlowProps<DeckFlowNode, DeckFlowEdge>["onNodeDragStop"]
  >;
  onCanvasDragOver: DragEventHandler<HTMLElement>;
  onCanvasDrop: DragEventHandler<HTMLElement>;
  setFlowInstance: Dispatch<
    SetStateAction<ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null>
  >;
  flowInstance: ReactFlowInstance<DeckFlowNode, DeckFlowEdge> | null;
  onLayout: () => void;
};

export default function DeckCreateCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  isValidConnection,
  onNodeClick,
  onNodeDragStart,
  onNodeDragStop,
  onCanvasDragOver,
  onCanvasDrop,
  setFlowInstance,
  flowInstance,
  onLayout,
}: Props) {
  return (
    <section
      className="relative flex-1 overflow-hidden"
      onDragOver={onCanvasDragOver}
      onDrop={onCanvasDrop}
    >
      <ReactFlow<DeckFlowNode, DeckFlowEdge>
        nodes={nodes}
        edges={edges}
        nodeTypes={deckCreateNodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onInit={setFlowInstance}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.35}
        maxZoom={2.2}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#334155"
          className="opacity-[0.06] dark:opacity-[0.15]"
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          className="bg-card border border-border rounded-md"
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div className="rounded-xl border border-dashed border-border/50 bg-background/50 p-8 shadow-sm backdrop-blur-[2px]">
            <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
              생각의 구조를 만들어보세요
            </h3>
            <p className="text-sm text-muted-foreground/80">
              좌측 사이드바에서 읽은 책이나 카드를 드래그하여 추가하세요.
              <br />
              노드의 좌우 연결점을 드래그하여 생각들을 연결할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-5 z-10 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-lg">
        <button
          className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomIn()}
          aria-label="확대"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomOut()}
          aria-label="축소"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.fitView({ padding: 0.2 })}
          aria-label="화면 맞춤"
        >
          <Scan className="h-4 w-4" />
        </button>
        <button
          className="border-t border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={onLayout}
          aria-label="자동 정렬"
        >
          <Wand2 className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
