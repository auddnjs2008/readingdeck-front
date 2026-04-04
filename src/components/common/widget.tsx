"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { cn } from "@/components/ui/utils";

type Message = {
  id: string;
  type: "system" | "user";
  text: string;
};

const INITIAL_MESSAGE: Message = {
  id: "init",
  type: "system",
  text: "안녕하세요! ReadingDeck을 사용하시면서 불편한 점이나 추가되었으면 하는 기능이 있나요?\n편하게 남겨주시면 꼼꼼히 읽어보겠습니다! 😊",
};

export function Widget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"feedback" | "ai">("feedback");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSubmit = () => {
    if (!inputValue.trim() || activeTab !== "feedback") return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue.trim(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    // 가상의 시스템 응답 (실제로는 여기서 API 호출 등을 수행)
    setTimeout(() => {
      const newSysMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "system",
        text: "소중한 의견 감사합니다! 남겨주신 내용은 팀에서 꼼꼼히 확인하고 개선하겠습니다. 🙌",
      };
      setMessages((prev) => [...prev, newSysMsg]);
    }, 600);
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
            className="fixed bottom-6 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg md:bottom-8 md:right-8 md:w-[400px]"
          >
            {/* Header & Tabs */}
            <div className="flex flex-col">
              {/* Top Header */}
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
                <h3 className="font-bold tracking-wide">도우미</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                {messages.map((msg) => (
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
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center bg-secondary/30 p-6 text-center text-sm text-muted-foreground md:h-[500px]">
                <p>AI 대화 기능은 준비 중입니다 🚀</p>
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
                      : "준비 중입니다..."
                  }
                  className="custom-scrollbar max-h-[150px] min-h-[40px] w-full resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  rows={1}
                  disabled={activeTab === "ai"}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={activeTab === "ai" || !inputValue.trim()}
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
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 md:bottom-8 md:right-8",
          isOpen ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        aria-label="피드백 위젯 열기"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </>
  );
}
