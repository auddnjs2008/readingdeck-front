import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "상담",
};

const chips = [
  { label: "Motivated", tone: "text-yellow-400", icon: "Sun" },
  { label: "Melancholic", tone: "text-blue-400", icon: "Drop" },
  { label: "Curious", tone: "text-purple-400", icon: "Explore" },
];

const chatMessages = [
  {
    from: "ai",
    text:
      "Welcome back. To help you find the perfect perspective today, tell me: what is your primary mental state or goal right now?",
  },
  {
    from: "user",
    text: "I&apos;m feeling productive, but I want to build better habits around my work.",
  },
  {
    from: "ai",
    text:
      "Understood. Building systems is key. Is there a specific book you have in mind to start this journey?",
  },
];

export default function ConsultPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-background text-foreground">
      <main className="grid h-full min-h-0 w-full max-w-[1600px] grid-cols-1 gap-6 p-4 lg:grid-cols-12 lg:p-6">
        <section className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl lg:col-span-7">
          <div className="flex items-center gap-3 border-b border-border bg-card p-4">
            <div
              className="relative h-10 w-10 rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBKJrM56O4X_tI9-CpBudmR8r-OZLz8z5S-mg5RfHtFi7jBfQr511j5dZVqVkb5PhA5nwRKL_PzwPLVUquqfO6_1M4hrRXe6N6eLSy8RD3K04eNbuG2MdYw8jKgj5iVIrP9qHMJ8BYYdGLdoP230qvx7EaVB6sVPcZdqpqLj-c7WzMX8x-tJTh0lSgJCUQ5FV_hJ8xKm4-gUBE-MMp-ckMOtXhWqeJO_X2at9SnP7GQmvG5piQhLtvqo6lsM1ZtolYg8vb6nQVm5LQ)",
              }}
            >
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500"></div>
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold">Reading Consultant</p>
              <p className="text-xs text-muted-foreground">AI Assistant • Online</p>
            </div>
            <button className="ml-auto text-muted-foreground transition-colors hover:text-foreground">
              ...
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <div className="flex items-start gap-3">
              <div
                className="mt-1 h-8 w-8 rounded-full bg-cover bg-center opacity-80"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCtdMR-wCBDymTx4dcu0VKSqXAkcWMU1Ml0ZLxMTsKvdV8z1jAjoKkI5ld-QDQpAumNRYzCkICGulwdex6jU1OLfeBgHtjUvLvRHkxBgBM4xR18umfztJKTI3VvHZNHntlxk74Xp7nOiw7oD8lSzKg7S6VapeqPAi6XWCBlm43c1k8_89zi67ZU2GCR4ue_uU1-_RxjAwA36eN14NiZJ-CPRUXGbA_sootcehfYhtDNMhCZ5FCh_4ZqEJkQdlXH2qOwajmb3bcYFxc)",
                }}
              ></div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-muted px-5 py-3 text-sm leading-relaxed text-foreground shadow-sm md:text-base">
                {chatMessages[0].text}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pl-11">
              {chips.map((chip) => (
                <Chip key={chip.label}>
                  <span className={`text-xs font-semibold ${chip.tone}`}>
                    {chip.icon}
                  </span>
                  {chip.label}
                </Chip>
              ))}
              <Chip active>
                Check <span className="text-xs">Productive</span>
              </Chip>
            </div>

            <div className="flex items-end justify-end gap-3">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary px-5 py-3 text-sm leading-relaxed text-primary-foreground shadow-md md:text-base">
                {chatMessages[1].text}
              </div>
              <div
                className="h-8 w-8 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDaEbYWI4A5DnLyQxQWz7wPqTzBGF_nyo2bkHfDivzzLAKOXs8CpJrNlln1K2HuZnNG1KzQO-WVdQyi6Dy6UliZi8w1-HAJXqr9jq_2W6nXajeluBM60o1o7-xKlbubl4dIQsK-5I9NU0BxtAORIGTeE7tc80UWVEdOLHmS0R-45J1ss2ZhXAWAPbMGMYhgAdm7qVSgvtdVqmvVBtuhk32r70n6xRh8YlpHeqd4bps3FcPGjsNMT1zhogOa0tpBMGbfU0Jv-MG9p-w)",
                }}
              ></div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="mt-1 h-8 w-8 rounded-full bg-cover bg-center opacity-80"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAUojbBOZwsuGJ6pEGzFB4Cd8y8olLa0ER4E10HN0qVKft5aq1VhGjJP1WubHJ0cZMhL8_zqXhZCYzZFSPqCYCxu1BhyRo_oldv3bck0eH0QNdG9VZuAPpojyvWpJW6QoLoFCZCcyVxWsYJdCCTO-WHAznSFbG5g7t6nWOG4ueXoljce-3NEMyVkIdrKElejhmUbbEdo5MwJgPxtdBVDoVjwro0pMHEY3tQicdyN-zJp8gFCEnDgezDA-iKJUZaXArEYWx8why8n-M)",
                }}
              ></div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-muted px-5 py-3 text-sm leading-relaxed text-foreground shadow-sm md:text-base">
                {chatMessages[2].text}
              </div>
            </div>
          </div>

          <div className="border-t border-border bg-card p-4">
            <label className="flex h-14 items-stretch overflow-hidden rounded-xl border border-border bg-background transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-ring">
              <div className="flex items-center justify-center pl-4 text-muted-foreground">
                Search
              </div>
              <Input
                className="h-14 border-none bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground"
                placeholder="Enter book title (e.g., Atomic Habits)"
                defaultValue="Atomic Habits"
              />
              <Button className="m-1 px-6 text-sm font-bold">
                <span className="mr-2 hidden sm:inline">Generate</span>
                Send
              </Button>
            </label>
          </div>
        </section>

        <section className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card/60 lg:col-span-5">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 to-transparent"></div>
          <div className="z-10 flex items-center justify-between border-b border-border/50 p-6">
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              AI Reading Simulation
            </h3>
            <span className="rounded bg-primary/20 px-2 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              Preview
            </span>
          </div>
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/30 opacity-60 blur-2xl transition-opacity duration-500"></div>
              <div
                className="relative h-[270px] w-[180px] rounded-l-sm rounded-r-md bg-cover bg-center shadow-[10px_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:-rotate-1 hover:scale-105"
                style={{
                  backgroundImage:
                    "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBMvJZB-SBQ4ke7pD1VVbszbknWUvw2HNLZmQWpePihD4cs2TpUbOxqidySrCPsfkFdhC408VnCxdk_puhcQC7EbvG2g79zWw301ZXcaXiFOFE4v6QmICkCvpvcQCqC1dQIAlwxX3ATFB8IHrUIxjv979yycgXKhVCjWC5i0xb2_C7n9v1A3eDHEvWTxUz4ZBkYbpzXJLuOiNQdw0-uO2eDnjTOp96m8jpFWggSkDj5Cf5JpfsKH9Klo311UZFmZDVptYIZPRXk2Dk)",
                }}
              >
                <div className="absolute left-0 top-0 h-full w-2 bg-linear-to-r from-white/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end rounded-l-sm rounded-r-md bg-linear-to-t from-black/80 via-transparent to-transparent p-4">
                  <p className="text-lg font-bold text-white">Atomic Habits</p>
                  <p className="mt-1 text-xs text-muted-foreground">James Clear</p>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full max-w-md space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 p-5 backdrop-blur-[10px]">
                <div className="relative z-10 pl-8">
                  <p className="text-base font-light italic leading-relaxed text-foreground/90">
                    &quot;If you read this, you will stop focusing on goals and start focusing on systems. You&apos;ll learn that 1% better every day is a mathematical certainty for success.&quot;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Key Perspective
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    T
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Read Time
                    </p>
                    <p className="text-sm font-medium text-foreground">5h 35m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    D
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">
                      Difficulty
                    </p>
                    <p className="text-sm font-medium text-foreground">Moderate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 bg-card/80 p-6 backdrop-blur-sm">
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90">
              <span>Start Reading This Journey</span>
              <span className="text-xs">-&gt;</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
