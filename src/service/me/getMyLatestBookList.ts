import fetcher from "../fetcher";

export type ResGetMyLatestBookList = {
  items: {
    id: number;
    title: string;
    author: string;
    publisher: string;
  }[];
};

export const getMyLatestBookList = async () => {
  const result = await fetcher.get<ResGetMyLatestBookList>(
    "/me/latest-book-list"
  );
  return result.data;
};
