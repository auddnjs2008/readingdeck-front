import Link from "next/link";

export default function BookDetailBackLink() {
  return (
    <Link
      href="/books/library"
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="text-xs font-semibold">&lt;-</span>
      Back to Library
    </Link>
  );
}
