import type { HTMLAttributes } from "react";
import { cn } from "./utils";

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("px-6 pt-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("px-6 pb-6 pt-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("px-6 pb-6 pt-2", className)} {...props} />;
}
