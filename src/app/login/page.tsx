import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
                className="w-full bg-background text-foreground hover:bg-muted"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.8h5.4c-.2 1.3-1.5 3.8-5.4 3.8A6 6 0 0 1 12 6c1.7 0 2.8.7 3.4 1.3l2.3-2.2C16.2 3.7 14.3 3 12 3a9 9 0 1 0 0 18c5.2 0 8.7-3.6 8.7-8.7 0-.6-.1-1-.2-1.4H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M3.8 7.1l3.1 2.3C7.7 7.3 9.7 6 12 6c1.7 0 2.8.7 3.4 1.3l2.3-2.2C16.2 3.7 14.3 3 12 3c-3.5 0-6.6 2-8.2 5.1z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 21c2.3 0 4.2-.8 5.6-2.1l-2.6-2.1c-.7.5-1.6.8-3 .8a6 6 0 0 1-5.7-4.1l-3.2 2.5A9 9 0 0 0 12 21z"
                  />
                  <path
                    fill="#4285F4"
                    d="M20.5 12.3c0-.6-.1-1-.2-1.5H12v3.8h5.4c-.3 1.5-1.6 2.9-3.4 3.8l2.6 2.1c1.6-1.4 2.6-3.5 2.6-6.2z"
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