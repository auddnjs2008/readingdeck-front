import fetcher from "../fetcher";

export type ReqCreateFeedback = {
  body: {
    message: string;
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
