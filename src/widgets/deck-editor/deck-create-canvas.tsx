"use client";

import {
  Background,
  BackgroundVariant,
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
      className="relative min-h-0 flex-1 overflow-hidden"
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
          color="var(--muted-foreground)"
          className="opacity-20"
        />

      </ReactFlow>

      {nodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <div className="max-w-sm px-6">
            <h3 className="mb-2 font-serif text-xl text-foreground">
              아직 연결된 생각이 없어요
            </h3>
            <p className="text-sm text-muted-foreground/80">
              0개의 노드
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-5 left-5 z-10 flex overflow-hidden rounded-md border border-border bg-background">
        <button
          className="p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomIn()}
          aria-label="확대"
          title="확대"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          className="border-l border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.zoomOut()}
          aria-label="축소"
          title="축소"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          className="border-l border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => flowInstance?.fitView({ padding: 0.2 })}
          aria-label="화면 맞춤"
          title="화면 맞춤"
        >
          <Scan className="h-4 w-4" />
        </button>
        <button
          className="border-l border-border p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={onLayout}
          aria-label="자동 정렬"
          title="자동 정렬"
        >
          <Wand2 className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
