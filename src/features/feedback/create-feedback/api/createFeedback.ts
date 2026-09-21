import fetcher from "@/shared/api/fetcher";

export type ReqCreateFeedback = {
  body: {
    message: string;
    category?: "problem" | "suggestion" | "other";
    replyEmail?: string;
    pagePath?: string;
  };
};

export type ResCreateFeedback = {
  ok: boolean;
};

export const createFeedback = async (req: ReqCreateFeedback) => {
  const result = await fetcher.post<ResCreateFeedback>("/feedback", req.body);
  return result.data;
};
