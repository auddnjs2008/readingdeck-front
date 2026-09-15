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
  const progressWidth = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="border-y border-black/10 py-5 dark:border-white/10">
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-[#77726b] dark:text-[#aaa49b]">
          독서 상태
        </span>
        {statusLabel != null && (
          <span className="font-medium text-[#a45138] dark:text-[#d77b5e]">
            {statusLabel}
          </span>
        )}
      </div>
      <div className="h-1.5 w-full bg-black/8 dark:bg-white/10">
        <div
          className="h-full bg-[#a45138] transition-all dark:bg-[#d77b5e]"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-[#77726b] dark:text-[#aaa49b]">
        <span>{progressPercent}%</span>
        {currentPage != null && totalPages != null ? (
          <span>
            {currentPage} / {totalPages}p
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-col gap-1 text-xs text-[#77726b] dark:text-[#aaa49b]">
        {startedAt ? <span>시작일 {startedAt}</span> : null}
        {finishedAt ? <span>완료일 {finishedAt}</span> : null}
      </div>
    </div>
  );
}
