"use client";

import { useEffect } from "react";
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

  const onLoginClick = async () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google";
  };

  if (myProfile?.id) {
    return null;
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4 py-16 sm:px-6">
        <div className="flex w-full flex-col gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 5.5C5 4.12 6.12 3 7.5 3h9C17.88 3 19 4.12 19 5.5v13c0 1.38-1.12 2.5-2.5 2.5h-9C6.12 21 5 19.88 5 18.5v-13zm2.5 1A1.5 1.5 0 0 0 6 8v10.5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V8A1.5 1.5 0 0 0 16.5 6.5h-9zm1.5 2h6a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2zm0 4h8a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome to ReadingDeck
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue, or create your account in seconds.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-xl">
            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <Button
                variant="outline"
                size="lg"
                onClick={onLoginClick}
                className="w-full bg-background text-foreground hover:bg-muted cursor-pointer"
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
                Continue with Google
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Trouble logging in?
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            By continuing, you agree to ReadingDeck&apos;s{" "}
            <Link href="/terms" className="underline-offset-4 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
