export type BookInformation = {
  isbn: string | null;
  title: string;
  authors: string[];
  publisher: string;
  publishedAt: string | null;
  description: string | null;
  coverUrl: string | null;
};
