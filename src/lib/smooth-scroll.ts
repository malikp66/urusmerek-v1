"use client";

type SmoothScrollOptions = {
  offset?: number;
  duration?: number;
  updateHash?: boolean;
};

const easeInOutCubic = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const resolveHeaderOffset = (explicitOffset?: number) => {
  if (typeof window === "undefined") {
    return 0;
  }

  if (typeof explicitOffset === "number") {
    return explicitOffset;
  }

  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return header?.offsetHeight ?? 0;
};

const animateScroll = (target: number, duration: number) => {
  const start = window.scrollY;
  const distance = target - start;

  if (distance === 0) {
    return;
  }

  const startTime = performance.now();

  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo({ top: start + distance * eased, behavior: "auto" });

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

export const smoothScrollToHash = (hash: string, options: SmoothScrollOptions = {}) => {
  if (typeof window === "undefined" || !hash?.startsWith("#")) {
    return;
  }

  const targetId = hash.slice(1);
  const targetElement = document.getElementById(targetId);

  if (!targetElement) {
    return;
  }

  const { offset, duration = 1400, updateHash = true } = options;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const headerOffset = resolveHeaderOffset(offset);
  const targetTop = window.scrollY + targetElement.getBoundingClientRect().top - headerOffset;

  if (prefersReducedMotion) {
    window.scrollTo({ top: targetTop, behavior: "auto" });
  } else {
    animateScroll(targetTop, duration);
  }

  if (updateHash) {
    const current = new URL(window.location.href);
    current.hash = targetId;
    history.replaceState(null, "", current.toString());
  }

  if (!targetElement.hasAttribute("tabindex")) {
    targetElement.setAttribute("tabindex", "-1");
  }

  targetElement.focus({ preventScroll: true });
};
