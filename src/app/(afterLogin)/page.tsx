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
              생각을 기록하세요,
              <br />
              <span className="bg-linear-to-r from-[#137fec] to-[#60a5fa] bg-clip-text text-transparent">
                페이지가 아니라 통찰을.
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-muted-foreground md:mx-0 md:text-xl">
              책을 다 읽는 데에 집착하지 마세요. 나에게 의미 있는 아이디어로
              라이브러리를 만들어가세요. 나만의 인사이트 덱이 기다립니다.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
              <Button size="lg">
                읽을 책 고르기
                <span className="text-sm font-bold">→</span>
              </Button>
              <Button variant="secondary" size="lg">
                데모 보기
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
                      Atomic Habits
                    </Badge>
                    <Badge>James Clear</Badge>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-border"></div>
                </CardHeader>
                <CardContent className="p-0">
                  <CardTitle className="mb-3 text-xl">1%의 법칙</CardTitle>
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    1%의 개선은 눈에 띄지 않을 때도 있지만, 장기적으로는 훨씬
                    더 큰 변화를 만든다.
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex -space-x-2">
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-muted"></div>
                      <div className="h-6 w-6 rounded-full border-2 border-background bg-muted"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      2분 전 저장됨
                    </span>
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
              <span className="text-sm">활성 사용자</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">1.2M</span>
              <span className="text-sm">생성된 카드</span>
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
              카드 방식으로 읽기
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-[#92adc9]">
              완독보다 이해에 집중하세요. 복잡한 내용을 카드 단위로 쪼개
              기억에 남는 통찰로 만듭니다.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">1</span>
              </div>
              <CardTitle className="mb-3 text-xl">책을 선택하세요</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                큐레이션된 비문학 라이브러리에서 고르거나, 직접 하이라이트를
                가져올 수 있어요.
              </p>
            </Card>
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">2</span>
              </div>
              <CardTitle className="mb-3 text-xl">카드를 만드세요</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                챕터 전체를 요약하지 말고, 핵심 통찰을 한 장의 카드로
                정리하세요.
              </p>
            </Card>
            <Card className="group p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#137fec]/50 hover:shadow-lg">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#137fec]/10 text-[#137fec] transition-colors group-hover:bg-[#137fec] group-hover:text-white">
                <span className="text-base font-bold">3</span>
              </div>
              <CardTitle className="mb-3 text-xl">나만의 덱 만들기</CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                생각을 복습하며 개인 지식 베이스를 쌓아가세요. 완독 목록이
                아니라 통찰의 덱입니다.
              </p>
            </Card>
          </div>
        </section>

        <section className="bg-muted/40 py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  인기 인사이트 덱
                </h2>
                <p className="mt-2 text-muted-foreground">
                  다른 사람들의 요약과 통찰을 살펴보세요.
                </p>
              </div>
              <a
                className="hidden text-sm font-bold text-[#137fec] hover:underline sm:block"
                href="#"
              >
                전체 보기
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
                이제 당신의 라이브러리를 만들어볼까요?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">
                읽는 방식을 바꾸는 수천 명의 사용자와 함께하세요. 지금 무료
                체험을 시작하세요.
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary! hover:bg-gray-100"
              >
                무료로 시작하기
              </Button>
              <p className="mt-4 text-xs text-primary-foreground/60">
                14일 무료 체험에 카드가 필요하지 않습니다.
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
                  페이지가 아니라 통찰을 기록하세요.
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
                <h4 className="mb-4 font-bold text-foreground">제품</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      기능
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      요금제
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      자주 묻는 질문
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">회사</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      소개
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      블로그
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      채용
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-bold text-foreground">법적 고지</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      개인정보 처리방침
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-[#137fec]" href="#">
                      이용약관
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
              <p>© 2023 ReadingDeck Service. 모든 권리 보유.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
