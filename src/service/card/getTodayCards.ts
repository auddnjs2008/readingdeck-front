import fetcher from "../fetcher";

export type ReqGetTodayCards = {
  query?: {
    limit?: number;
  };
};

export type ResGetTodayCardsItem = {
  id: number;
  type: "insight" | "change" | "action" | "question";
  quote: string | null;
  thought: string;
  backgroundImage: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  book: {
    id: number;
    title: string;
    author: string;
    contents: string | null;
    publisher: string;
    backgroundImage: string | null;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
};

export type ResGetTodayCards = ResGetTodayCardsItem[];

export const getTodayCards = async (req?: ReqGetTodayCards) => {
  const result = await fetcher.get<ResGetTodayCards>("/cards/today", {
    params: req?.query,
  });
  return result.data;
};
