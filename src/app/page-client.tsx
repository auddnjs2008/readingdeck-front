"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import TopNav from "@/widgets/top-nav/ui";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const steps = [
  ["01", "문장을 남깁니다.", "책장을 넘기다 멈춘 문장을 기록합니다."],
  ["02", "생각을 적습니다.", "그 순간 떠오른 질문과 생각을 덧붙입니다."],
  ["03", "서로 연결합니다.", "다른 책의 기록과 이어 하나의 덱을 만듭니다."],
] as const;

const TextLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    {children}
    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
      →
    </span>
  </Link>
);

export default function HomePageClient() {
  const reduceMotion = useReducedMotion();
  const { data: profile, isError } = useMyProfileQuery({ retry: false });
  const hasProfile = !isError && Boolean(profile?.id);
  const entryHref = hasProfile ? "/books" : "/login";
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.55 };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <TopNav />

      <main>
        <section id="about" className="relative scroll-mt-28 border-b border-border pt-36 md:pt-28 lg:min-h-[calc(100svh-3rem)]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-y-0 left-[58%] hidden w-px bg-border lg:block" />
            <div className="absolute right-[8%] top-24 hidden h-px w-[34%] bg-border lg:block" />
          </div>

          <div className="relative mx-auto grid w-full max-w-[1200px] gap-8 px-5 pb-10 sm:gap-12 sm:px-8 sm:pb-16 lg:min-h-[calc(100svh-10rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:pb-20">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
              transition={transition}
              className="relative z-10 max-w-xl"
            >
              <h1 className="font-serif text-4xl leading-none font-medium sm:text-6xl lg:text-7xl">
                ReadingDeck
              </h1>
              <p className="mt-6 max-w-lg font-serif text-2xl leading-[1.35] font-medium text-balance sm:mt-8 sm:text-4xl lg:text-[2.65rem]">
                책을 덮은 뒤,
                <br />
                생각을 펼치세요.
              </p>
              <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-7">
                마음에 남은 문장과 생각을 기록하고 연결해 나만의 독서 흐름을
                만들어보세요.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5 sm:mt-9">
                <Link
                  href={entryHref}
                  className="inline-flex h-11 items-center bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {hasProfile ? "내 기록으로" : "내 기록 시작하기"}
                </Link>
                <TextLink href="/community">공개 덱 둘러보기</TextLink>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
              transition={{ ...transition, delay: reduceMotion ? 0 : 0.15 }}
              className="relative border-l border-border pl-6 sm:min-h-[390px] sm:pl-10 lg:min-h-[470px] lg:pl-14"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
                <span>INSIGHT</span>
                <span className="font-normal text-muted-foreground">p.42</span>
              </div>

              <blockquote className="mt-6 max-w-xl font-serif text-xl leading-[1.55] sm:mt-14 sm:text-3xl sm:leading-[1.6] lg:text-[2rem]">
                “우리는 목표의 수준까지 올라가지 않는다. 시스템의 수준까지
                내려간다.”
              </blockquote>

              <div className="mt-10 hidden max-w-lg border-l-2 border-primary/35 pl-5 sm:mt-12 sm:block">
                <p className="text-xs font-semibold text-primary">나의 생각</p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                  변화는 큰 결심보다 반복할 수 있는 환경에서 시작된다. 내일 아침
                  책상 위에는 읽을 책부터 펼쳐두자.
                </p>
              </div>

              <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground sm:absolute sm:bottom-0 sm:left-10 sm:right-0 sm:mt-0 lg:left-14">
                아토믹 해빗 · 제임스 클리어
              </p>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto w-full max-w-[1200px] scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold text-primary">READING FLOW</p>
              <h2 className="mt-3 font-serif text-3xl font-medium sm:text-4xl">
                문장에서 덱으로
              </h2>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">
              읽은 것을 오래 남기는 세 단계
            </p>
          </div>

          <ol className="mt-12 grid border-t border-border md:grid-cols-3">
            {steps.map(([number, title, description], index) => (
              <li
                key={number}
                className={`border-b border-border py-7 md:border-b-0 md:py-8 ${
                  index > 0 ? "md:border-l md:pl-8" : "md:pr-8"
                }`}
              >
                <span className="text-xs font-semibold text-primary">{number}</span>
                <h3 className="mt-5 font-serif text-xl font-medium">{title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-border bg-muted/20">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-primary">READING DECK</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight font-medium sm:text-4xl">
                생각은 연결될수록 선명해집니다.
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
                다른 책에서 시작된 생각도 하나의 덱 안에서 만나 새로운 흐름이
                됩니다.
              </p>
            </div>

            <div className="mt-14 grid border-y border-border lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[360px] overflow-hidden border-b border-border lg:min-h-[520px] lg:border-r lg:border-b-0">
                <svg
                  viewBox="0 0 600 520"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 155 380 C 245 335, 305 230, 430 145"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/55"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 1.15 }}
                  />
                  <circle cx="155" cy="380" r="11" className="fill-foreground" />
                  <circle cx="430" cy="145" r="15" className="fill-primary" />
                  <circle
                    cx="430"
                    cy="145"
                    r="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/45"
                  />
                </svg>
                <div className="absolute bottom-7 left-7 max-w-44 sm:bottom-10 sm:left-10">
                  <p className="text-xs font-semibold text-primary">시작</p>
                  <p className="mt-2 font-serif text-lg">습관은 환경에서 시작된다.</p>
                </div>
                <div className="absolute right-7 top-7 max-w-44 text-right sm:right-10 sm:top-10">
                  <p className="text-xs font-semibold text-primary">연결된 생각</p>
                  <p className="mt-2 font-serif text-lg">선택을 바꾸는 환경의 힘</p>
                </div>
              </div>

              <article className="flex min-h-[420px] flex-col justify-center px-6 py-12 sm:px-10 lg:min-h-[520px] lg:px-14">
                <p className="text-xs font-semibold text-primary">질문</p>
                <h3 className="mt-5 font-serif text-2xl leading-relaxed font-medium">
                  좋은 선택을 의지하지 않아도 되는 환경은 어떻게 만들 수 있을까?
                </h3>
                <p className="mt-8 text-sm leading-7 text-muted-foreground">
                  매번 더 단단한 결심을 하기보다, 자연스럽게 좋은 선택을 하게 되는
                  조건을 먼저 살펴보자. 작은 환경의 변화가 행동을 오래 이어주는
                  시작점이 될 수 있다.
                </p>
                <blockquote className="mt-9 border-l-2 border-primary/35 pl-5 font-serif text-sm leading-7 text-muted-foreground italic">
                  “환경은 인간의 행동을 만드는 보이지 않는 손이다.”
                </blockquote>
                <p className="mt-8 text-xs text-muted-foreground">
                  생각의 연결 · 2개 노드
                </p>
              </article>
            </div>

            <div className="mt-8 text-right">
              <TextLink href="/community">공개 덱 읽기</TextLink>
            </div>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-between gap-9 px-5 py-24 sm:px-8 sm:py-32 md:flex-row md:items-end">
          <h2 className="max-w-2xl font-serif text-3xl leading-[1.35] font-medium sm:text-4xl lg:text-5xl">
            읽은 것을 오래 남기는 일,
            <br />한 문장에서 시작됩니다.
          </h2>
          <TextLink href={entryHref}>{hasProfile ? "내 기록으로" : "ReadingDeck 시작하기"}</TextLink>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-5 py-10 text-xs text-muted-foreground sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-lg text-foreground">ReadingDeck</p>
            <p className="mt-3">읽은 문장과 남긴 생각의 기록</p>
          </div>
          <div className="flex flex-col gap-5 md:items-end">
            <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="푸터 메뉴">
              <Link href="/terms" className="hover:text-foreground hover:underline">
                이용약관
              </Link>
              <Link href="/privacy" className="hover:text-foreground hover:underline">
                개인정보처리방침
              </Link>
              <a
                href="mailto:auddnjs2008@gmail.com"
                className="hover:text-foreground hover:underline"
              >
                문의하기
              </a>
            </nav>
            <p>© {new Date().getFullYear()} ReadingDeck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
