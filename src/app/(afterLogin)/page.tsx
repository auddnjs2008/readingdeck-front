import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 px-4 pb-16 pt-20 md:flex-row md:pt-32 md:pb-24 sm:px-6 lg:px-8">
          <div className="z-10 flex flex-1 flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
              Capture thoughts,
              <br />
              <span className="bg-linear-to-r from-[#137fec] to-[#60a5fa] bg-clip-text text-transparent">
                not just pages.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-muted-foreground md:mx-0 md:text-xl">
              Stop worrying about finishing the book. Start building a library
              of ideas that matter to you. Your personal insight deck awaits.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
              <Button size="lg">
                Start choosing your book
                <span className="text-sm font-bold">→</span>
              </Button>
              <Button variant="secondary" size="lg">
                View demo
              </Button>
            </div>
          </div>

          <div className="relative flex h-[400px] w-full flex-1 items-center justify-center md:h-[500px]">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-primary/10 to-transparent blur-3xl opacity-30"></div>
            <div className="relative w-full max-w-md perspective-[1000px]">
              <Card className="absolute left-0 top-0 w-full translate-x-[20px] translate-y-[-40px] scale-90 p-6 opacity-60 shadow-2xl transition-transform duration-500">
                <div className="mb-4 h-2 w-1/3 rounded bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-muted"></div>
                  <div className="h-2 w-5/6 rounded bg-muted"></div>
                  <div className="h-2 w-4/6 rounded bg-muted"></div>
                </div>
              </Card>

              <Card className="absolute left-0 top-0 z-10 w-full translate-x-[10px] translate-y-[-20px] scale-95 p-6 opacity-80 shadow-2xl transition-transform duration-500">
                <CardHeader className="mb-4 flex flex-row items-center gap-3 p-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/50 text-blue-400">
                    <span className="text-xs font-bold">MM</span>
                  </div>
                  <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                    Mental Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                    &quot;The map is not the territory. We build models to
                    navigate the world, but must never confuse the model with
                    reality.&quot;
                  </p>
                </CardContent>
              </Card>

              <Card className="relative z-20 w-full p-8 shadow-2xl transition-transform duration-500 hover:-translate-y-2">
                <CardHeader className="mb-6 flex flex-row items-start justify-between p-0">
                  <div className="flex gap-2">
                    <Badge variant="info" className="text-primary">
                      Atomic Habit
                    </Badge>
                    <Badge>James Clear</Badge>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-border"></div>
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="mb-3 text-xl">The 1% Rule</CardTitle>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    Improving by 1% isn&apos;t particularly notable--sometimes it
                    isn&apos;t even noticeable, but it can be far more meaningful,
                    especially in the long run.
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-muted"></div>
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-muted"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">Saved 2m ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/60">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-8 px-4 py-8 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 sm:px-6 md:justify-between lg:px-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">50k+</span>
              <span className="text-sm">Active Readers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">1.2M</span>
              <span className="text-sm">Cards Created</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">4.9</span>
              <div className="flex text-yellow-500">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.88 5.83 6.44.94-4.66 4.55 1.1 6.42L12 17.9l-5.76 3.04 1.1-6.42-4.66-4.55 6.44-.94L12 2.5z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.88 5.83 6.44.94-4.66 4.55 1.1 6.42L12 17.9l-5.76 3.04 1.1-6.42-4.66-4.55 6.44-.94L12 2.5z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.88 5.83 6.44.94-4.66 4.55 1.1 6.42L12 17.9l-5.76 3.04 1.1-6.42-4.66-4.55 6.44-.94L12 2.5z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.88 5.83 6.44.94-4.66 4.55 1.1 6.42L12 17.9l-5.76 3.04 1.1-6.42-4.66-4.55 6.44-.94L12 2.5z" />
                </svg>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.5l2.88 5.83 6.44.94-4.66 4.55 1.1 6.42L12 17.9l-5.76 3.04 1.1-6.42-4.66-4.55 6.44-.94L12 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:py-32 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              The Card Methodology
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-[#92adc9]">
              Shift your focus from completion to comprehension. Our system
              breaks down complex books into manageable, retainable insights.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">1</span>
              </div>
              <CardTitle className="mb-3 text-xl">Select a Book</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Choose from our curated library of non-fiction titles or import
                your own highlights.
              </p>
            </Card>
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">2</span>
              </div>
              <CardTitle className="mb-3 text-xl">Create Cards</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Don&apos;t summarize the whole chapter. Distill key insights
                into single focused cards.
              </p>
            </Card>
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">3</span>
              </div>
              <CardTitle className="mb-3 text-xl">Build Your Deck</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Review your thoughts and build a personal knowledge base, not
                just a finished book list.
              </p>
            </Card>
          </div>
        </section>

        <section className="bg-muted/40 py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Trending Insight Decks
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Discover what others are synthesizing.
                </p>
              </div>
              <a
                className="hidden text-sm font-bold text-[#137fec] hover:underline sm:block"
                href="#"
              >
                View all decks
              </a>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Thinking, Fast and Slow",
                  author: "Daniel Kahneman",
                  cards: "24 Cards",
                  likes: "1.2k",
                  gradient: "from-orange-500 to-red-600",
                },
                {
                  title: "Deep Work",
                  author: "Cal Newport",
                  cards: "18 Cards",
                  likes: "850",
                  gradient: "from-blue-500 to-indigo-600",
                },
                {
                  title: "Sapiens",
                  author: "Yuval Noah Harari",
                  cards: "42 Cards",
                  likes: "3.4k",
                  gradient: "from-green-500 to-emerald-700",
                },
                {
                  title: "Atomic Habits",
                  author: "James Clear",
                  cards: "31 Cards",
                  likes: "5.1k",
                  gradient: "from-yellow-500 to-orange-600",
                },
              ].map((deck) => (
                <Card
                  key={deck.title}
                  className="group cursor-pointer overflow-hidden shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="relative h-32 overflow-hidden bg-gray-800">
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${deck.gradient} opacity-80 transition-transform duration-500 group-hover:scale-105`}
                    ></div>
                    <div className="absolute bottom-3 left-3 text-lg font-bold text-white drop-shadow-md">
                      {deck.title}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {deck.author}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                      <span>{deck.cards}</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 21s-7-4.35-9.33-8.2C.63 9.59 2.3 6 5.8 6c1.98 0 3.31 1.12 4.2 2.39C10.89 7.12 12.22 6 14.2 6c3.5 0 5.17 3.59 3.13 6.8C19 16.65 12 21 12 21z" />
                        </svg>
                        {deck.likes}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-primary p-10 text-center shadow-[0_0_20px_-5px_rgba(19,127,236,0.3)] md:p-16">
            <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5"></div>
            <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-white/5"></div>
            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">
                Ready to build your library?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
                Join thousands of thinkers who are changing how they read. Start
                your free trial today.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white !text-primary hover:bg-gray-100"
              >
                Get Started for Free
              </Button>
              <p className="mt-4 text-xs text-primary-foreground/60">
                No credit card required for 14-day trial.
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-background pb-8 pt-12">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="col-span-2 md:col-span-1">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-[#137fec] text-xs font-black text-white">
                    RD
                  </div>
                  <span className="text-base font-bold">ReadingDeck</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Capture thoughts, not just pages.
                </p>
                <div className="flex gap-4">
                  <a
                    className="text-muted-foreground transition-colors hover:text-[#137fec]"
                    href="#"
                  >
                    <span className="sr-only">Twitter</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a
                    className="text-muted-foreground transition-colors hover:text-[#137fec]"
                    href="#"
                  >
                    <span className="sr-only">GitHub</span>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">
                  Product
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Features
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">
                  Company
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      About
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">
                  Legal
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
              <p>© 2023 ReadingDeck Service. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
