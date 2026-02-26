import fetcher from "../fetcher";

export type ReqDeleteDeck = {
  path: {
    deckId: number;
  };
};

export type ResDeleteDeck = {
  id: number;
};

export const deleteDeck = async (req: ReqDeleteDeck) => {
  const result = await fetcher.delete<ResDeleteDeck>(`/decks/${req.path.deckId}`);
  return result.data;
};
