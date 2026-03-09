import fetcher from "../fetcher";

export type ReqDeleteBook = {
  path: {
    bookId: number;
  };
};

export const deleteBook = async (req: ReqDeleteBook) => {
  await fetcher.delete(`/books/${req.path.bookId}`);
};
