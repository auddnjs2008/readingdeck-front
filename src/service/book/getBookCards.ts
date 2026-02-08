import fetcher from "../fetcher";

export type ReqGetBookCards = {
  path: {
    bookId: number;
  };
  query?: {
    take?: number;
    cursor?: number;
    types?: ("insight" | "change" | "action" | "question")[];
    hasQuote?: boolean;
    sort?: "latest" | "oldest";
    pageStart?: number;
    pageEnd?: number;
  };
};

export type ResGetBookCards = {
  items: {
    id: number;
    type: "insight" | "change" | "action" | "question";
    quote: string | null;
    thought: string;
    pageStart: number | null;
    pageEnd: number | null;
  }[];
  nextCursor: number | null;
  hasNext: boolean;
};

export const getBookCards = async (req: ReqGetBookCards) => {
  const result = await fetcher.get<ResGetBookCards>(
    `/books/${req.path.bookId}/cards`,
    { params: req.query }
  );
  return result.data;
};
