import fetcher from "@/shared/api/fetcher";

export const RELATIONS = {
  similar: "비슷해요",
  opposite: "반대돼요",
  extends: "이어져요",
  question: "질문이 생겨요",
} as const;
export type CardRelation = keyof typeof RELATIONS;

export async function addCardConnection(
  deckId: number,
  body: { fromCardId: number; toCardId: number; relation: CardRelation },
) {
  return (
    await fetcher.post<{ deckId: number; alreadyConnected: boolean }>(
      `/decks/${deckId}/card-connections`,
      body,
    )
  ).data;
}
