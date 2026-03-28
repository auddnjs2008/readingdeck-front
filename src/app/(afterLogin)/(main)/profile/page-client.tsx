"use client";

import { BookOpen, Camera, Layers2, PencilLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMyProfileUpdateMutation } from "@/hooks/me/react-query/useMyProfileUpdateMutation";
import { useMyLibraryStatsQuery } from "@/hooks/me/react-query/useMyLibraryStatsQuery";
import { useMyProfileQuery } from "@/hooks/me/react-query/useMyProfileQuery";

const MAX_NAME_LENGTH = 20;

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export default function ProfilePageClient() {
  const { data: myProfile, isPending, isError } = useMyProfileQuery();
  const { data: libraryStats } = useMyLibraryStatsQuery();
  const updateMutation = useMyProfileUpdateMutation();
  const [editOpen, setEditOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  if (isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-sm text-muted-foreground">
        프로필을 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !myProfile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-sm text-destructive">
        프로필을 불러오지 못했습니다.
      </div>
    );
  }

  const name = nameDraft ?? myProfile.name;
  const trimmedName = name.trim();
  const activeProfileImage = previewUrl ?? myProfile.profile ?? undefined;
  const isNameValid =
    trimmedName.length >= 2 && trimmedName.length <= MAX_NAME_LENGTH;
  const isDirty = trimmedName !== myProfile.name || Boolean(selectedFile);

  const openEditDialog = () => {
    setNameDraft(myProfile.name);
    setSelectedFile(null);
    setEditOpen(true);
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    setEditOpen(nextOpen);
    if (!nextOpen) {
      setNameDraft(null);
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isNameValid) {
      toast.error("닉네임은 2자 이상 20자 이하로 입력해 주세요.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        body: {
          name: trimmedName,
          profileImage: selectedFile,
        },
      });
      toast.success("프로필을 저장했습니다.");
      handleDialogOpenChange(false);
    } catch {
      toast.error("프로필 저장에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col px-6 py-12 md:px-10 xl:px-12">
        <section className="flex flex-col items-center border-b border-border/70 pb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
            Profile
          </p>

          <Avatar className="mt-8 h-32 w-32 border border-border/80 shadow-[0_18px_48px_rgba(63,54,49,0.12)]">
            <AvatarImage src={myProfile.profile ?? undefined} alt={myProfile.name} />
            <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">
              {getInitials(myProfile.name)}
            </AvatarFallback>
          </Avatar>

          <h1 className="mt-8 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
            {myProfile.name}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            댓글과 공유 덱에 보여지는 프로필입니다.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-8 h-11 rounded-full px-6"
            onClick={openEditDialog}
          >
            <PencilLine className="h-4 w-4" />
            프로필 수정
          </Button>
        </section>

        <section className="grid gap-4 py-12 md:grid-cols-2">
          <article className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-3xl font-semibold">
              {libraryStats?.bookCount ?? 0}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.26em] text-muted-foreground">
              Books
            </p>
          </article>

          <article className="rounded-[28px] border border-border bg-card px-7 py-8 shadow-[0_12px_30px_rgba(63,54,49,0.06)]">
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers2 className="h-5 w-5" />
            </div>
            <p className="text-3xl font-semibold">
              {libraryStats?.cardCount ?? 0}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.26em] text-muted-foreground">
              Cards
            </p>
          </article>
        </section>
      </div>

      <Dialog open={editOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-[560px] rounded-[28px] px-6 py-6 sm:px-8">
          <div className="mb-2 flex items-start justify-between gap-4">
            <DialogHeader className="space-y-3 text-left">
              <DialogTitle className="font-serif text-2xl font-semibold">
                프로필 수정
              </DialogTitle>
              <DialogDescription className="text-sm leading-7 text-muted-foreground">
                이름과 이미지를 바꾸면 댓글과 공유 덱에 바로 반영됩니다.
              </DialogDescription>
            </DialogHeader>
            <DialogCloseButton />
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex w-fit flex-col items-center gap-3">
                <Avatar className="h-24 w-24 border border-border/70 shadow-[0_16px_32px_rgba(63,54,49,0.1)]">
                  <AvatarImage src={activeProfileImage} alt={trimmedName} />
                  <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                    {getInitials(trimmedName || myProfile.name)}
                  </AvatarFallback>
                </Avatar>
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary">
                  <Camera className="h-3.5 w-3.5" />
                  이미지 변경
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  프로필 사진
                </p>
                <p className="text-sm text-muted-foreground">
                  커뮤니티 피드와 댓글에 이 이미지가 노출됩니다.
                </p>
                {selectedFile ? (
                  <p className="text-xs text-primary">{selectedFile.name}</p>
                ) : null}
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <label
                htmlFor="profile-name"
                className="inline-flex items-center gap-2 text-sm font-medium"
              >
                <PencilLine className="h-4 w-4 text-primary" />
                닉네임
              </label>
              <Input
                id="profile-name"
                value={name}
                maxLength={MAX_NAME_LENGTH}
                onChange={(event) => setNameDraft(event.target.value)}
                className="h-12"
                placeholder="커뮤니티에서 보여질 이름"
              />
              <p className="text-xs text-muted-foreground">2자 이상 20자 이하</p>
            </div>

            <DialogFooter className="items-center gap-3 sm:justify-start">
              <Button
                type="submit"
                disabled={!isDirty || !isNameValid || updateMutation.isPending}
              >
                {updateMutation.isPending ? "저장 중..." : "프로필 저장"}
              </Button>
              <p className="text-sm text-muted-foreground">
                저장 즉시 커뮤니티에 반영됩니다.
              </p>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
