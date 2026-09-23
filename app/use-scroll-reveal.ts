"use client";

import { useLayoutEffect, useRef } from "react";
import { revealMotion } from "./reveal-motion";

export function useScrollReveal() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = root.current;
    if (!container) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 639px)");
    const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal]"));
    const animations = new Map<HTMLElement, Animation>();
    const show = (element: HTMLElement) => {
      element.removeAttribute("data-reveal-pending");
      element.setAttribute("data-revealed", "");
    };
    if (!("IntersectionObserver" in window) || !("animate" in HTMLElement.prototype)) {
      elements.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        // Observe the stationary layout only, never the animated position.
        observer.unobserve(element);
        if (motion.matches || element.contains(document.activeElement)) {
          show(element);
          return;
        }
        const motionSpec = revealMotion(element.dataset.reveal, mobile.matches);
        const animation = element.animate(motionSpec.frames, {
          duration: motionSpec.duration,
          easing: "cubic-bezier(0.22, 0.61, 0.25, 1)",
          fill: "backwards",
        });
        animations.set(element, animation);
        show(element);
      });
    }, {
      threshold: 0,
      // Leave a little space below the incoming element before beginning.
      rootMargin: `0px 0px -${Math.round(window.innerHeight * 0.22)}px 0px`,
    });

    if (!motion.matches) {
      elements.forEach((element) => {
        element.removeAttribute("data-revealed");
        element.setAttribute("data-reveal-pending", "");
        observer.observe(element);
      });
    } else {
      elements.forEach(show);
    }
    const stopMotion = () => {
      if (!motion.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      elements.forEach(show);
    };
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-reveal]");
      if (element) {
        observer.unobserve(element);
        animations.get(element)?.cancel();
        show(element);
      }
    };
    motion.addEventListener("change", stopMotion);
    container.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      elements.forEach(show);
      motion.removeEventListener("change", stopMotion);
      container.removeEventListener("focusin", revealFocused);
    };
  }, []);

  return root;
}
