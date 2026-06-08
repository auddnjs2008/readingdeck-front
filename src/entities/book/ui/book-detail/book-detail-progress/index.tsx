import type { BookDetailSidebarInfo } from "../types";

type Props = Pick<
  BookDetailSidebarInfo,
  | "statusLabel"
  | "progressPercent"
  | "currentPage"
  | "totalPages"
  | "startedAt"
  | "finishedAt"
>;

export default function BookDetailProgress({
  statusLabel,
  progressPercent = 100,
  currentPage,
  totalPages,
  startedAt,
  finishedAt,
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
      <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-muted-foreground/70">
        <span>{progressPercent}%</span>
        {currentPage != null && totalPages != null ? (
          <span>
            {currentPage} / {totalPages}p
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-col gap-1 text-[11px] font-medium text-muted-foreground/70">
        {startedAt ? <span>시작일 {startedAt}</span> : null}
        {finishedAt ? <span>완료일 {finishedAt}</span> : null}
      </div>
    </div>
  );
}
