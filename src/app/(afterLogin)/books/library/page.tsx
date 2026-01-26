import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Tag,
} from "lucide-react";
import { mockBooks } from "./mock-books";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-20 xl:px-40">
        <div className="flex w-full max-w-[1200px] flex-1 flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              My Library
            </h1>
            <p className="text-sm text-muted-foreground">
              142 books • 1,204 cards created
            </p>
          </div>

          <div className="flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Button
                size="sm"
                className="h-9 rounded-full px-4 text-sm font-bold"
              >
                All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-full px-4 text-sm"
              >
                Currently Reading
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-full px-4 text-sm"
              >
                Completed
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-full px-4 text-sm"
              >
                Paused
              </Button>
            </div>
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by keyword..."
                  className="h-10 rounded-xl border-border/60 bg-card pl-9 text-sm"
                />
              </div>
              <div className="flex w-full flex-1 gap-3 sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 flex-1 justify-between rounded-xl px-4 sm:flex-none"
                >
                  Sort: Recently Added
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 rounded-xl p-0"
                  title="Filter"
                >
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {mockBooks.map((book) => (
              <div
                key={book.id}
                className="group flex cursor-pointer flex-col gap-3"
              >
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-card shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-primary/10">
                  {book.backgroundImage ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${book.backgroundImage})`,
                      }}
                      aria-hidden="true"
                    ></div>
                  ) : null}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
                  <div className="absolute right-2 top-2">
                    <Badge
                      className={
                        book.status === "Completed"
                          ? "bg-emerald-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider"
                          : book.status === "Paused"
                          ? "bg-amber-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider"
                          : "bg-blue-500/90! text-white shadow-sm backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider"
                      }
                    >
                      {book.status}
                    </Badge>
                  </div>
                  {/* {book.recentInsight ? (
                  <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-white/5 bg-card/95 p-3 text-white/90 backdrop-blur-md transition-transform duration-300 group-hover:translate-y-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Recent Insight
                    </span>
                    <p className="mt-1 text-xs leading-snug text-white/90 line-clamp-2">
                      “{book.recentInsight}”
                    </p>
                  </div>
                ) : null} */}
                </div>
                <div>
                  <h3 className="truncate text-base font-bold leading-tight text-foreground">
                    {book.title}
                  </h3>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {book.author}
                  </p>
                  <div className="mt-2.5 flex">
                    <Badge className="gap-1 bg-card px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary border border-primary/20">
                      <Tag className="h-3 w-3" />
                      {book.cardsCount} Cards
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination className="border-t border-border/60 pt-8">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-10 w-10 rounded-xl border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                >
                  <ChevronLeft className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="h-10 w-10 rounded-xl bg-primary text-white shadow-lg shadow-primary/25"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-10 w-10 rounded-xl border-border/60 bg-card/60 text-foreground hover:bg-card"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-10 w-10 rounded-xl border-border/60 bg-card/60 text-foreground hover:bg-card"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <span className="px-1 text-sm font-medium text-muted-foreground">
                  ...
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-10 w-10 rounded-xl border-border/60 bg-card/60 text-foreground hover:bg-card"
                >
                  12
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  className="h-10 w-10 rounded-xl border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </div>
  );
}
