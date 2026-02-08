import type { BookDetailSidebarInfo } from "../types";

type Props = Pick<
  BookDetailSidebarInfo,
  "statusLabel" | "progressPercent" | "readAt"
>;

export default function BookDetailProgress({
  statusLabel,
  progressPercent = 100,
  readAt,
}: Props) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Status
        </span>
        {statusLabel != null && (
          <span className="text-xs font-bold text-primary">{statusLabel}</span>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
      {readAt != null && (
        <div className="mt-3 text-right text-[11px] font-medium text-muted-foreground/70">
          {readAt}
        </div>
      )}
    </div>
  );
}
