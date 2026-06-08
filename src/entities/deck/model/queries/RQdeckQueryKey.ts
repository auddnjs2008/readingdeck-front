import type { ReqGetDecks } from "@/entities/deck/api/getDecks";
import type { ReqGetDeckDetail } from "@/entities/deck/api/getDeckDetail";

export const RQdeckQueryKey = {
  all: ["deck"] as const,
  list: (req?: ReqGetDecks) =>
    [...RQdeckQueryKey.all, "list", req?.query ?? {}] as const,
  detail: (deckId: ReqGetDeckDetail["path"]["deckId"]) =>
    [...RQdeckQueryKey.all, "detail", deckId] as const,
};
