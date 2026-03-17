import fetcher from "../fetcher";

export type ReqGetBooks = {
  query?: {
    page?: number;
    take?: number;
    keyword?: string;
    sort?: "createdAt" | "updatedAt" | "recentCard" | "mostCards";
    status?: "reading" | "finished" | "paused";
  };
};

export type ResGetBooks = {
  items: {
    id: number;
    title: string;
    author: string;
    publisher: string;
    cardCount: number;
    backgroundImage?: string | null;
    status: "reading" | "finished" | "paused";
    progressPercent: number;
    currentPage: number | null;
    totalPages: number | null;
    startedAt: string | null;
    finishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    total: number;
    page: number;
    take: number;
    totalPages: number;
  };
};

export const getBooks = async (req?: ReqGetBooks) => {
  const result = await fetcher.get<ResGetBooks>("/books", {
    params: req?.query,
  });
  return result.data;
};
