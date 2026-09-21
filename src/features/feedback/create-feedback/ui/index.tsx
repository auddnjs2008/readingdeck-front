"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useMyProfileQuery } from "@/entities/me/model/queries/useMyProfileQuery";
import { useFeedbackCreateMutation } from "../model/useFeedbackCreateMutation";
import type { ReqCreateFeedback } from "../api/createFeedback";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

export function FeedbackForm({ sourcePath }: { sourcePath: string }) {
  const profile = useMyProfileQuery({ retry: false });
  const mutation = useFeedbackCreateMutation();
  const [category, setCategory] =
    useState<ReqCreateFeedback["body"]["category"]>("other");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || mutation.isSuccess) return;
    if (message.trim().length < 2) {
      setValidationError("내용을 두 글자 이상 적어주세요.");
      return;
    }
    setValidationError("");
    submitting.current = true;
    try {
      await mutation.mutateAsync({
        body: {
          message: message.trim(),
          category,
          replyEmail: email.trim() || undefined,
          pagePath: sourcePath,
        },
      });
    } catch {
      // Keep the draft so the user can retry without rewriting it.
    } finally {
      submitting.current = false;
    }
  }

  if (mutation.isSuccess) {
    return (
      <section role="status" className="space-y-4 border-t border-border py-8">
        <h2 className="text-xl font-semibold">의견을 보내주셔서 감사해요.</h2>
        {mutation.variables?.body.replyEmail && (
          <p className="text-sm leading-7 text-muted-foreground">
            답변이 필요하면 남겨주신 이메일로 연락드릴게요.
          </p>
        )}
        <Link
          href={profile.data ? "/books" : "/"}
          className="inline-block text-sm text-primary underline underline-offset-4"
        >
          홈으로 돌아가기
        </Link>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset
        disabled={mutation.isPending}
        className="space-y-8 disabled:opacity-70"
      >
        <fieldset>
          <legend className="mb-3 text-sm font-medium">어떤 의견인가요?</legend>
          <div className="flex flex-wrap gap-3">
            {(
              [
                ["problem", "불편해요"],
                ["suggestion", "제안해요"],
                ["other", "기타"],
              ] as const
            ).map(([value, text]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-3 text-sm has-checked:border-primary has-checked:bg-primary/5 has-checked:text-primary"
              >
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={category === value}
                  onChange={() => setCategory(value)}
                  className="accent-primary"
                />
                {text}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-3">
          <label
            className="block text-sm font-medium"
            htmlFor="feedback-message"
          >
            내용
          </label>
          <Textarea
            id="feedback-message"
            required
            minLength={2}
            maxLength={2000}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setValidationError("");
            }}
            aria-describedby="feedback-message-help feedback-error"
            aria-invalid={Boolean(validationError)}
            placeholder="어떤 화면에서 무엇이 불편했나요? 바라는 기능도 편하게 적어주세요."
            className="min-h-48 resize-y text-base"
          />
          <p
            id="feedback-message-help"
            className="text-right text-xs text-muted-foreground"
          >
            {message.length.toLocaleString()} / 2,000자
          </p>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="feedback-email">
            답변받을 이메일{" "}
            <span className="text-muted-foreground">(선택)</span>
          </label>
          <Input
            id="feedback-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-describedby="feedback-email-help"
            className="text-base"
          />
          <p
            id="feedback-email-help"
            className="text-xs leading-6 text-muted-foreground"
          >
            답변이 필요하면 이메일을 남겨주세요. 비워두어도 의견을 보낼 수
            있어요.
          </p>
        </div>
      </fieldset>
      <p className="text-xs leading-6 text-muted-foreground">
        남겨주신 내용과 이메일은 의견 확인과 답변에 사용해요.{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          개인정보처리방침
        </Link>
      </p>
      <p id="feedback-error" role="alert" className="text-sm text-destructive">
        {validationError ||
          (mutation.isError
            ? "전송하지 못했어요. 작성한 내용은 그대로 있으니 다시 시도해 주세요."
            : "")}
      </p>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="min-h-12 w-full"
      >
        {mutation.isPending ? "보내는 중…" : "의견 보내기"}
      </Button>
    </form>
  );
}
