import type { ReqGetTodayCards } from "@/service/card/getTodayCards";

export const RQcardQueryKey = {
  all: ["cards"] as const,
  today: (req?: ReqGetTodayCards) =>
    [...RQcardQueryKey.all, "today", req?.query ?? {}] as const,
};
