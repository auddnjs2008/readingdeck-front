import type { HTMLAttributes } from "react";
import { cn } from "./utils";

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "outline";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-500 dark:text-amber-400",
  outline: "border border-border text-foreground",
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
