"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
export function BookInformationBack() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      onClick={() => {
        const sameOrigin =
          document.referrer &&
          new URL(document.referrer).origin === location.origin;
        if (sameOrigin && history.length > 1) router.back();
        else router.push("/community");
      }}
    >
      <ArrowLeft className="size-4" />
      돌아가기
    </button>
  );
}
