import fetcher from "../fetcher";

export type ReqUpdateCard = {
  path: {
    cardId: number;
  };
  body: {
    type?: "insight" | "change" | "action" | "question";
    thought?: string;
    quote?: string;
    pageStart?: number;
    pageEnd?: number;
  };
};

export type ResUpdateCard = {
  id: number;
  type: "insight" | "change" | "action" | "question";
  quote: string | null;
  thought: string;
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  pageStart: number | null;
  pageEnd: number | null;
};

export const updateCard = async (req: ReqUpdateCard) => {
  const { data } = await fetcher.patch<ResUpdateCard>(
    `/cards/${req.path.cardId}`,
    req.body
  );
  return data;
};
