import type { DeckStatus } from "@/entities/deck/model/types";

type DeckRouteTarget = {
  id: number;
  status: DeckStatus;
};

export const getDeckHref = ({ id, status }: DeckRouteTarget) =>
  status === "published" ? `/decks/${id}` : `/decks/${id}/edit`;
