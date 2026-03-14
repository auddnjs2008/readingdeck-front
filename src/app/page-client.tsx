"use client";

import Link from "next/link";
import TopNav from "@/components/nav/top-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  Link as LinkIcon,
  Target,
  Lightbulb,
  PenTool,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePageClient() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <TopNav />
        {/* 1. 히어로 섹션 */}
        <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12 px-4 pb-16 pt-20 md:flex-row md:pt-32 md:pb-24 sm:px-6 lg:px-8">
          <div className="z-10 flex flex-1 flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl font-black leading-[1.3] tracking-tight md:text-6xl font-sans break-keep">
              책은 많이 읽는데, <br />
              <span className="text-primary">정작 남는 게 없으신가요?</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-muted-foreground md:mx-0 md:text-xl break-keep">
              밑줄 친 문장들을 연결해 나만의 지식 지도를 만들어보세요. 리딩덱이
              파편화된 영감을 자산으로 바꿔줍니다.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
              <Button
                size="lg"
                as={Link}
                href="/login"
                className="text-base font-bold px-8 py-6 rounded-full shadow-lg hover:-translate-y-1 transition-transform"
              >
                구글로 3초 만에 시작하기
                <span className="ml-2 text-lg">→</span>
              </Button>
            </div>
          </div>

          <div className="relative flex h-[400px] w-full flex-1 items-center justify-center md:h-[500px]">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl opacity-50"></div>
            {/* 시각 자료: 덱 캔버스 모티브 목업 */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              {/* Central Node */}
              <div className="absolute z-20 flex flex-col items-center justify-center p-4 bg-background border-2 border-primary rounded-xl shadow-xl shadow-primary/20 w-48">
                <BrainCircuit className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-sm">지식의 연결</span>
              </div>
              {/* Connecting Lines & Surrounding Nodes */}
              <div className="absolute w-[300px] h-[300px] border-2 border-dashed border-primary/30 rounded-full animate-[spin_30s_linear_infinite]" />
              <div className="absolute top-10 left-10 p-3 bg-card border border-border rounded-lg shadow-sm w-32 transform -rotate-6 transition-transform hover:scale-105">
                <span className="text-xs font-semibold text-sky-500">
                  Action
                </span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  실행 가능한 아이디어
                </p>
              </div>
              <div className="absolute bottom-10 right-10 p-3 bg-card border border-border rounded-lg shadow-sm w-32 transform rotate-6 transition-transform hover:scale-105">
                <span className="text-xs font-semibold text-emerald-500">
                  Insight
                </span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  새로운 관점의 발견
                </p>
              </div>
              <div className="absolute top-1/2 -right-10 p-3 bg-card border border-border rounded-lg shadow-sm w-32 transform -rotate-3 -translate-y-1/2 transition-transform hover:scale-105">
                <span className="text-xs font-semibold text-amber-500">
                  Quote
                </span>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  인상 깊은 문구
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 핵심 기능 섹션 */}
        <section className="mx-auto w-full max-w-[1200px] px-4 py-20 md:py-32 sm:px-6 lg:px-8 space-y-32">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm border-primary/50 text-primary bg-primary/5"
              >
                Step 1. 인사이트 추출
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight break-keep">
                책 속의 문장, 눈으로만 읽지 말고{" "}
                <br className="hidden md:block" /> 카드로 기록하세요.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed break-keep">
                완독에 대한 부담을 버리세요. 나에게 울림을 준 단 하나의 문장과
                생각만이라도 생각 카드로 남겨두면, 그것이 곧 당신의 자산이
                됩니다.
              </p>
            </div>
            <div className="flex-1 w-full relative">
              <div className="absolute -inset-4 bg-linear-to-tr from-emerald-500/10 to-transparent rounded-3xl blur-2xl"></div>
              {/* Mock Thought Card */}
              <div className="relative max-w-sm mx-auto group">
                <Card className="shadow-xl border-border bg-card transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                  <div className="relative flex h-28 flex-col rounded-t-xl bg-muted px-4 pb-4 pt-8">
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                        INSIGHT
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col justify-end text-left">
                      <h3 className="text-lg font-bold leading-tight text-foreground">
                        아토믹 해빗
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        제임스 클리어
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                    <p className="text-sm leading-relaxed text-foreground/90">
                      우리는 목표의 수준까지 높아지는 것이 아니라, 시스템의
                      수준까지 떨어진다.
                      <br />
                      <br />
                      목표보다는 매일의 시스템과 루틴에 집중해야겠다.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-[10px] text-muted-foreground">
                        방금 전 저장됨
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Feature 2 - Node Canvas */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm border-primary/50 text-primary bg-primary/5"
              >
                Step 2. 지식의 연결
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight break-keep">
                파편화된 생각들을 연결해 <br className="hidden md:block" />{" "}
                나만의 지식 지도를 완성하세요.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed break-keep">
                리딩덱의 강력한 화이트보드 캔버스에서 개별 카드들을 노드 형태로
                연결하세요. 책의 경계를 넘어 생각과 생각을 이어 하나의 거대한
                인사이트 덱을 구성할 수 있습니다.
              </p>
            </div>
            <div className="flex-1 w-full bg-muted/30 rounded-2xl border border-border p-6 md:p-8 relative overflow-hidden min-h-[400px] flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[24px_24px]"></div>

              {/* Mock Nodes and Edges */}
              <div className="relative w-full h-full max-w-[400px] aspect-square">
                {/* SVG Lines */}
                <svg
                  className="absolute inset-0 w-full h-full z-0 pointer-events-none"
                  style={{ overflow: "visible" }}
                >
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5,
                      ease: "easeInOut",
                    }}
                    viewport={{ once: true }}
                    d="M 120 120 Q 200 150 200 200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-primary/50"
                  />
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    d="M 280 200 Q 280 150 320 120"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-primary/50"
                  />
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      delay: 1.5,
                      ease: "easeInOut",
                    }}
                    viewport={{ once: true }}
                    d="M 200 260 Q 240 300 240 300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="text-primary/50"
                  />
                </svg>

                {/* Node 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="absolute top-[10%] left-[5%] z-10 w-44 bg-card border shadow-md rounded-lg p-3 transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      습관의 시스템
                    </span>
                  </div>
                  <p className="text-xs">환경 설계가 의지력보다 중요하다.</p>
                </motion.div>

                {/* Node 2 (Center) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-52 bg-card border-2 border-primary shadow-xl rounded-xl p-4 transition-transform hover:scale-105 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">
                      넛지(Nudge) 설계
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    좋은 습관을 만들기 위한 선택 설계의 중요성
                  </p>
                </motion.div>

                {/* Node 3 */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  viewport={{ once: true }}
                  className="absolute top-[10%] right-[5%] z-10 w-44 bg-card border shadow-md rounded-lg p-3 transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      선택의 심리학
                    </span>
                  </div>
                  <p className="text-xs">인간은 환경의 영향을 크게 받는다.</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Feature 3 - Daily Stack */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm border-primary/50 text-primary bg-primary/5"
              >
                Step 3. 리마인드와 복습
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight break-keep">
                잊혀지던 영감을 매일 다시 마주하며{" "}
                <br className="hidden md:block" /> 확실한 내 것으로.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed break-keep">
                매일 제공되는 나만의 카드 스택을 통해 과거에 읽었던 책의
                인사이트를 복습하세요. 잊고 있던 문장들이 새로운 아이디어를 위한
                불씨가 되어줍니다.
              </p>
            </div>
            <div className="flex-1 w-full flex flex-col gap-6">
              {/* Mock Daily Stack */}
              <div className="bg-card border rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">오늘의 카드 스택</h3>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-xs text-muted-foreground shadow-sm">
                        ←
                      </div>
                      <div className="w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-xs text-foreground shadow-sm">
                        →
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 overflow-hidden py-2">
                    {[
                      {
                        type: "QUOTE",
                        color: "text-amber-500",
                        bg: "bg-amber-500",
                        text: "상상력은 결핍에서 나온다.",
                      },
                      {
                        type: "ACTION",
                        color: "text-sky-500",
                        bg: "bg-sky-500",
                        text: "내일 아침 첫 1시간은 글쓰기에 투자하기.",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="min-w-[240px] h-36 bg-background rounded-xl border border-border p-5 flex flex-col shadow-sm transition-transform hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${item.bg}`}
                          ></div>
                          <span
                            className={`text-[10px] font-bold ${item.color}`}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                    <div className="min-w-[240px] h-36 bg-background rounded-xl border border-border p-5 flex flex-col shadow-sm opacity-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold text-emerald-500">
                          INSIGHT
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 활용 사례 (Persona) */}
        <section className="border-y border-border bg-muted/30 py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                이런 분들께 리딩덱을 추천합니다
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 border-transparent hover:border-border">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">기획자 / PM</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed break-keep">
                    여기저기 흩어진 레퍼런스와 아티클의 핵심 내용만 발췌하여,
                    하나의 프로덕트 철학 덱으로 구조화해보세요.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 border-transparent hover:border-border">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-7 h-7 text-amber-500" />
                  </div>
                  <CardTitle className="text-xl">마케터</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed break-keep">
                    쏟아지는 트렌드 리포트와 영감을 주는 카피들을 카드 형태로
                    아카이빙하고, 캠페인 기획 시 빠르게 꺼내어 활용하세요.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300 border-transparent hover:border-border">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <PenTool className="w-7 h-7 text-emerald-500" />
                  </div>
                  <CardTitle className="text-xl">크리에이터 / 학생</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed break-keep">
                    독서 노트와 논문 요약본을 지식 지도로 연결하여, 글쓰기나
                    과제 작성 시 끊임없이 솟아나는 영감의 원천으로 만드세요.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. 커뮤니티 및 템플릿 */}
        <section className="py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                인기 인사이트 덱 살펴보기
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                다른 사람들이 완성한 지식 지도를 템플릿처럼 활용해 영감을
                얻어보세요.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "프로덕트 매니저 필수 사고모형 덱",
                  author: "PM_지훈",
                  cards: "42 노드",
                  tags: ["기획", "멘탈모델"],
                },
                {
                  title: "아토믹 해빗 & 습관의 힘 연결 덱",
                  author: "북튜버_수아",
                  cards: "38 노드",
                  tags: ["자기계발", "행동심리"],
                },
                {
                  title: "콘텐츠 마케터를 위한 영감 창고",
                  author: "Marketer_Jane",
                  cards: "56 노드",
                  tags: ["마케팅", "카피라이팅"],
                },
              ].map((deck) => (
                <Card
                  key={deck.title}
                  className="group cursor-pointer p-6 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      {deck.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {deck.cards}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-6 group-hover:text-primary transition-colors leading-snug">
                    {deck.title}
                  </h3>
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                      {deck.author[0]}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {deck.author}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 5. 하단 CTA */}
        <section className="px-4 py-20 pb-32">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center shadow-2xl shadow-primary/20 md:p-24">
            <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="mb-6 text-3xl font-black text-white md:text-5xl leading-tight break-keep">
                지금 바로 나만의 지식 서재를 <br className="hidden md:block" />{" "}
                만들어보세요.
              </h2>
              <p className="mb-10 max-w-xl text-lg text-primary-foreground/90 break-keep">
                완독의 강박에서 벗어나, 나를 변화시키는 문장들에 집중할
                시간입니다.
              </p>
              <Button
                as={Link}
                href="/login"
                size="lg"
                className="bg-background text-primary hover:bg-muted font-bold px-10 py-6 text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1"
              >
                무료로 시작하기
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/20 pb-12 pt-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-black text-white shadow-sm">
                  RD
                </div>
                <span className="text-xl font-bold tracking-tight">
                  ReadingDeck
                </span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  이용약관
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors font-semibold"
                >
                  개인정보처리방침
                </Link>
                <a
                  href="mailto:support@readingdeck.com"
                  className="hover:text-foreground transition-colors"
                >
                  문의하기
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start justify-between border-t border-border/50 pt-8 gap-4">
              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  상호명: ReadingDeck | 대표: 홍길동 | 이메일:
                  support@readingdeck.com
                </p>
                <p>
                  © {new Date().getFullYear()} ReadingDeck. All rights reserved.
                </p>
              </div>
              <div className="flex gap-4">
                {/* SNS Icons */}
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
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
          </div>
        </footer>
      </div>
    </div>
  );
}
