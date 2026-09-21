"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { useAiChatMutation } from "@/features/ai/chat/model/useAiChatMutation";
import { useAiChatUsageQuery } from "@/features/ai/chat/model/useAiChatUsageQuery";
import { useFeedbackCreateMutation } from "@/features/feedback/create-feedback/model/useFeedbackCreateMutation";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";
import type { AiChatSource } from "@/features/ai/chat/api/chat";
import { cn } from "@/shared/ui/utils";
import { MarkdownMessage } from "@/shared/ui/markdown-message";

type Message = {
  id: string;
  type: "system" | "user";
  text: string;
  sources?: AiChatSource[];
};

const INITIAL_AI_MESSAGE: Message = {
  id: "ai-init",
  type: "system",
  text: "안녕하세요! 내가 남긴 독서 기록을 바탕으로 궁금한 점을 물어보세요.",
};

const AI_LOADING_MESSAGE = "남겨둔 카드들을 바탕으로 답변을 정리하고 있어요...";
const AI_EXAMPLE_QUESTIONS = [
  "내가 예전에 습관에 대해 어떤 생각을 남겼지?",
  "최근 읽은 책들에서 반복해서 나온 주제가 뭐야?",
  "내가 남긴 액션 카드에는 어떤 패턴이 있어?",
];

function LoadingDots() {
  return (
    <span className="ml-1 inline-flex items-center gap-1 align-middle">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-1 w-1 rounded-full bg-current/60"
          animate={{ opacity: [0.2, 0.85, 0.2], y: [0, -1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.16,
          }}
        />
      ))}
    </span>
  );
}

export function Widget() {
  const router = useRouter();
  const pathname = usePathname();
  const isHiddenPath = pathname === "/login";
  const [isOpen, setIsOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<Message[]>([INITIAL_AI_MESSAGE]);
  const [expandedSourceMessageIds, setExpandedSourceMessageIds] = useState<
    string[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [aiThreadId, setAiThreadId] = useState<string | null>(null);
  const [aiMessageReactions, setAiMessageReactions] = useState<
    Record<string, "up" | "down">
  >({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const aiFeedbackCreateMutation = useFeedbackCreateMutation();
  const aiChatMutation = useAiChatMutation();
  const myProfileQuery = useMyProfileQuery({
    enabled: isOpen,
    retry: false,
  });
  const isAiSubmitting = aiChatMutation.isPending;
  const isAiAvailable = myProfileQuery.isSuccess;
  const aiUsageQuery = useAiChatUsageQuery(
    myProfileQuery.data?.id,
    isOpen && isAiAvailable && !isHiddenPath
  );
  const isAiQuotaExhausted = aiUsageQuery.data?.remaining === 0;
  const canSendAi =
    isAiAvailable && !isAiSubmitting && aiUsageQuery.isSuccess && !isAiQuotaExhausted;
  const shouldAvoidBottomRightCta = pathname === "/books";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const closeWidget = () => {
    setIsOpen(false);
    setInputValue("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const resetAiConversation = () => {
    setAiMessages([INITIAL_AI_MESSAGE]);
    setAiThreadId(null);
    setExpandedSourceMessageIds([]);
    setAiMessageReactions({});
    setInputValue("");
  };

  const handleAiReaction = async (
    messageId: string,
    reaction: "up" | "down",
    answer: string
  ) => {
    if (aiMessageReactions[messageId]) {
      return;
    }

    setAiMessageReactions((prev) => ({
      ...prev,
      [messageId]: reaction,
    }));

    try {
      await aiFeedbackCreateMutation.mutateAsync({
        body: {
          message: `[AI_REACTION] ${reaction} | threadId=${aiThreadId ?? "none"} | answer=${answer.slice(0, 500)}`,
          pagePath: pathname ?? undefined,
        },
      });
    } catch {
      // Keep the selected reaction even if feedback logging fails.
    }
  };

  const toggleSourceCards = (messageId: string) => {
    setExpandedSourceMessageIds((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [aiMessages, isOpen]);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  if (isHiddenPath) {
    return null;
  }

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();

    if (!canSendAi) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: trimmedInput,
    };

    setAiMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    try {
      const response = await aiChatMutation.mutateAsync({
        body: {
          message: trimmedInput,
          limit: 5,
          threadId: aiThreadId ?? undefined,
        },
      });
      setAiThreadId(response.threadId);
      const newSysMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        text: response.answer,
        sources: response.sources,
      };
      setAiMessages((prev) => [...prev, newSysMsg]);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "AI 답변을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.";

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        text: errorMessage,
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      // Refetch after settlement, even when the reply failed or another tab used the quota.
      await aiUsageQuery.refetch({ cancelRefetch: true });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="readingdeck-widget"
            role="dialog"
            aria-label="ReadingDeck 대화"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                closeWidget();
              }
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed right-4 z-50 flex h-[min(600px,calc(100dvh-2rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-lg [overflow-wrap:anywhere] md:right-6 md:h-[min(600px,calc(100dvh-3rem))]",
              shouldAvoidBottomRightCta
                ? "bottom-[calc(6rem+var(--mobile-nav-offset))] max-md:h-[min(600px,calc(100dvh-7rem-var(--mobile-nav-offset)))]"
                : "bottom-[calc(1rem+var(--mobile-nav-offset))] max-md:h-[min(600px,calc(100dvh-2rem-var(--mobile-nav-offset)))]",
              "md:bottom-6"
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 flex-col">
              {/* Top Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg">AI 독서 대화</h3>
                </div>
                <button
                  type="button"
                  ref={closeRef}
                  onClick={closeWidget}
                  className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-primary"
                  aria-label="닫기"
                  title="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

            </div>

            {/* Body */}
            {isAiAvailable ? (
              <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain p-5" role="log" aria-label="AI 대화 기록">
                <div className="border-b border-border pb-4 text-left">
                  <p className="text-xs font-medium text-primary">베타 기능</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    내 독서 기록을 바탕으로 답변하지만, 아직 완벽하지 않을 수
                    있어요.
                  </p>
                </div>
                {aiMessages.length > 1 ? (
                  <button
                    type="button"
                    onClick={resetAiConversation}
                    disabled={isAiSubmitting}
                    className="shrink-0 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    새 대화 시작
                  </button>
                ) : null}
                {aiMessages.length === 1 ? (
                  <div className="space-y-2">
                    <p className="px-1 text-xs font-medium text-muted-foreground">
                      예시 질문
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {AI_EXAMPLE_QUESTIONS.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => setInputValue(question)}
                          className="w-full border-l-2 border-border py-2 pl-3 text-left text-xs leading-6 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                {aiMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full",
                      msg.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className="min-w-0 max-w-[90%] space-y-2 [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto">
                      <div
                        className={cn(
                          "whitespace-pre-wrap text-sm leading-7",
                          msg.type === "user"
                            ? "rounded-md bg-muted px-3 py-2 text-foreground"
                            : "text-foreground"
                        )}
                      >
                        {msg.type === "user" ? (
                          msg.text
                        ) : (
                          <MarkdownMessage content={msg.text} />
                        )}
                      </div>
                      {msg.type === "system" && msg.sources?.length ? (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => toggleSourceCards(msg.id)}
                            aria-expanded={expandedSourceMessageIds.includes(msg.id)}
                            className="flex w-full items-center justify-between gap-2 border-t border-border py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                          >
                            <span>근거 카드 {msg.sources.length}개 보기</span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                expandedSourceMessageIds.includes(msg.id)
                                  ? "rotate-180"
                                  : "rotate-0"
                              )}
                            />
                          </button>
                          {expandedSourceMessageIds.includes(msg.id)
                            ? msg.sources.slice(0, 3).map((source) => (
                                <div
                                  key={`${msg.id}-${source.cardId}`}
                                  className="border-l-2 border-primary/30 py-2 pl-3 text-left"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-1">
                                      <p className="truncate text-[11px] font-medium text-muted-foreground">
                                        {source.type}
                                        {" · "}
                                        {source.bookTitle}
                                        {(source.pageStart != null ||
                                          source.pageEnd != null) &&
                                          ` · p.${
                                            source.pageStart != null
                                              ? source.pageStart
                                              : source.pageEnd
                                          }${
                                            source.pageStart != null &&
                                            source.pageEnd != null &&
                                            source.pageStart !== source.pageEnd
                                              ? `-${source.pageEnd}`
                                              : ""
                                          }`}
                                      </p>
                                      <p className="line-clamp-2 whitespace-pre-line text-sm text-foreground">
                                        {source.thought}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        router.push(`/cards/${source.cardId}`)
                                      }
                                      className="shrink-0 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                    >
                                      더보기
                                    </button>
                                  </div>
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    {source.bookTitle} · {source.author}
                                  </p>
                                </div>
                              ))
                            : null}
                        </div>
                      ) : null}
                      {msg.type === "system" && msg.id !== INITIAL_AI_MESSAGE.id ? (
                        <div className="flex items-center gap-2 px-1 pt-1">
                          <button
                            type="button"
                            title="좋아요"
                            onClick={() =>
                              void handleAiReaction(msg.id, "up", msg.text)
                            }
                            disabled={Boolean(aiMessageReactions[msg.id])}
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-md transition-colors",
                              aiMessageReactions[msg.id] === "up"
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
                              aiMessageReactions[msg.id]
                                ? "cursor-default"
                                : "cursor-pointer"
                            )}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span className="sr-only">좋아요</span>
                          </button>
                          <button
                            type="button"
                            title="싫어요"
                            onClick={() =>
                              void handleAiReaction(msg.id, "down", msg.text)
                            }
                            disabled={Boolean(aiMessageReactions[msg.id])}
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-md transition-colors",
                              aiMessageReactions[msg.id] === "down"
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
                              aiMessageReactions[msg.id]
                                ? "cursor-default"
                                : "cursor-pointer"
                            )}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                            <span className="sr-only">싫어요</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {isAiSubmitting ? (
                  <div className="flex w-full justify-start">
                    <div className="max-w-[90%]" role="status">
                      <div className="text-sm leading-7 text-muted-foreground">
                        <span>{AI_LOADING_MESSAGE}</span>
                        <LoadingDots />
                      </div>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col items-center gap-3 overflow-y-auto p-6 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    AI 대화는 로그인 후 사용할 수 있어요
                  </p>
                  <p className="text-sm text-muted-foreground">
                    내 독서 기록을 바탕으로 답변해드릴게요.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  로그인하기
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="shrink-0 border-t border-border bg-background p-3">
              {isAiAvailable ? (
                <div className="mb-2 px-1 text-xs leading-5 text-muted-foreground" aria-live="polite">
                  {aiUsageQuery.isError ? (
                    <p>
                      남은 횟수를 확인하지 못했어요.{" "}
                      <button
                        type="button"
                        onClick={() => void aiUsageQuery.refetch()}
                        disabled={aiUsageQuery.isFetching}
                        className="text-primary underline underline-offset-4 disabled:opacity-50"
                      >
                        다시 확인
                      </button>
                    </p>
                  ) : aiUsageQuery.data ? (
                    <>
                      <p className={isAiQuotaExhausted ? "text-primary" : undefined}>
                        {isAiQuotaExhausted
                          ? `오늘 ${aiUsageQuery.data.limit}회를 모두 사용했어요.`
                          : `오늘 ${aiUsageQuery.data.remaining}/${aiUsageQuery.data.limit}회 남음`}
                      </p>
                      <p>
                        {new Intl.DateTimeFormat("ko-KR", {
                          timeZone: "Asia/Seoul",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(aiUsageQuery.data.resetsAt))} (한국 시간) 초기화
                      </p>
                    </>
                  ) : (
                    <p>남은 횟수 확인 중...</p>
                  )}
                </div>
              ) : null}
              <div className="flex items-end gap-2 rounded-md border border-input bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
                <textarea
                  aria-label="AI 질문"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isAiAvailable
                      ? "내 독서 기록에 대해 물어보세요."
                      : "로그인 후 AI 대화를 사용할 수 있어요."
                  }
                  className="custom-scrollbar max-h-[150px] min-h-[40px] min-w-0 w-full resize-none bg-transparent px-2 py-2 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  rows={1}
                  disabled={
                    !isAiAvailable || isAiSubmitting
                  }
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !inputValue.trim() ||
                    !canSendAi
                  }
                  className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="전송"
                  title="전송"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        ref={triggerRef}
        onClick={() => {
          if (isOpen) {
            closeWidget();
            return;
          }
          setIsOpen(true);
        }}
        className={cn(
          "fixed right-4 z-40 flex size-11 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm transition-colors hover:border-primary hover:bg-muted focus-visible:outline-primary md:right-6",
          shouldAvoidBottomRightCta
            ? "bottom-[calc(6rem+var(--mobile-nav-offset))] md:bottom-6"
            : "bottom-[calc(1rem+var(--mobile-nav-offset))] md:bottom-6",
          isOpen
            ? "pointer-events-none scale-0 opacity-0"
            : "scale-100 opacity-100"
        )}
        aria-label="AI 독서 대화"
        title="AI 독서 대화"
        aria-expanded={isOpen}
        aria-controls="readingdeck-widget"
        tabIndex={isOpen ? -1 : 0}
      >
        <MessageCircle className="size-5" />
      </button>
    </>
  );
}
