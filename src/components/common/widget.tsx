"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";

import { useAiChatMutation } from "@/hooks/ai/react-query/useAiChatMutation";
import { useFeedbackCreateMutation } from "@/hooks/feedback/react-query/useFeedbackCreateMutation";
import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";
import type { AiChatSource } from "@/service/ai/chat";
import { cn } from "@/components/ui/utils";

type Message = {
  id: string;
  type: "system" | "user";
  text: string;
  sources?: AiChatSource[];
};

const INITIAL_MESSAGE: Message = {
  id: "init",
  type: "system",
  text: "안녕하세요! ReadingDeck을 사용하시면서 불편한 점이나 추가되었으면 하는 기능이 있나요?\n편하게 남겨주시면 꼼꼼히 읽어보겠습니다.",
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
          className="h-1.5 w-1.5 rounded-full bg-current/70"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -1.5, 0] }}
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
  const [activeTab, setActiveTab] = useState<"feedback" | "ai">("feedback");
  const [feedbackMessages, setFeedbackMessages] = useState<Message[]>([
    INITIAL_MESSAGE,
  ]);
  const [aiMessages, setAiMessages] = useState<Message[]>([INITIAL_AI_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const feedbackCreateMutation = useFeedbackCreateMutation();
  const aiChatMutation = useAiChatMutation();
  const myProfileQuery = useMyProfileQuery({
    enabled: isOpen && activeTab === "ai",
    retry: false,
  });
  const isSubmitting = feedbackCreateMutation.isPending;
  const isAiSubmitting = aiChatMutation.isPending;
  const isAiAvailable = myProfileQuery.isSuccess;
  const shouldAvoidBottomRightCta = pathname === "/books";
  const currentMessages =
    activeTab === "feedback" ? feedbackMessages : aiMessages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetWidget = () => {
    setActiveTab("feedback");
    setFeedbackMessages([INITIAL_MESSAGE]);
    setAiMessages([INITIAL_AI_MESSAGE]);
    setInputValue("");
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [currentMessages, isOpen]);

  if (isHiddenPath) {
    return null;
  }

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();

    if (activeTab === "feedback" && isSubmitting) return;
    if (activeTab === "ai" && (!isAiAvailable || isAiSubmitting)) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: trimmedInput,
    };

    if (activeTab === "feedback") {
      setFeedbackMessages((prev) => [...prev, newUserMsg]);
    } else {
      setAiMessages((prev) => [...prev, newUserMsg]);
    }
    setInputValue("");

    if (activeTab === "feedback") {
      try {
        await feedbackCreateMutation.mutateAsync({
          body: {
            message: newUserMsg.text,
            pagePath: pathname ?? undefined,
          },
        });

        const newSysMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: "의견 남겨주셔서 감사합니다. 서비스 개선에 참고하겠습니다.",
        };
        setFeedbackMessages((prev) => [...prev, newSysMsg]);
      } catch {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: "system",
          text: "전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        };
        setFeedbackMessages((prev) => [...prev, errorMsg]);
      }

      return;
    }

    try {
      const response = await aiChatMutation.mutateAsync({
        body: {
          message: trimmedInput,
          limit: 5,
        },
      });

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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg md:right-8 md:w-[400px]",
              shouldAvoidBottomRightCta
                ? "bottom-24 md:bottom-8"
                : "bottom-6 md:bottom-8"
            )}
          >
            {/* Header & Tabs */}
            <div className="flex flex-col">
              {/* Top Header */}
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
                <h3 className="font-bold tracking-wide">도우미</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    resetWidget();
                  }}
                  className="rounded-full p-1 transition-colors hover:bg-primary-foreground/20"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sub Tabs */}
              <div className="flex gap-5 border-b border-border bg-background px-5 pt-3 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={cn(
                    "border-b-2 pb-2.5 transition-colors",
                    activeTab === "feedback"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  피드백
                </button>
                <button
                  onClick={() => setActiveTab("ai")}
                  className={cn(
                    "border-b-2 pb-2.5 transition-colors",
                    activeTab === "ai"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  AI 대화
                </button>
              </div>
            </div>

            {/* Body */}
            {activeTab === "feedback" ? (
              <div className="custom-scrollbar flex h-[400px] flex-col gap-4 overflow-y-auto bg-secondary/30 p-4 md:h-[500px]">
                {feedbackMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex w-full",
                      msg.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.type === "system" && (
                      <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        msg.type === "user"
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : "rounded-tl-sm border border-border bg-background text-foreground shadow-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : isAiAvailable ? (
              <div className="custom-scrollbar flex h-[400px] flex-col gap-4 overflow-y-auto bg-secondary/30 p-4 md:h-[500px]">
                <div className="rounded-xl border border-border bg-background/70 px-4 py-3 text-left shadow-sm">
                  <p className="text-xs font-medium text-primary">베타 기능</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    내 독서 기록을 바탕으로 답변하지만, 아직 완벽하지 않을 수
                    있어요.
                  </p>
                </div>
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
                          className="rounded-full border border-border bg-background px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
                    {msg.type === "system" && (
                      <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-2">
                      <div
                        className={cn(
                          "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                          msg.type === "user"
                            ? "rounded-tr-sm bg-primary text-primary-foreground"
                            : "rounded-tl-sm border border-border bg-background text-foreground shadow-sm"
                        )}
                      >
                        {msg.text}
                      </div>
                      {msg.type === "system" && msg.sources?.length ? (
                        <div className="space-y-2">
                          <p className="px-1 text-xs font-medium text-muted-foreground">
                            근거 카드
                          </p>
                          {msg.sources.slice(0, 3).map((source) => (
                            <div
                              key={`${msg.id}-${source.cardId}`}
                              className="rounded-xl border border-border bg-background/90 p-3 text-left shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1 space-y-1">
                                  <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
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
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {isAiSubmitting ? (
                  <div className="flex w-full justify-start">
                    <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="max-w-[80%]">
                      <div className="rounded-tl-sm rounded-2xl border border-border bg-background px-4 py-2.5 text-sm leading-relaxed text-foreground shadow-sm">
                        <span>{AI_LOADING_MESSAGE}</span>
                        <LoadingDots />
                      </div>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center gap-3 bg-secondary/30 p-6 text-center md:h-[500px]">
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
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  로그인하기
                </Link>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-border bg-background p-3">
              <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeTab === "feedback"
                      ? "어떤 점이 불편하셨나요? 편하게 적어주세요."
                      : isAiAvailable
                      ? "내 독서 기록에 대해 물어보세요."
                      : "로그인 후 AI 대화를 사용할 수 있어요."
                  }
                  className="custom-scrollbar max-h-[150px] min-h-[40px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  rows={1}
                  disabled={
                    activeTab === "feedback"
                      ? isSubmitting
                      : !isAiAvailable || isAiSubmitting
                  }
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !inputValue.trim() ||
                    (activeTab === "feedback"
                      ? isSubmitting
                      : !isAiAvailable || isAiSubmitting)
                  }
                  className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="전송"
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
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            resetWidget();
            return;
          }
          setIsOpen(true);
        }}
        className={cn(
          "fixed right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 md:bottom-8 md:right-8",
          shouldAvoidBottomRightCta
            ? "bottom-24 md:bottom-8"
            : "bottom-6 md:bottom-8",
          isOpen
            ? "pointer-events-none scale-0 opacity-0"
            : "scale-100 opacity-100"
        )}
        aria-label="피드백 위젯 열기"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
