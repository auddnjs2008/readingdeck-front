"use client";

import { Book, Building2, ImagePlus, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageUploader from "@/components/ui/image-upload";
import { useBookCreateMutation } from "@/hooks/book/react-query/useBookCreateMutation";
import { CoverSearch } from "./cover-search";
import { toast } from "sonner";

export function CreateBookModal({
  triggerLabel = "Add New Book",
  triggerClassName,
}: {
  triggerLabel?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string | null>(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [selectedCoverInfo, setSelectedCoverInfo] = useState<{
    title: string;
    author: string;
    thumbnail: string;
  } | null>(null);
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [coverMode, setCoverMode] = useState<"search" | "upload">("search");
  const createBookMutation = useBookCreateMutation();

  const previewTitle = selectedCoverInfo?.title ?? "표지가 없습니다.";
  const previewAuthor = selectedCoverInfo?.author ?? "";
  const previewCoverUrl = selectedCoverInfo?.thumbnail ?? null;
  const uploadPreviewUrl = useMemo(
    () => (selectedCoverFile ? URL.createObjectURL(selectedCoverFile) : null),
    [selectedCoverFile]
  );
  const formatTitle = (rawTitle: string) => {
    const [base] = rawTitle.split(" - ");
    return base.trim();
  };
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPublisher("");
    setSelectedCoverUrl(null);
    setSelectedCoverFile(null);
    setSelectedCoverInfo(null);
    setCoverMode("search");
  };
  const handleClose = () => {
    resetForm();
    setOpen(false);
  };
  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedCoverFile(file);
  };

  const handleSearchSelect = (data: {
    title: string;
    author: string;
    publisher: string;
    thumbnail: string;
  }) => {
    setSelectedCoverUrl(data.thumbnail);
    setSelectedCoverInfo({
      title: data.title,
      author: data.author,
      thumbnail: data.thumbnail,
    });
    setAuthor(data.author);
    setPublisher(data.publisher);
    if (data.title) {
      setTitle(formatTitle(data.title));
    }
  };

  const handleCreateBook = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const body: {
      title: string;
      author: string;
      publisher: string;
      imageUrl?: string;
      backgroundImage?: File;
    } = {
      title: trimmedTitle,
      author: author.trim(),
      publisher: publisher.trim(),
    };

    if (coverMode === "upload" && selectedCoverFile) {
      body.backgroundImage = selectedCoverFile;
    } else if (coverMode === "search" && selectedCoverUrl) {
      body.imageUrl = selectedCoverUrl;
    }

    createBookMutation.mutate(
      { body },
      {
        onSuccess: () => {
          toast.success("저장되었습니다.");
          handleClose();
        },
      }
    );
  };

  useEffect(() => {
    if (!uploadPreviewUrl) return;
    return () => URL.revokeObjectURL(uploadPreviewUrl);
  }, [uploadPreviewUrl]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName ?? "h-10"}>
          <span className="text-base font-bold">＋</span>
          {triggerLabel ? (
            <span className="truncate">{triggerLabel}</span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[92vw] h-[90vh] max-w-none overflow-hidden p-0 sm:max-w-[720px] lg:max-w-[820px]">
        <div className="flex min-h-0 h-full flex-col">
          <div className="flex items-start justify-between px-8 pb-4 pt-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                책 추가
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                원하는 책을 추가해 나만의 서재를 완성해보세요.
              </DialogDescription>
            </DialogHeader>
            <DialogCloseButton />
          </div>

          <ScrollArea className="flex min-h-0 flex-1">
            <div className="flex flex-col gap-6 px-8 pb-6">
              <div className="space-y-2 pt-6">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <Book className="h-4 w-4" />책 제목
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (required)
                  </span>
                </label>
                <Input
                  placeholder="저장할 책 제목을 입력하세요"
                  className="h-10 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <User className="h-4 w-4" />
                    저자
                  </label>
                  <Input
                    placeholder="Author name"
                    className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    출판사
                  </label>
                  <Input
                    placeholder="Publisher name"
                    className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                    value={publisher}
                    onChange={(event) => setPublisher(event.target.value)}
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
                <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-16 w-11 items-center justify-center overflow-hidden rounded-lg bg-muted/70 text-muted-foreground">
                      {coverMode === "upload" ? (
                        uploadPreviewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={uploadPreviewUrl}
                            alt="Uploaded cover preview"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ImagePlus className="h-4 w-4" />
                        )
                      ) : previewCoverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewCoverUrl}
                          alt={`${previewTitle} cover`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-1">
                      {coverMode === "upload" ? (
                        <p className="text-sm font-medium text-foreground">
                          {selectedCoverFile?.name ?? "표지가 없습니다."}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">
                          {previewTitle}
                          {previewAuthor ? ` - ${previewAuthor}` : ""}
                        </p>
                      )}
                      {coverMode === "search" ? (
                        selectedCoverUrl ? (
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>출처: Kakao Books</span>
                            <span className="font-medium text-emerald-500">
                              선택된 표지
                            </span>
                          </div>
                        ) : null
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          선택되거나 업로드된 표지를 미리 보여드려요.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={coverMode === "search" ? "primary" : "secondary"}
                      onClick={() => {
                        setCoverMode("search");
                        setSelectedCoverUrl(null);
                        setSelectedCoverFile(null);
                        setSelectedCoverInfo(null);
                      }}
                    >
                      검색
                    </Button>
                    <Button
                      size="sm"
                      variant={coverMode === "upload" ? "primary" : "secondary"}
                      onClick={() => {
                        setCoverMode("upload");
                        setSelectedCoverUrl(null);
                        setSelectedCoverFile(null);
                        setSelectedCoverInfo(null);
                      }}
                    >
                      직접 업로드
                    </Button>
                  </div>
                  {coverMode === "search" ? (
                    <CoverSearch onSelect={handleSearchSelect} />
                  ) : (
                    <ImageUploader
                      selectedFile={selectedCoverFile}
                      handleChange={handleUploadFile}
                    />
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

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
              <Button
                onClick={handleCreateBook}
                disabled={createBookMutation.isPending || !title.trim()}
              >
                {createBookMutation.isPending ? "Adding..." : "Add to Library"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
