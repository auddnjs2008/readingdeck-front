"use client";

import { AlignLeft, Book, Building2, ImagePlus, Search, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/ui/image-upload";
import { useBookCreateMutation } from "@/hooks/book/react-query/useBookCreateMutation";
import { CoverSearch } from "./cover-search";

type Step = "entry" | "search" | "manual";

export function CreateBookModal({
  triggerLabel = "새 책 추가",
  triggerClassName,
  triggerVariant = "primary",
}: {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerVariant?: "primary" | "secondary" | "outline" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("entry");
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
  const [contents, setContents] = useState("");
  const [isEditingCover, setIsEditingCover] = useState(false);
  const { mutate: createBookMutation, isPending } = useBookCreateMutation();

  const uploadPreviewUrl = useMemo(
    () => (selectedCoverFile ? URL.createObjectURL(selectedCoverFile) : null),
    [selectedCoverFile]
  );
  const hasCover = !!(selectedCoverUrl || selectedCoverFile);
  const activeCoverUrl = selectedCoverFile ? uploadPreviewUrl : selectedCoverUrl;
  const activeCoverTitle = selectedCoverInfo?.title ?? "표지가 없습니다.";
  const activeCoverAuthor = selectedCoverInfo?.author ?? "";
  const isSearchCoverSelected = !!selectedCoverUrl && !selectedCoverFile;
  const hasAutoFilledBook = step === "search" && title.trim().length > 0;

  const formatTitle = (rawTitle: string) => {
    const [base] = rawTitle.split(" - ");
    return base.trim();
  };

  const resetForm = () => {
    setStep("entry");
    setTitle("");
    setAuthor("");
    setPublisher("");
    setContents("");
    setSelectedCoverUrl(null);
    setSelectedCoverFile(null);
    setSelectedCoverInfo(null);
    setIsEditingCover(false);
  };

  const clearSelection = () => {
    setTitle("");
    setAuthor("");
    setPublisher("");
    setContents("");
    setSelectedCoverUrl(null);
    setSelectedCoverFile(null);
    setSelectedCoverInfo(null);
    setIsEditingCover(false);
    setStep("search");
  };

  const enterManualStep = () => {
    setSelectedCoverUrl(null);
    setSelectedCoverInfo(null);
    setSelectedCoverFile(null);
    setIsEditingCover(false);
    setStep("manual");
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedCoverFile(file);
    if (!file) return;

    setSelectedCoverUrl(null);
    setSelectedCoverInfo(null);
    setIsEditingCover(false);
  };

  const handleSearchSelect = (data: {
    title: string;
    author: string;
    publisher: string;
    thumbnail: string;
    contents: string;
  }) => {
    setSelectedCoverFile(null);
    setSelectedCoverUrl(data.thumbnail);
    setSelectedCoverInfo({
      title: data.title,
      author: data.author,
      thumbnail: data.thumbnail,
    });
    setAuthor(data.author);
    setPublisher(data.publisher);
    setContents(data.contents ?? "");
    if (data.title) {
      setTitle(formatTitle(data.title));
    }
    setIsEditingCover(false);
  };

  const handleCreateBook = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("책 제목을 입력해 주세요");
      return;
    }

    const body: {
      title: string;
      author: string;
      publisher: string;
      contents?: string;
      imageUrl?: string;
      backgroundImage?: File;
    } = {
      title: trimmedTitle,
      author: author.trim(),
      publisher: publisher.trim(),
    };

    const trimmedContents = contents.trim();
    if (trimmedContents) body.contents = trimmedContents;

    if (selectedCoverFile) {
      body.backgroundImage = selectedCoverFile;
    } else if (selectedCoverUrl) {
      body.imageUrl = selectedCoverUrl;
    }

    createBookMutation(
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
        <Button size="sm" variant={triggerVariant} className={triggerClassName ?? "h-10"}>
          <span className="text-base font-bold">＋</span>
          {triggerLabel ? <span className="truncate">{triggerLabel}</span> : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex w-[92vw] min-h-[min(520px,80vh)] max-h-[90vh] max-w-none flex-col overflow-hidden p-0 sm:max-w-[720px] lg:max-w-[820px]">
        <div className="flex shrink-0 items-start justify-between px-8 pb-4 pt-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">책 추가</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              원하는 책을 추가해 나만의 서재를 완성해보세요.
            </DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </div>

        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-8 pb-6">
          {step === "entry" ? (
            <div className="flex flex-col gap-4 pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  어떻게 책을 추가할까요?
                </h3>
                <p className="text-sm text-muted-foreground">
                  검색으로 자동 채우거나, 처음부터 직접 입력할 수 있어요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep("search")}
                className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-left transition hover:border-border hover:bg-muted/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/70">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      검색해서 추가
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      제목을 검색하면 책 정보를 자동으로 채워 빠르게 추가할 수 있어요.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={enterManualStep}
                className="rounded-2xl border border-border/60 bg-muted/30 p-6 text-left transition hover:border-border hover:bg-muted/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background/70">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      직접 입력하기
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      제목, 소개, 표지를 원하는 방식으로 직접 입력해 추가할 수 있어요.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : step === "search" ? (
            <div className="flex flex-col gap-6 pt-6">
              <CoverSearch
                key="search"
                onSelect={handleSearchSelect}
                className="pt-2"
                inputClassName="h-12 text-base"
                emptyFallback={
                  <div className="flex flex-col gap-4 rounded-xl border border-dashed border-border/60 bg-muted/20 p-6">
                    <p className="text-sm text-muted-foreground">
                      검색 결과가 없습니다.
                      <br />
                      직접 입력해서 추가해 보세요.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      onClick={enterManualStep}
                    >
                      직접 입력하기
                    </Button>
                  </div>
                }
              />

              {hasAutoFilledBook ? (
                <div className="rounded-2xl border border-border/60 bg-muted/30 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/70">
                      {activeCoverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeCoverUrl}
                          alt={`${title} cover`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                          {title}
                        </p>
                        {author.trim() ? (
                          <p className="text-sm text-muted-foreground">
                            {author.trim()}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                          출판사
                        </p>
                        <p className="text-sm text-foreground">
                          {publisher.trim() || "정보 없음"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                          책 소개
                        </p>
                        <p className="line-clamp-4 whitespace-pre-line text-sm leading-6 text-foreground/90">
                          {contents.trim() || "책 소개가 없습니다."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-6 pt-6">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => setStep("entry")}
              >
                <Search className="mr-2 h-4 w-4" />
                선택으로 돌아가기
              </Button>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <Book className="h-4 w-4" />책 제목
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (필수)
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
                    placeholder="저자를 입력하세요"
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
                    placeholder="출판사를 입력하세요"
                    className="h-12 rounded-xl border-border/70 bg-muted/30 px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                    value={publisher}
                    onChange={(event) => setPublisher(event.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <AlignLeft className="h-4 w-4" />
                  책 소개
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (선택)
                  </span>
                </label>
                <Textarea
                  placeholder="책 소개나 줄거리를 입력하세요"
                  className="min-h-24 rounded-xl border-border/70 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  <ImagePlus className="h-4 w-4" />
                  책 표지
                  <span className="text-[10px] font-normal lowercase tracking-normal text-muted-foreground/70">
                    (선택)
                  </span>
                </label>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted/70 text-muted-foreground">
                      {activeCoverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeCoverUrl}
                          alt={`${activeCoverTitle} cover`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImagePlus className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      {selectedCoverFile ? (
                        <p className="text-sm font-medium text-foreground">
                          {selectedCoverFile.name}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-foreground">
                          {activeCoverTitle}
                          {activeCoverAuthor ? ` - ${activeCoverAuthor}` : ""}
                        </p>
                      )}
                      {selectedCoverFile ? (
                        <p className="text-xs text-muted-foreground">
                          업로드한 표지를 미리 보여드려요.
                        </p>
                      ) : isSearchCoverSelected ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>출처: Kakao Books</span>
                          <span className="font-medium text-primary">
                            선택된 표지
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          직접 업로드한 표지를 사용할 수 있어요.
                        </p>
                      )}
                    </div>
                    {hasCover && !isEditingCover ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingCover(true)}
                      >
                        표지 변경
                      </Button>
                    ) : null}
                  </div>

                  {(!hasCover || isEditingCover) ? (
                    <>
                      <div className="mb-4 mt-4 flex flex-wrap items-center gap-2">
                        {hasCover && isEditingCover ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => setIsEditingCover(false)}
                          >
                            취소
                          </Button>
                        ) : null}
                      </div>
                      <ImageUploader
                        selectedFile={selectedCoverFile}
                        handleChange={handleUploadFile}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-4 border-t border-border/70 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <kbd className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground/80">
                Esc
              </kbd>
              닫기
            </span>
          </div>
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button variant="ghost">취소</Button>
            </DialogClose>
            <Button
              onClick={handleCreateBook}
              disabled={isPending || !title.trim() || step === "entry"}
            >
              {isPending ? "추가 중..." : "서재에 추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
