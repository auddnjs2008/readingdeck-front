"use client";

import { ImagePlus, Search } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import ImageUploader from "@/shared/ui/image-upload";
import { useBookCreateMutation } from "@/entities/book/model/queries/useBookCreateMutation";
import { CoverSearch } from "./cover-search";

type Step = "search" | "manual";

export function CreateBookModal({
  triggerLabel = "새 책 추가",
  triggerClassName,
  triggerVariant = "primary",
}: {
  triggerLabel?: string;
  triggerClassName?: string;
  triggerVariant?: "primary" | "secondary" | "outline" | "ghost";
}) {
  const router = useRouter();
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("search");
  const [isbn, setIsbn] = useState("");
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
    setStep("search");
    setIsbn("");
    setTitle("");
    setAuthor("");
    setPublisher("");
    setContents("");
    setSelectedCoverUrl(null);
    setSelectedCoverFile(null);
    setSelectedCoverInfo(null);
    setIsEditingCover(false);
  };

  const enterManualStep = () => {
    setIsbn("");
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
    isbn: string;
  }) => {
    setSelectedCoverFile(null);
    setSelectedCoverUrl(data.thumbnail);
    setSelectedCoverInfo({
      title: data.title,
      author: data.author,
      thumbnail: data.thumbnail,
    });
    setIsbn(data.isbn ?? "");
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
      isbn?: string;
      imageUrl?: string;
      backgroundImage?: File;
    } = {
      isbn: isbn || undefined,
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
        onSuccess: (book) => {
          toast.success("책을 추가했어요. 이제 첫 카드를 남겨보세요.");
          handleClose();
          router.push(`/books/${book.id}`);
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
        <Button size="sm" variant={triggerVariant} className={triggerClassName ?? "h-10"} aria-label={triggerLabel || "새 책 추가"} title={triggerLabel || "새 책 추가"}>
          <span className="text-base font-bold">＋</span>
          {triggerLabel ? <span className="truncate">{triggerLabel}</span> : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90dvh] min-h-[min(520px,80dvh)] w-[92vw] max-w-none flex-col overflow-hidden border-border bg-background p-0 sm:max-w-[760px]">
        <div className="flex shrink-0 items-start justify-between border-b border-border px-5 py-6 sm:px-8 sm:py-7">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">
              책 추가
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              제목으로 찾거나 직접 입력해 서재에 기록하세요.
            </DialogDescription>
          </DialogHeader>
          <DialogCloseButton />
        </div>

        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-7 sm:px-8 sm:py-8">
          {step === "search" ? (
            <div className="flex flex-col gap-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-medium text-foreground">책 검색</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={enterManualStep}
                >
                  직접 입력
                </Button>
              </div>
              <CoverSearch
                key="search"
                onSelect={handleSearchSelect}
                inputClassName="h-11 text-base"
                emptyFallback={
                  <div className="flex flex-col gap-4 border-y border-border py-6">
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
                <div className="border-y border-border py-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-28 w-[76px] shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/30 p-1">
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
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="space-y-1">
                        <p className="font-serif text-xl font-medium text-foreground">
                          {title}
                        </p>
                        {author.trim() ? (
                          <p className="text-sm text-muted-foreground">
                            {author.trim()}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        출판사 {publisher.trim() || "정보 없음"}
                      </p>

                      <div className="border-l-2 border-primary/40 pl-4">
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
            <div className="flex flex-col gap-7">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
                onClick={resetForm}
              >
                <Search className="mr-2 h-4 w-4" />
                검색으로 돌아가기
              </Button>

              <div className="space-y-2">
                <label
                  htmlFor={`${formId}-title`}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  책 제목
                  <span className="text-xs font-normal text-muted-foreground">
                    (필수)
                  </span>
                </label>
                <Input
                  id={`${formId}-title`}
                  placeholder="저장할 책 제목을 입력하세요"
                  className="rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                  value={title}
                  onChange={(event) => { setIsbn(""); setTitle(event.target.value); }}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <label
                    htmlFor={`${formId}-author`}
                    className="text-sm font-medium text-foreground"
                  >
                    저자
                  </label>
                  <Input
                    id={`${formId}-author`}
                    placeholder="저자를 입력하세요"
                    className="rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                    value={author}
                    onChange={(event) => { setIsbn(""); setAuthor(event.target.value); }}
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor={`${formId}-publisher`}
                    className="text-sm font-medium text-foreground"
                  >
                    출판사
                  </label>
                  <Input
                    id={`${formId}-publisher`}
                    placeholder="출판사를 입력하세요"
                    className="rounded-none border-x-0 border-t-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                    value={publisher}
                    onChange={(event) => { setIsbn(""); setPublisher(event.target.value); }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor={`${formId}-contents`}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  책 소개
                  <span className="text-xs font-normal text-muted-foreground">
                    (선택)
                  </span>
                </label>
                <Textarea
                  id={`${formId}-contents`}
                  placeholder="책 소개나 줄거리를 입력하세요"
                  className="min-h-28 rounded-none border-border bg-transparent px-4 py-3 font-serif text-sm leading-7 shadow-none"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  책 표지
                  <span className="text-xs font-normal text-muted-foreground">
                    (선택)
                  </span>
                </p>
                <div className="border-y border-border py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden border border-border bg-muted/30 p-1 text-muted-foreground">
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
                        <p className="text-sm font-medium text-foreground">
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
                      <div className="mt-4 flex flex-wrap items-center gap-2">
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

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-5 py-5 sm:px-8">
          <DialogClose asChild>
            <Button variant="ghost">취소</Button>
          </DialogClose>
          <Button
            onClick={handleCreateBook}
            disabled={
              isPending ||
              (step === "search" ? !hasAutoFilledBook : !title.trim())
            }
          >
            {isPending ? "추가 중..." : "서재에 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
