"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/shared/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
};

const linkClass =
  "h-10 w-10 rounded-none! border-0! bg-transparent! text-foreground hover:text-primary transition-colors";
const mutedLinkClass =
  "h-10 w-10 rounded-none! border-0! bg-transparent! text-muted-foreground hover:text-primary aria-disabled:opacity-30 transition-colors";
const activeLinkClass =
  "h-10 w-10 rounded-none! border-0! border-b-2! border-primary! bg-transparent! text-primary! font-medium";

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
    <Pagination className="pt-4">
      <PaginationContent className="flex-wrap justify-center gap-1">
        <PaginationItem>
          <PaginationLink
            href={
              currentPage > 1
                ? buildPageHref(searchParams, currentPage - 1)
                : "#"
            }
            className={mutedLinkClass}
            aria-disabled={currentPage <= 1}
            aria-label="이전 페이지"
            tabIndex={currentPage <= 1 ? -1 : undefined}
            onClick={(event) => { if (currentPage <= 1) event.preventDefault(); }}
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
            aria-label="다음 페이지"
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            onClick={(event) => { if (currentPage >= totalPages) event.preventDefault(); }}
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
