import "server-only";

import type {
  ReqGetBookDetail,
  ResGetBookDetail,
} from "@/entities/book/api/getBookDetail";
import { serverFetcher } from "@/shared/api/server-fetcher";

export const getBookDetailServer = async (req: ReqGetBookDetail) => {
  return serverFetcher<ResGetBookDetail>(`/books/${req.path.bookId}`);
};
