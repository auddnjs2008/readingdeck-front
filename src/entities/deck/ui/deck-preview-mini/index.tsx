import type { DeckPreview } from "@/entities/deck/api/getDecks";

type PreviewProps = {
  preview: DeckPreview | null;
};

export function DeckPreviewMini({ preview }: PreviewProps) {
  if (!preview) {
    return <div className="absolute inset-0 bg-muted/20" aria-hidden="true" />;
  }

  if (preview.kind === "list") {
    if (preview.items.length === 0) {
      return <div className="absolute inset-0 bg-muted/20" aria-hidden="true" />;
    }

    const visibleItems = preview.items.slice(0, 3);

    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="flex h-full flex-col justify-center gap-1.5 px-3 py-3">
          {visibleItems.map((item, index) => (
            <div
              key={`list-preview-${index}`}
              className="min-w-0 rounded-[4px] border border-border/50 bg-background/80 px-2.5 py-1.5 dark:bg-background/30"
            >
              <div className="flex min-w-0 items-baseline gap-1.5">
                <span className="shrink-0 text-[7px] font-medium uppercase tracking-wide text-muted-foreground">
                  {item.t}
                </span>
                <p className="min-w-0 flex-1 line-clamp-1 text-[9px] font-medium leading-snug text-foreground">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (preview.nodes.length === 0 && preview.edges.length === 0) {
    return <div className="absolute inset-0 bg-muted/20" aria-hidden="true" />;
  }

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {preview.edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.sx * 100}
          y1={edge.sy * 100}
          x2={edge.tx * 100}
          y2={edge.ty * 100}
          stroke="var(--color-muted-foreground)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}
      {preview.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x * 100}
          cy={node.y * 100}
          r={node.t === "book" ? 2.4 : 1.8}
          fill={
            node.t === "book"
              ? "var(--color-primary)"
              : "var(--color-foreground)"
          }
          opacity={node.t === "book" ? 0.92 : 0.72}
        />
      ))}
    </svg>
  );
}
