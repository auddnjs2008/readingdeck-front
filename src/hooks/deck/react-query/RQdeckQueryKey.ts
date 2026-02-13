import type { ReqGetDeckDetail } from "@/service/deck/getDeckDetail";

export const RQdeckQueryKey = {
  all: ["deck"] as const,
  detail: (deckId: ReqGetDeckDetail["path"]["deckId"]) =>
    [...RQdeckQueryKey.all, "detail", deckId] as const,
};

