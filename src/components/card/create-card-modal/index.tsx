"use client";

import { useState } from "react";
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Play,
  Sparkles,
  Triangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";

type CardType = "Insight" | "Change" | "Action" | "Question";

const cardTypes: Array<{
  type: CardType;
  icon: typeof Lightbulb;
}> = [
  { type: "Insight", icon: Lightbulb },
  { type: "Change", icon: Triangle },
  { type: "Action", icon: Play },
  { type: "Question", icon: HelpCircle },
];

export function CreateCardModal() {
  const [selectedType, setSelectedType] = useState<CardType>("Insight");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">Add Card</Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-none overflow-hidden p-0 sm:max-w-[960px] lg:max-w-[1100px]">
        <div className="flex flex-col">
          <div className="flex items-start justify-between px-8 pb-4 pt-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                New Reading Card
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Capture insights, changes, actions, or questions.
              </DialogDescription>
            </DialogHeader>
            <DialogCloseButton />
          </div>

          <div className="flex flex-col gap-8 px-8 pb-8 pt-4">
            <div className="space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Select Type
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {cardTypes.map((card) => {
                  const isSelected = card.type === selectedType;
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setSelectedType(card.type)}
                      className={cn(
                        "relative flex h-[100px] flex-col items-center justify-center gap-3 rounded-lg border p-4 transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                      aria-pressed={isSelected}
                    >
                      {isSelected ? (
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                      ) : null}
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-semibold">{card.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Original Passage
                <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                  (optional)
                </span>
              </label>
              <Textarea
                placeholder="Paste the book excerpt or highlight here..."
                className="min-h-[90px] rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Your Thought
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (required)
                  </span>
                </label>
                <span className="text-[10px] text-muted-foreground">
                  Press{" "}
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground/80">
                    Tab
                  </span>{" "}
                  to switch
                </span>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Capture a quick thought..."
                  className="min-h-[160px] rounded-xl border-border/70 bg-muted/30 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-2"
                />
                <div className="absolute bottom-4 right-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-border/60 bg-background/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Assist
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border/70 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                  Esc
                </kbd>
                close
              </span>
              <span className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                  ⌘
                </kbd>
                +
                <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                  Enter
                </kbd>
                save
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button>Save Card</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
