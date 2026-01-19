import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type TimelineItem = {
  type: string;
  typeClass: string;
  dotClass?: string;
  body?: string;
  quote?: string;
  meta: string;
  actions: string[];
};

type TimelineSection = {
  title: string;
  items: TimelineItem[];
};

const timelineSections: TimelineSection[] = [
  {
    title: "Today",
    items: [
      {
        type: "Note",
        typeClass: "bg-blue-500/10 text-blue-300",
        body: "Starting to rethink how I structure my morning cues based on the environment design chapter.",
        meta: "2 mins ago",
        actions: ["..."],
      },
    ],
  },
  {
    title: "Last Week",
    items: [
      {
        type: "Insight",
        typeClass: "text-teal-400/90",
        dotClass: "bg-teal-400",
        body: "&quot;Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.&quot;",
        meta: "Oct 24 - Page 14",
        actions: ["Edit", "Delete"],
      },
      {
        type: "Question",
        typeClass: "text-purple-400/90",
        dotClass: "bg-purple-400",
        body: "How does the concept of &quot;identity-based habits&quot; apply to creative endeavors versus purely repetitive administrative tasks? Does the identity shift happen faster with tangible output?",
        meta: "Oct 20 - Page 34",
        actions: ["Edit"],
      },
    ],
  },
  {
    title: "Earlier",
    items: [
      {
        type: "Change",
        typeClass: "text-amber-400/90",
        dotClass: "bg-amber-400",
        body: "I need to implement the 2-minute rule immediately for my morning routine. If it takes less than 2 minutes (like making the bed), do it immediately.",
        meta: "Oct 12 - Page 140",
        actions: ["..."],
      },
      {
        type: "Quote",
        typeClass: "text-blue-400/90",
        dotClass: "bg-blue-400",
        quote:
          "&quot;You do not rise to the level of your goals. You fall to the level of your systems.&quot;",
        meta: "Oct 05 - Page 27",
        actions: ["..."],
      },
    ],
  },
];

const activityBars = [2, 4, 3, 0, 6, 8, 5, 2, 0, 3, 5, 7, 4, 8, 10, 6, 3];

export default function BookDetailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="flex h-full flex-col px-6 py-8 md:px-12 lg:px-24 xl:px-40">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-[320px]">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                <a
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href="#"
                >
                  <span className="text-xs font-semibold">&lt;-</span> Library
                </a>
              </div>

              <div className="group relative w-full aspect-2/3 overflow-hidden rounded-lg bg-muted shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBTukVqOV_ZOHJpCPERYcT7FMiaFADS38tfnjnCYDjhycFZNsnto5oEFAuwb1AnWu9UOWs-tvGrhVhcZ0TjGBS3WW8_nAiPZQL_R59KblMc0yZJegYUh93xpirNkNKzI7nVs_YF6yeNUI1dMGw9xWhVjBB6NsR0IZR4Mj6G11QUyWrXCgIOtH7QwcxOxvdO3FiNGW7JzkqG3rzjAIBJWG4sBvXRTN9hy2oMDoNvmvCFQmncUDHmCrIeXPxsQSvT628gamaANnYhYs8)",
                  }}
                  aria-hidden="true"
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Thought Journey</span>
                  <span className="opacity-60">Last 30 days</span>
                </div>
                <div
                  className="flex h-10 items-end gap-[3px] opacity-80"
                  title="Card creation density"
                >
                  {activityBars.map((height, index) => (
                    <div
                      key={`bar-${index}`}
                      className={`w-1.5 rounded-t-sm ${
                        height ? "bg-primary/70" : "bg-transparent"
                      }`}
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
                    Atomic Habits
                  </h1>
                  <p className="mt-1 text-lg font-medium text-muted-foreground">
                    James Clear, 2018
                  </p>
                </div>
                <div className="relative mt-2">
                  <div className="absolute -left-3 top-1 text-muted-foreground/50">
                    <span className="text-xs font-semibold">PIN</span>
                  </div>
                  <div className="pl-4">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Core Question
                    </span>
                    <p className="font-medium italic leading-snug text-foreground/90">
                      &quot;How can tiny changes compound into remarkable
                      results?&quot;
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-amber-400/80">
                  {"*****".split("").map((star, index) => (
                    <span key={`star-${index}`} className="text-sm">
                      {star}
                    </span>
                  ))}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (4.8)
                  </span>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-border/70 bg-card p-4">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Status
                  </span>
                  <span className="text-xs font-bold text-primary">
                    Finished
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-primary shadow-[0_0_10px_rgba(19,127,236,0.3)]"></div>
                </div>
                <div className="mt-2 text-right text-[10px] uppercase tracking-wide text-muted-foreground">
                  Read Oct 2023
                </div>
              </div>

              <a
                className="mt-4 hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:flex"
                href="#"
              >
                <span className="text-xs font-semibold">&lt;-</span> Back to
                Library
              </a>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2 flex flex-row items-baseline justify-between gap-4 pb-4">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Reading Feed
                </h2>
                <p className="text-sm text-muted-foreground">12 thoughts</p>
              </div>
              <Button variant="ghost" size="sm" className="px-0 text-muted-foreground">
                Filter
              </Button>
            </div>

            <div className="relative mb-10">
              <div className="group relative overflow-hidden rounded-xl border border-border bg-card/60 transition-colors focus-within:border-primary/50 focus-within:bg-card focus-within:ring-1 focus-within:ring-ring hover:bg-card">
                <Textarea
                  className="min-h-20 border-none bg-transparent p-5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:ring-0"
                  placeholder="What is this page telling you right now?"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100">
                  <span className="mr-2 text-xs font-medium text-muted-foreground/70">
                    Cmd + Enter to save
                  </span>
                  <Button className="h-8 w-8 rounded-full p-0 text-xs font-semibold">
                    UP
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {timelineSections.map((section) => (
                <div
                  key={section.title}
                  className="relative border-l border-border pl-6"
                >
                  <h3 className="absolute -left-[5px] top-0 mb-4 bg-background py-1 pr-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {section.title}
                  </h3>
                  <div className="pt-8">
                    {section.items.map((item, index) => (
                      <div
                        key={`${section.title}-${index}`}
                        className="group mb-4 flex flex-col gap-3 rounded-xl border border-border bg-card/70 p-5 transition-all hover:border-border/80 hover:bg-card"
                      >
                        <div className="flex items-start justify-between">
                          {item.dotClass ? (
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${item.typeClass}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`}
                              ></span>
                              {item.type.toUpperCase()}
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium tracking-wide ${item.typeClass}`}
                            >
                              {item.type.toUpperCase()}
                            </span>
                          )}
                          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            {item.actions.map((action) => (
                              <button
                                key={action}
                                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>

                        {item.quote ? (
                          <blockquote className="my-1 border-l-2 border-primary/50 pl-4 text-base font-light italic leading-relaxed text-foreground/90">
                            {item.quote}
                          </blockquote>
                        ) : (
                          <p className="text-base font-light leading-relaxed text-foreground/80">
                            {item.body}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                          <span className="text-xs text-muted-foreground/70">
                            {item.meta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-start pl-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 text-xs font-medium uppercase tracking-wide text-muted-foreground"
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
