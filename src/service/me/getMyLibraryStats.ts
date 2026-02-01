import fetcher from "../fetcher";

export type ResGetMyLibraryStats = {
  bookCount: number;
  cardCount: number;
};

export const getMyLibraryStats = async () => {
  const result = await fetcher.get<ResGetMyLibraryStats>("/me/library-stats");
  return result.data;
};
