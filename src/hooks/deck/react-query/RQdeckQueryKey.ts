import type { ReqGetDecks } from "@/service/deck/getDecks";
import type { ReqGetDeckDetail } from "@/service/deck/getDeckDetail";

export const RQdeckQueryKey = {
  all: ["deck"] as const,
  list: (req?: ReqGetDecks) =>
    [...RQdeckQueryKey.all, "list", req?.query ?? {}] as const,
  detail: (deckId: ReqGetDeckDetail["path"]["deckId"]) =>
    [...RQdeckQueryKey.all, "detail", deckId] as const,
};
