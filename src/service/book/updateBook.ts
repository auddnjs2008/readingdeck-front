import fetcher from "../fetcher";

export type ReqUpdateBook = {
  path: {
    bookId: number;
  };
  body: {
    status?: "reading" | "finished" | "paused";
    currentPage?: number | null;
    totalPages?: number | null;
    startedAt?: string | null;
    finishedAt?: string | null;
  };
};

export type ResUpdateBook = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  backgroundImage: string | null;
  contents: string | null;
  status: "reading" | "finished" | "paused";
  progressPercent: number;
  currentPage: number | null;
  totalPages: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const updateBook = async (req: ReqUpdateBook) => {
  const result = await fetcher.patch<ResUpdateBook>(
    `/books/${req.path.bookId}`,
    req.body
  );
  return result.data;
};
