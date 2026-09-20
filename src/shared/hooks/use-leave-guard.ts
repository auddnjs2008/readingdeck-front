"use client";

import { useCallback, useEffect, useRef } from "react";

const LEAVE_MESSAGE =
  "저장하지 않은 변경사항이 있습니다. 편집 화면을 나갈까요?";

export function useLeaveGuard(shouldWarn: boolean) {
  const approvedTraversal = useRef(false);
  const allowNextTraversal = useCallback(() => {
    approvedTraversal.current = true;
  }, []);
  useEffect(() => {
    if (!shouldWarn) return;

    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.download ||
        (link.target && link.target !== "_self")
      )
        return;
      const destination = new URL(link.href);
      if (
        destination.origin !== location.origin ||
        (destination.pathname === location.pathname &&
          destination.search === location.search)
      )
        return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    // ponytail: browsers without cancellable Navigation API traversal only get reload/link guards.
    const navigation = (window as Window & { navigation?: EventTarget })
      .navigation;
    const onNavigate = (event: Event) => {
      const navigationEvent = event as Event & {
        navigationType: string;
        destination: { sameDocument: boolean; url: string };
      };
      if (
        navigationEvent.navigationType !== "traverse" ||
        !navigationEvent.destination.sameDocument ||
        !event.cancelable
      )
        return;
      if (approvedTraversal.current) {
        approvedTraversal.current = false;
        return;
      }
      const destination = new URL(navigationEvent.destination.url);
      if (
        destination.pathname === location.pathname &&
        destination.search === location.search
      )
        return;
      if (!window.confirm(LEAVE_MESSAGE)) event.preventDefault();
    };

    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onClick, true);
    navigation?.addEventListener("navigate", onNavigate);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", onClick, true);
      navigation?.removeEventListener("navigate", onNavigate);
    };
  }, [shouldWarn]);
  return allowNextTraversal;
}
