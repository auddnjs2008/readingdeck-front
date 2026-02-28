import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BookDetailBackLink() {
  return (
    <Link
      href="/books/library"
      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      서재로 돌아가기
    </Link>
  );
}
