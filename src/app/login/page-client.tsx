"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";
import { Button } from "@/components/ui/button";

export default function LoginPageClient() {
  const router = useRouter();
  const { data: myProfile, isPending } = useMyProfileQuery();

  useEffect(() => {
    if (!myProfile?.id) return;
    router.replace("/books");
  }, [myProfile?.id, router]);

  const onGoogleLoginClick = async () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google";
  };

  const onKakaoLoginClick = async () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
  };

  if (myProfile?.id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(205,164,120,0.12),transparent_38%),linear-gradient(180deg,rgba(255,252,247,0.96),rgba(248,242,234,0.92))] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(205,164,120,0.12),transparent_28%),linear-gradient(180deg,rgba(22,19,17,0.98),rgba(28,24,21,0.96))]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4 py-16 sm:px-6">
        <div className="flex w-full flex-col gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
              <Image
                src="/favicon.svg"
                alt="ReadingDeck"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <h1 className="text-balance text-[1.75rem] font-semibold tracking-tight sm:whitespace-nowrap sm:text-3xl">
              ReadingDeck에 오신 것을 환영합니다
            </h1>
            <p className="text-sm text-muted-foreground">
              카카오나 구글 계정으로 로그인하고 독서 기록을 이어가세요.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/95 text-card-foreground shadow-[0_16px_40px_rgba(55,41,28,0.08)] backdrop-blur dark:border-border dark:bg-card/90 dark:shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <button
                type="button"
                onClick={onKakaoLoginClick}
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#FEE500] bg-[#FEE500] px-6 text-base font-semibold text-[#191600] transition-colors hover:border-[#f2da00] hover:bg-[#f2da00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M12 4C7.03 4 3 7.13 3 10.99c0 2.5 1.68 4.7 4.2 5.95l-.86 3.12a.43.43 0 0 0 .65.47l3.75-2.49c.42.05.84.08 1.26.08 4.97 0 9-3.13 9-6.99C21 7.13 16.97 4 12 4Z"
                  />
                </svg>
                카카오로 시작하기
              </button>

              <Button
                variant="outline"
                size="lg"
                onClick={onGoogleLoginClick}
                className="w-full cursor-pointer border-border/80 bg-background/90 text-foreground hover:bg-muted"
              >
                <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.6 16.3 19 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.2 6.2 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.1 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.7 16.3 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.2 3.2-3.5 5.6-6.3 7.1l6.2 5.2C38.6 37.1 44 32 44 24c0-1.3-.1-2.7-.4-3.5z"
                  />
                </svg>
                Google로 시작하기
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  또는
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                로그인에 문제가 있나요?
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            계속하면 ReadingDeck의{" "}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              이용약관
            </Link>{" "}
            및{" "}
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline"
            >
              개인정보처리방침
            </Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
