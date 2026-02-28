"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
};

const linkClass =
  "h-10 w-10 rounded-full border-border/70 bg-muted/30 text-foreground hover:bg-muted/60 transition-colors";
const mutedLinkClass =
  "h-10 w-10 rounded-full border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/60 transition-colors";
const activeLinkClass =
  "h-10 w-10 rounded-full border border-primary/30 bg-primary/10 text-primary font-bold shadow-sm";

function buildPageHref(currentParams: URLSearchParams, page: number): string {
  const p = new URLSearchParams(currentParams.toString());
  p.set("page", String(page));
  return `?${p.toString()}`;
}

export default function LibraryPagination({
  currentPage,
  totalPages,
}: Props) {
  const searchParams = useSearchParams();
  const showPages = getVisiblePages(currentPage, totalPages);

  return (
    <Pagination className="border-t border-border/60 pt-8">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationLink
            href={
              currentPage > 1
                ? buildPageHref(searchParams, currentPage - 1)
                : "#"
            }
            className={mutedLinkClass}
            aria-disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
        {showPages.map((pageNum, i) =>
          pageNum === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <span className="px-1 text-sm font-medium text-muted-foreground">
                ...
              </span>
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={buildPageHref(searchParams, pageNum)}
                isActive={currentPage === pageNum}
                className={
                  currentPage === pageNum ? activeLinkClass : linkClass
                }
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationLink
            href={
              currentPage < totalPages
                ? buildPageHref(searchParams, currentPage + 1)
                : "#"
            }
            className={mutedLinkClass}
            aria-disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getVisiblePages(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  if (current <= 4) {
    pages.push(1, 2, 3, "ellipsis", total);
  } else if (current >= total - 3) {
    pages.push(1, "ellipsis", total - 2, total - 1, total);
  } else {
    pages.push(1, "ellipsis", current, "ellipsis", total);
  }
  return pages;
}
