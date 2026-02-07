import LibraryBookList from "@/components/book/library/library-book-list";
import LibraryPageHeader from "@/components/book/library/library-page-header";
import LibraryToolbar from "@/components/book/library/library-toolbar";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-8">
          <LibraryPageHeader />
          <LibraryToolbar />
          <LibraryBookList />
        </div>
      </main>
    </div>
  );
}
