"use client";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { QueryError } from "@/shared/ui/query-error";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <QueryError
      onRetry={() =>
        startTransition(() => {
          router.refresh();
          reset();
        })
      }
    />
  );
}
