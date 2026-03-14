"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";

export default function AfterLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useMyProfileQuery();

  useEffect(() => {
    if (!isError) return;
    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login${next}`);
  }, [isError, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        로그인 상태를 확인하고 있습니다...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
