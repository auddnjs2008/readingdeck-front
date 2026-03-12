import fetcher from "../fetcher";

export type ReqRevisitCard = {
  path: {
    cardId: number;
  };
};

export type ResRevisitCard = {
  id: number;
  type: string;
  quote: string | null;
  thought: string;
  revisitCount: number;
  lastRevisitedAt: string | null;
  updatedAt: string;
};

export const revisitCard = async (req: ReqRevisitCard) => {
  const result = await fetcher.patch<ResRevisitCard>(
    `/cards/${req.path.cardId}/revisit`
  );
  return result.data;
};
