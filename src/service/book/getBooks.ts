import fetcher from "../fetcher";

export type ReqGetBooks = {
  query?: {
    page?: number;
    take?: number;
    keyword?: string;
    sort?: "createdAt" | "recentCard" | "mostCards";
  };
};

export type ResGetBooks = {
  items: {
    id: number;
    title: string;
    author: string;
    publisher: string;
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
