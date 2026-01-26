"use client";

import { Book, Building2, ImagePlus, User } from "lucide-react";

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
import { Input } from "@/components/ui/input";

export function CreateBookModal({
  triggerLabel = "Add New Book",
  triggerClassName,
}: {
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName ?? "h-10"}>
          <span className="text-base font-bold">＋</span>
          {triggerLabel ? <span className="truncate">{triggerLabel}</span> : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] max-w-none overflow-hidden p-0 sm:max-w-[720px] lg:max-w-[820px]">
        <div className="flex flex-col">
          <div className="flex items-start justify-between px-8 pb-4 pt-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                Add New Book
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Build your personal reading archive.
              </DialogDescription>
            </DialogHeader>
            <DialogCloseButton />
          </div>

          <div className="flex flex-col gap-6 px-8 py-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                <Book className="h-4 w-4" />
                Book Title
                <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                  (required)
                </span>
              </label>
              <Input
                placeholder="Enter the book title"
                className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <User className="h-4 w-4" />
                  Author
                </label>
                <Input
                  placeholder="Author name"
                  className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Publisher
                </label>
                <Input
                  placeholder="Publisher name"
                  className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                <ImagePlus className="h-4 w-4" />
                Book Cover
                <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                  (optional)
                </span>
              </label>
              <label className="group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/30 p-8 text-center transition-colors hover:border-border hover:bg-muted/50">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors group-hover:text-foreground">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                  Click to upload cover image
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  SVG, PNG, JPG or GIF (max. 2MB)
                </p>
                <input className="absolute inset-0 cursor-pointer opacity-0" type="file" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border/70 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                  Esc
                </kbd>
                close
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button>Add to Library</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
