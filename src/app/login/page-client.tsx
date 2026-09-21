"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/ui/button";

export default function LoginPageClient() {
  const onGoogleLoginClick = async () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google";
  };

  const onKakaoLoginClick = async () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/kakao";
  };

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center gap-2 py-6 text-sm font-semibold sm:py-8">
          <Image
            src="/favicon.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span>ReadingDeck</span>
        </header>

        <main className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <section className="w-full max-w-sm text-center">
            <p className="text-xs font-semibold text-primary">
              문장과 생각이 이어지는 독서 기록
            </p>
            <h1 className="mt-5 text-balance font-serif text-4xl leading-tight font-medium sm:text-[2.75rem]">
              읽고 남긴 생각을 이어가세요.
            </h1>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              책에서 건져 올린 문장과 생각을 한곳에서 계속 기록합니다.
            </p>

            <div className="mt-10 flex flex-col gap-3">
              <button
                type="button"
                onClick={onKakaoLoginClick}
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#FEE500] bg-[#FEE500] px-6 text-sm font-semibold text-[#191600] transition-colors hover:border-[#f2da00] hover:bg-[#f2da00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                className="h-12 w-full cursor-pointer rounded-md border-border bg-transparent text-sm text-foreground hover:bg-muted"
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
            </div>

            <p className="mt-6 text-sm leading-6 text-muted-foreground">
              처음이라면 로그인과 함께 계정이 만들어져요.
            </p>

            <p className="mt-3 text-xs leading-5 text-muted-foreground">
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
          </section>
        </main>

        <footer className="py-6 text-center font-serif text-xs text-muted-foreground sm:py-8">
          ReadingDeck · 읽은 문장과 남긴 생각의 기록
        </footer>
      </div>
    </div>
  );
}
