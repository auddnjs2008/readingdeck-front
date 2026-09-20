import type { Metadata } from "next";
import BooksPageClient from "@/entities/book/ui/books-page-client";

export const metadata: Metadata = {
  title: "홈",
};

export default function BooksPage() {
  return <BooksPageClient />;
}
