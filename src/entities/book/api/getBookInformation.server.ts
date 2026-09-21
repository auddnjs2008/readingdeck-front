import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { serverFetcher } from "@/shared/api/server-fetcher";
import type { BookInformation } from "../model/book-information";

export const getBookInformation = cache(async (isbn: string) => {
  if (
    !/^97[89]\d{10}$/.test(isbn) ||
    [...isbn].reduce((s, n, i) => s + Number(n) * (i % 2 ? 3 : 1), 0) % 10
  )
    notFound();
  return serverFetcher<BookInformation>(`/books/info/${isbn}`);
});
