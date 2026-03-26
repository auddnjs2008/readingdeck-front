"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { Loader2, MessageSquareText, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommunityCommentCreateMutation } from "@/hooks/community/react-query/useCommunityCommentCreateMutation";
import { useCommunityCommentDeleteMutation } from "@/hooks/community/react-query/useCommunityCommentDeleteMutation";
import { useCommunityCommentsQuery } from "@/hooks/community/react-query/useCommunityCommentsQuery";
import type { CommunityComment } from "@/service/community/types";

const INITIAL_COMMENT_COUNT = 10;
const INITIAL_REPLY_COUNT = 3;

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

function CommentItem({
  comment,
  currentUserId,
  activeReplyParentId,
  replyContent,
  onReplyStart,
  onReplyContentChange,
  onReplyCancel,
  onReplySubmit,
  onDelete,
  deletingCommentId,
  expandedReplies,
  onToggleReplies,
}: {
  comment: CommunityComment;
  currentUserId?: number;
  activeReplyParentId: number | null;
  replyContent: string;
  onReplyStart: (commentId: number) => void;
  onReplyContentChange: (value: string) => void;
  onReplyCancel: () => void;
  onReplySubmit: (parentId: number) => void;
  onDelete: (commentId: number) => void;
  deletingCommentId?: number | null;
  expandedReplies: Record<number, boolean>;
  onToggleReplies: (commentId: number) => void;
}) {
  const isOwn = currentUserId === comment.userId;
  const isReplyingHere = activeReplyParentId === comment.id;
  const isRepliesExpanded = expandedReplies[comment.id] ?? false;
  const visibleReplies =
    comment.replies.length > INITIAL_REPLY_COUNT && !isRepliesExpanded
      ? comment.replies.slice(0, INITIAL_REPLY_COUNT)
      : comment.replies;

  return (
    <article className="border-t border-border/70 py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-3">
        <Avatar size="sm">
          <AvatarImage
            src={comment.author?.profile ?? undefined}
            alt={comment.author?.name ?? "Deleted"}
          />
          <AvatarFallback>{getInitials(comment.author?.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-semibold text-foreground">
              {comment.author?.name ?? "삭제된 사용자"}
            </p>
            <span className="text-xs text-muted-foreground">
              {dayjs(comment.createdAt).format("YYYY.MM.DD HH:mm")}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-foreground/88">
            {comment.isDeleted ? "삭제된 댓글입니다." : comment.content}
          </p>

          {!comment.isDeleted ? (
            <div className="mt-3 flex items-center gap-2">
              {comment.parentId === null ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1.5 px-2 text-xs"
                  onClick={() => {
                    if (isReplyingHere) {
                      onReplyCancel();
                      return;
                    }
                    onReplyStart(comment.id);
                  }}
                >
                  <Reply className="h-3.5 w-3.5" />
                  {isReplyingHere ? "취소" : "답글"}
                </Button>
              ) : null}
              {isOwn ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(comment.id)}
                  disabled={deletingCommentId === comment.id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </Button>
              ) : null}
            </div>
          ) : null}

          {isReplyingHere && !comment.isDeleted ? (
            <div className="mt-4 rounded-[18px] border border-border/70 bg-background/70 p-3">
              <Textarea
                value={replyContent}
                onChange={(event) => onReplyContentChange(event.target.value)}
                placeholder="이 댓글에 답글을 남겨보세요."
                maxLength={500}
                className="min-h-[88px] border-border/70 bg-background"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {replyContent.length}/500
                </span>
                <div className="flex items-center gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={onReplyCancel}>
                    취소
                  </Button>
                  <Button type="button" size="sm" onClick={() => onReplySubmit(comment.id)}>
                    답글 남기기
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {comment.replies.length ? (
            <div className="mt-4 border-l border-border/70 pl-4">
              {visibleReplies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  activeReplyParentId={activeReplyParentId}
                  replyContent={replyContent}
                  onReplyStart={onReplyStart}
                  onReplyContentChange={onReplyContentChange}
                  onReplyCancel={onReplyCancel}
                  onReplySubmit={onReplySubmit}
                  onDelete={onDelete}
                  deletingCommentId={deletingCommentId}
                  expandedReplies={expandedReplies}
                  onToggleReplies={onToggleReplies}
                />
              ))}
              {comment.replies.length > INITIAL_REPLY_COUNT ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-8 px-2 text-xs"
                  onClick={() => onToggleReplies(comment.id)}
                >
                  {isRepliesExpanded
                    ? "답글 접기"
                    : `답글 ${comment.replies.length - INITIAL_REPLY_COUNT}개 더 보기`}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function CommunityComments({
  postId,
  currentUserId,
}: {
  postId: number;
  currentUserId?: number;
}) {
  const [content, setContent] = useState("");
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [visibleCommentCount, setVisibleCommentCount] =
    useState(INITIAL_COMMENT_COUNT);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>(
    {},
  );
  const { data, isPending, isError } = useCommunityCommentsQuery({
    path: { postId },
  });
  const createMutation = useCommunityCommentCreateMutation();
  const deleteMutation = useCommunityCommentDeleteMutation(postId);

  const submitComment = async ({
    content: rawContent,
    parentId,
  }: {
    content: string;
    parentId?: number;
  }) => {
    const trimmed = rawContent.trim();
    if (!trimmed) {
      toast.error("댓글 내용을 입력해 주세요.");
      return false;
    }

    try {
      await createMutation.mutateAsync({
        path: { postId },
        body: {
          content: trimmed,
          ...(parentId ? { parentId } : {}),
        },
      });
      toast.success("댓글을 남겼습니다.");
      return true;
    } catch {
      toast.error("댓글 작성에 실패했습니다.");
      return false;
    }
  };

  const handleSubmit = async () => {
    const didSubmit = await submitComment({ content });
    if (!didSubmit) return;
    setContent("");
  };

  const handleReplySubmit = async (parentId: number) => {
    const didSubmit = await submitComment({
      content: replyContent,
      parentId,
    });
    if (!didSubmit) return;
    setReplyContent("");
    setReplyParentId(null);
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteMutation.mutateAsync({
        path: { commentId },
      });
      toast.success("댓글을 삭제했습니다.");
    } catch {
      toast.error("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <section className="rounded-[28px] border border-border/80 bg-card p-6 shadow-[0_14px_34px_rgba(63,54,49,0.06)]">
      <div className="flex items-center gap-2 text-foreground">
        <MessageSquareText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Discussion</h2>
      </div>

      <div className="mt-5 rounded-[24px] border border-border/70 bg-background/70 p-4">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="이 공유 덱에 대한 생각을 남겨보세요."
          maxLength={500}
          className="min-h-[110px] border-border/70 bg-background"
        />
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">{content.length}/500</span>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "남기는 중..." : "댓글 남기기"}
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {isPending ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            댓글을 불러오는 중입니다...
          </div>
        ) : isError ? (
          <div className="rounded-[22px] border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
            댓글을 불러오지 못했습니다.
          </div>
        ) : data?.length ? (
          <div>
            {data.slice(0, visibleCommentCount).map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                activeReplyParentId={replyParentId}
                replyContent={replyContent}
                onReplyStart={(commentId) => {
                  setReplyParentId(commentId);
                  setReplyContent("");
                }}
                onReplyContentChange={setReplyContent}
                onReplyCancel={() => {
                  setReplyParentId(null);
                  setReplyContent("");
                }}
                onReplySubmit={handleReplySubmit}
                onDelete={handleDelete}
                deletingCommentId={
                  deleteMutation.variables?.path.commentId ?? null
                }
                expandedReplies={expandedReplies}
                onToggleReplies={(commentId) =>
                  setExpandedReplies((prev) => ({
                    ...prev,
                    [commentId]: !prev[commentId],
                  }))
                }
              />
            ))}
            {data.length > visibleCommentCount ? (
              <div className="mt-6 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setVisibleCommentCount((prev) => prev + INITIAL_COMMENT_COUNT)
                  }
                >
                  댓글 더 보기
                </Button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-border/80 bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
            첫 댓글을 남겨 대화를 시작해 보세요.
          </div>
        )}
      </div>
    </section>
  );
}
