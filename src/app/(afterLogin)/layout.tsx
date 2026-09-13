"use client";

import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";
import { QueryError } from "@/shared/ui/query-error";

export default function AfterLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, isPending, isError, isFetching, refetch } = useMyProfileQuery({ retry: false });

  if (isError) {
    return <QueryError onRetry={() => void refetch()} isRetrying={isFetching} />;
  }

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
