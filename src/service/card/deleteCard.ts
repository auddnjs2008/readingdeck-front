import fetcher from "../fetcher";

export type ReqDeleteCard = {
  path: {
    cardId: number;
  };
};

export const deleteCard = async (req: ReqDeleteCard) => {
  await fetcher.delete(`/cards/${req.path.cardId}`);
};
