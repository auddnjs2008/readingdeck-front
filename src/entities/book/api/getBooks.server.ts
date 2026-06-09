import "server-only";

import { serverFetcher } from "@/shared/api/server-fetcher";
import type { ReqGetBooks, ResGetBooks } from "@/entities/book/api/getBooks";

export const getBooksServer = async (req?: ReqGetBooks) => {
  return serverFetcher<ResGetBooks>("/books", {
    query: req?.query,
  });
};
