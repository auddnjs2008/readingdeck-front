import type { DeckPreview } from "@/service/deck/getDecks";

type PreviewProps = {
  preview: Pick<DeckPreview, "nodes" | "edges"> | null;
};

export function DeckPreviewMini({ preview }: PreviewProps) {
  if (!preview || (preview.nodes.length === 0 && preview.edges.length === 0)) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    );
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="url(#deck-grid)"
        opacity="0.28"
      />
      <defs>
        <pattern
          id="deck-grid"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.45" fill="#475569" />
        </pattern>
      </defs>
      {preview.edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.sx * 100}
          y1={edge.sy * 100}
          x2={edge.tx * 100}
          y2={edge.ty * 100}
          stroke="#3a4d6a"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
      {preview.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x * 100}
          cy={node.y * 100}
          r={node.t === "book" ? 2.2 : 2}
          fill={node.t === "book" ? "#4f85e9" : "#9aa9be"}
          opacity="0.92"
        />
      ))}
    </svg>
  );
}
