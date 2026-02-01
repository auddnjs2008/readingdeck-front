import fetcher from "../fetcher";

export type ResGetMyDailyCardStack = {
  items: {
    id: number;
    type: string;
    quote: string | null;
    thought: string;
    createdAt: string;
    book: {
      id: number;
      title: string;
    };
  }[];
};

export const getMyDailyCardStack = async () => {
  const result = await fetcher.get<ResGetMyDailyCardStack>(
    "/me/daily-card-stack"
  );
  return result.data;
};
