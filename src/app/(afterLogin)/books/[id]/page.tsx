import { CreateCardModal } from "@/components/card/create-card-modal";
import { CardFilter } from "@/components/card/card-fiilter";
import { Button } from "@/components/ui/button";
import { mockCards } from "./mock-cards";

const cardStyles = {
  Insight: {
    badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    borderClass: "hover:border-teal-500/30",
  },
  Question: {
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    borderClass: "hover:border-purple-500/30",
  },
  Change: {
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    borderClass: "hover:border-amber-500/30",
  },
  Quote: {
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    borderClass: "hover:border-blue-500/30",
  },
} as const;

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-full flex-col px-6 py-10 md:px-12 lg:px-24 xl:px-40">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-[320px]">
            <div className="sticky top-24 flex flex-col gap-8">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl bg-muted shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBTukVqOV_ZOHJpCPERYcT7FMiaFADS38tfnjnCYDjhycFZNsnto5oEFAuwb1AnWu9UOWs-tvGrhVhcZ0TjGBS3WW8_nAiPZQL_R59KblMc0yZJegYUh93xpirNkNKzI7nVs_YF6yeNUI1dMGw9xWhVjBB6NsR0IZR4Mj6G11QUyWrXCgIOtH7QwcxOxvdO3FiNGW7JzkqG3rzjAIBJWG4sBvXRTN9hy2oMDoNvmvCFQmncUDHmCrIeXPxsQSvT628gamaANnYhYs8)",
                  }}
                  aria-hidden="true"
                ></div>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold leading-tight tracking-tight">
                  Atomic Habits
                </h1>
                <p className="text-lg text-muted-foreground">
                  James Clear, 2018
                </p>
                <div className="mt-1 flex items-center gap-1 text-amber-400">
                  {"*****".split("").map((star, index) => (
                    <span key={`star-${index}`} className="text-base">
                      {star}
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    (4.8)
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Status
                  </span>
                  <span className="text-xs font-bold text-primary">
                    Finished
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-primary"></div>
                </div>
                <div className="mt-3 text-right text-[11px] font-medium text-muted-foreground/70">
                  Read Oct 2023
                </div>
              </div>

              <a
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                href="#"
              >
                <span className="text-xs font-semibold">&lt;-</span> Back to
                Library
              </a>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Reading Cards
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  12 thoughts collected
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-2 border-border/60 bg-card"
                >
                  Filter
                </Button>
                <CreateCardModal />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <CardFilter />
              {mockCards.map((item) => {
                const styles = cardStyles[item.type];
                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col gap-6 overflow-hidden rounded-xl border border-border bg-card/80 p-8 shadow-lg transition-all ${styles.borderClass}`}
                  >
                    {item.backgroundImage ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-30"
                          style={{
                            backgroundImage: `url(${item.backgroundImage})`,
                          }}
                          aria-hidden="true"
                        ></div>
                        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/70 to-background/95"></div>
                      </>
                    ) : null}
                    <div className="relative flex flex-col gap-6">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badgeClass}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {item.quote ? (
                        <div className="border-l-2 border-primary/40 pl-6">
                          <p className="text-lg font-medium italic leading-relaxed text-foreground">
                            “{item.quote}”
                          </p>
                        </div>
                      ) : null}

                      <p className="text-lg font-medium leading-relaxed text-foreground/90">
                        {item.thought}
                      </p>

                      <div className="flex items-center justify-between border-t border-border/60 pt-6">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Card #{item.id}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                >
                  Load older cards <span className="text-xs">v</span>
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
