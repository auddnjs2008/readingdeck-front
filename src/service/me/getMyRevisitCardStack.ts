import fetcher from "../fetcher";

export type ResGetMyRevisitCardStack = {
  items: {
    id: number;
    type: string;
    quote: string | null;
    thought: string;
    revisitCount: number;
    lastRevisitedAt: string | null;
    createdAt: string;
    book: {
      id: number;
      title: string;
      author: string;
      backgroundImage: string | null;
    };
  }[];
};

export const getMyRevisitCardStack = async () => {
  const result = await fetcher.get<ResGetMyRevisitCardStack>(
    "/me/revisit-card-stack"
  );
  return result.data;
};
