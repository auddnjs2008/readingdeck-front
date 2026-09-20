import fetcher from "@/shared/api/fetcher";

export const REACTIONS = {
  agree: "여전히 동의해요",
  changed: "생각이 달라졌어요",
  tried: "실천해 봤어요",
  pondering: "더 생각해 볼래요",
} as const;
export type Reaction = keyof typeof REACTIONS;
export type Reflection = {
  id: number;
  reaction: Reaction;
  note: string | null;
  createdAt: string;
};
export type RelatedCard = {
  id: number;
  thought: string;
  quote: string | null;
  bookId: number;
  bookTitle: string;
  author: string;
};

export async function getReflections(cardId: number, cursor?: number) {
  return (
    await fetcher.get<{ items: Reflection[]; nextCursor: number | null }>(
      `/cards/${cardId}/reflections`,
      { params: { cursor } },
    )
  ).data;
}
export async function createReflection(
  cardId: number,
  body: { reaction: Reaction; note: string; requestId: string },
) {
  return (await fetcher.post<Reflection>(`/cards/${cardId}/reflections`, body))
    .data;
}
export async function deleteReflection(cardId: number, id: number) {
  await fetcher.delete(`/cards/${cardId}/reflections/${id}`);
}
export async function getRelatedCards(cardId: number) {
  return (
    await fetcher.get<{ items: RelatedCard[] }>(`/cards/${cardId}/related`)
  ).data;
}
