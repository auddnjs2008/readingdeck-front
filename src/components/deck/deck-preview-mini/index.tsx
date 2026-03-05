import { cn } from "@/components/ui/utils";
import type { DeckPreview } from "@/service/deck/getDecks";

type PreviewProps = {
  preview: DeckPreview | null;
};

export function DeckPreviewMini({ preview }: PreviewProps) {
  const chipClassByType: Record<string, string> = {
    insight:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    question:
      "border-rose-600/30 bg-rose-600/10 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
    change:
      "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    action:
      "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
    quote:
      "border-violet-600/30 bg-violet-600/10 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300",
  };

  if (!preview) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
    );
  }

  if (preview.kind === "list") {
    if (preview.items.length === 0) {
      return (
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
      );
    }

    const visibleItems = preview.items.slice(0, 3);

    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-16" />
        <div className="space-y-2 px-4  flex flex-col items-start">
          {visibleItems.map((item, index) => {
            const baseChipClass =
              chipClassByType[item.t] ??
              "border-border/60 bg-muted/50 text-muted-foreground";

            const isRight = index % 2 === 1;

            return (
              <div
                key={`list-preview-${index}`}
                className={cn(
                  " w-[80%] rounded-xl border border-border/70 bg-card/90 px-3 py-2 dark:bg-card/85 ",
                  isRight ? "self-end" : "self-start"
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wide ${baseChipClass}`}
                  >
                    {item.t}
                  </span>
                </div>
                <p className="line-clamp-1 text-[9px] font-medium leading-snug text-foreground">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
        {/* <div className="absolute bottom-6 right-7 rounded-lg border border-border/70 bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {preview.itemCount} cards
        </div> */}
      </div>
    );
  }

  if (preview.nodes.length === 0 && preview.edges.length === 0) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px] opacity-20" />
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
          <circle cx="1" cy="1" r="0.45" fill="var(--color-muted-foreground)" />
        </pattern>
      </defs>
      {preview.edges.map((edge, index) => (
        <line
          key={`edge-${index}`}
          x1={edge.sx * 100}
          y1={edge.sy * 100}
          x2={edge.tx * 100}
          y2={edge.ty * 100}
          stroke="var(--color-muted-foreground)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      ))}
      {preview.nodes.map((node, index) => (
        <circle
          key={`node-${index}`}
          cx={node.x * 100}
          cy={node.y * 100}
          r={node.t === "book" ? 2.2 : 2}
          fill={
            node.t === "book"
              ? "var(--color-primary)"
              : "var(--color-foreground)"
          }
          opacity="0.92"
        />
      ))}
    </svg>
  );
}
