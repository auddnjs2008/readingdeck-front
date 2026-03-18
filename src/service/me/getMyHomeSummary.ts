import type { ResGetBooks } from "../book/getBooks";
import fetcher from "../fetcher";
import type { ResGetMyRevisitCardStack } from "./getMyRevisitCardStack";

type BookSummaryItem = ResGetBooks["items"][number];
type RevisitCardItem = ResGetMyRevisitCardStack["items"][number];

export type ResGetMyHomeSummary = {
  revisitCards: RevisitCardItem[];
  currentReadingBooks: BookSummaryItem[];
  recentRecordedBooks: BookSummaryItem[];
  deckSuggestions: {
    bookId: number;
    bookTitle: string;
    bookAuthor: string;
    backgroundImage: string | null;
    candidateCardCount: number;
    candidateCardIds: number[];
    cards: {
      id: number;
      type: "insight" | "change" | "action" | "question";
      quote: string | null;
      thought: string;
      createdAt: string;
    }[];
  }[];
};

export const getMyHomeSummary = async () => {
  const result = await fetcher.get<ResGetMyHomeSummary>("/me/home-summary");
  return result.data;
};
