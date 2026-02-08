import fetcher from "../fetcher";

export type ReqGetBookDetail = {
  path: {
    bookId: number;
  };
};

export type ResGetBookDetail = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  backgroundImage: string | null;
  contents: string | null;
  createdAt: string;
  updatedAt: string;
};

export const getBookDetail = async (req: ReqGetBookDetail) => {
  const result = await fetcher.get<ResGetBookDetail>(
    `/books/${req.path.bookId}`
  );
  return result.data;
};
