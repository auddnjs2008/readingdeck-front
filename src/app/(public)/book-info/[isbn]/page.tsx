import { getBookInformation } from "@/entities/book/api/getBookInformation.server";
import { BookInformationView } from "@/entities/book/ui/book-information";
import { BookInformationLibraryAction } from "@/entities/book/ui/book-information/library-action";
type Props = { params: Promise<{ isbn: string }> };
export async function generateMetadata({ params }: Props) {
  const book = await getBookInformation((await params).isbn);
  return { title: book.title, description: book.description?.slice(0, 160) };
}
export default async function Page({ params }: Props) {
  const book = await getBookInformation((await params).isbn);
  return (
    <BookInformationView
      book={book}
      action={<BookInformationLibraryAction book={book} />}
    />
  );
}
