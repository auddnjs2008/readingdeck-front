import fetcher from "@/shared/api/fetcher";

export type AiChatUsage = {
  limit: number;
  remaining: number;
  resetsAt: string;
};

export const getChatUsage = async (): Promise<AiChatUsage> => {
  const result = await fetcher.get<AiChatUsage>("/ai/chat/usage");
  return result.data;
};

export type ReqAiChat = {
  body: {
    message: string;
    threadId?: string;
    limit?: number;
  };
};

export type AiChatSource = {
  cardId: number;
  type: "insight" | "change" | "action" | "question";
  thought: string;
  quote: string | null;
  bookTitle: string;
  author: string;
  pageStart: number | null;
  pageEnd: number | null;
};

export type ResAiChat = {
  threadId: string;
  answer: string;
  sources: AiChatSource[];
};

export const chat = async (req: ReqAiChat) => {
  const result = await fetcher.post<ResAiChat>("/ai/chat", req.body);
  return result.data;
};
