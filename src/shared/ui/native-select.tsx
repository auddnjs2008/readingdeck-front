"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "./utils";

type NativeSelectSize = "sm" | "md" | "lg";
type NativeSelectTone = "default" | "muted";

type NativeSelectOption = {
  value: string;
  label: string;
};

type NativeSelectProps = {
  id?: string;
  value: string;
  options: NativeSelectOption[];
  onValueChange: (value: string) => void;
  size?: NativeSelectSize;
  tone?: NativeSelectTone;
  disabled?: boolean;
  className?: string;
};

const sizeClasses: Record<NativeSelectSize, string> = {
  sm: "min-h-9 rounded-md text-sm",
  md: "min-h-10 rounded-lg text-sm",
  lg: "min-h-11 rounded-xl text-base",
};

const toneClasses: Record<NativeSelectTone, string> = {
  default:
    "border-input bg-background text-foreground hover:border-border/80 hover:bg-background",
  muted:
    "border-border/70 bg-muted/25 text-foreground hover:border-primary/20 hover:bg-muted/40",
};

export function NativeSelect({
  id,
  value,
  options,
  onValueChange,
  size = "md",
  tone = "default",
  disabled = false,
  className,
}: NativeSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const listId = React.useId();

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0] ?? null;
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );

  const focusOption = React.useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(options.length - 1, index));
      setActiveIndex(nextIndex);
      optionRefs.current[nextIndex]?.focus();
    },
    [options.length]
  );

  const closeMenu = React.useCallback((focusTrigger = false) => {
    setOpen(false);
    if (focusTrigger) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeMenu, open]);

  React.useEffect(() => {
    if (!open) return;
    const nextIndex = activeIndex >= 0 ? activeIndex : selectedIndex;
    focusOption(nextIndex);
  }, [activeIndex, focusOption, open, selectedIndex]);

  const openMenu = (index = selectedIndex) => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(index);
  };

  const selectOption = (optionValue: string) => {
    onValueChange(optionValue);
    closeMenu(true);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (open) {
        focusOption(activeIndex >= 0 ? activeIndex + 1 : selectedIndex);
      } else {
        openMenu(selectedIndex);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (open) {
        focusOption(activeIndex >= 0 ? activeIndex - 1 : selectedIndex);
      } else {
        openMenu(selectedIndex);
      }
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) {
        closeMenu(false);
      } else {
        openMenu(selectedIndex);
      }
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    optionValue: string
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(optionValue);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (event.key === "Tab") {
      closeMenu(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => {
          if (disabled) return;
          if (open) {
            closeMenu(false);
          } else {
            openMenu(selectedIndex);
          }
        }}
        className={cn(
          "group flex w-full items-center justify-between gap-3 border px-4 py-2.5 text-left shadow-xs outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[size],
          toneClasses[tone],
          open &&
            (tone === "muted"
              ? "border-primary/25 bg-secondary/80 shadow-[0_10px_24px_rgba(63,54,49,0.10)] ring-[3px] ring-ring/15"
              : "border-primary/30 bg-background ring-[3px] ring-ring/20")
        )}
      >
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-[15px] font-semibold leading-none transition-colors",
              open ? "text-foreground" : "text-foreground/95"
            )}
          >
            {selectedOption?.label ?? ""}
          </span>
        </div>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0 text-muted-foreground/90 transition-[transform,color] duration-200",
            open && "rotate-180 text-primary"
          )}
        />
      </button>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-20 overflow-hidden rounded-xl border border-border/80 bg-popover p-2 shadow-[0_16px_40px_rgba(63,54,49,0.18)] backdrop-blur-sm"
        >
          <div className="flex flex-col gap-1">
            {options.map((option, index) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  id={`${listId}-option-${index}`}
                  ref={(node) => {
                    optionRefs.current[index] = node;
                  }}
                  type="button"
                  role="option"
                  tabIndex={activeIndex === index ? 0 : -1}
                  aria-selected={isSelected}
                  onFocus={() => setActiveIndex(index)}
                  onKeyDown={(event) =>
                    handleOptionKeyDown(event, index, option.value)
                  }
                  onClick={() => selectOption(option.value)}
                  className={cn(
                    "flex min-h-9 w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    isSelected
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="font-medium leading-none">{option.label}</span>
                  <Check
                    className={cn(
                      "size-4 text-primary transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
