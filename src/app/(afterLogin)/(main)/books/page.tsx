import type { Metadata } from "next";
import BooksPageClient from "@/components/book/books-page-client";

export const metadata: Metadata = {
  title: "책",
};

export default function BooksPage() {
  return <BooksPageClient />;
}
