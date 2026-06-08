"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";

import { cn } from "./utils";

export function Pagination({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full justify-center", className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("flex items-center gap-1", className)} {...props} />;
}

export function PaginationItem({
  className,
  ...props
}: HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)} {...props} />;
}

type PaginationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive?: boolean;
};

export function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-sm font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground",
        isActive && "border-primary/40 bg-primary/10 text-primary",
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious(props: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  );
}

export function PaginationNext(props: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-10 w-10 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
