import fetcher from "../fetcher";

export type ReqGetCardDetail = {
  path: {
    cardId: number;
  };
};

export type ResGetCardDetail = {
  id: number;
  type: "insight" | "change" | "action" | "question";
  quote: string | null;
  thought: string;
  backgroundImage: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  revisitCount: number;
  lastRevisitedAt: string | null;
  createdAt: string;
  updatedAt: string;
  book: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    backgroundImage: string | null;
  };
};

export const getCardDetail = async (req: ReqGetCardDetail) => {
  const result = await fetcher.get<ResGetCardDetail>(`/cards/${req.path.cardId}`);
  return result.data;
};
