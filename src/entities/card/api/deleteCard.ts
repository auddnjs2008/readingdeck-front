import fetcher from "@/shared/api/fetcher";

export type ReqDeleteCard = {
  path: {
    cardId: number;
  };
};

export const deleteCard = async (req: ReqDeleteCard) => {
  await fetcher.delete(`/cards/${req.path.cardId}`);
};
