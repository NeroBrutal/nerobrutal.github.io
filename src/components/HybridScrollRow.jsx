/* eslint-disable react/prop-types */
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Auto-drifts horizontally; pauses while the user scrolls or drags, then resumes.
export default function HybridScrollRow({ items, speed = 0.45, reverse = false }) {
  const trackRef = useRef(null);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const bumpPause = () => {
      pauseUntilRef.current = Date.now() + 3500;
    };

    el.addEventListener("wheel", bumpPause, { passive: true });
    el.addEventListener("touchstart", bumpPause, { passive: true });
    el.addEventListener("pointerdown", bumpPause);
    el.addEventListener("scroll", bumpPause, { passive: true });

    if (reverse && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = el.scrollWidth / 2;
    }

    let frame = 0;
    const tick = () => {
      const now = Date.now();
      if (now >= pauseUntilRef.current && el.scrollWidth > el.clientWidth) {
        const half = el.scrollWidth / 2;
        if (reverse) {
          el.scrollLeft -= speed;
          if (el.scrollLeft <= 0) el.scrollLeft += half;
        } else {
          el.scrollLeft += speed;
          if (el.scrollLeft >= half) el.scrollLeft -= half;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("wheel", bumpPause);
      el.removeEventListener("touchstart", bumpPause);
      el.removeEventListener("pointerdown", bumpPause);
      el.removeEventListener("scroll", bumpPause);
    };
  }, [items, speed, reverse]);

  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={trackRef}
      className="flex gap-5 overflow-x-auto overscroll-x-contain scroll-smooth py-1 [scrollbar-width:thin] [scrollbar-color:rgb(var(--color-accent-rgb))_transparent] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      aria-label="Technology logos"
    >
      {(reduceMotion ? items : [...items, ...items]).map((tech, index) => (
        <div
          key={`${tech.name}-${index}`}
          className="glass-panel card-hover flex flex-col items-center justify-center min-w-[140px] w-[140px] p-4 shrink-0"
        >
          <img
            src={tech.imageSrc}
            alt={tech.name}
            className="h-10 w-10 mb-2 object-contain"
            loading="lazy"
            draggable={false}
          />
          <span className="text-xs text-center text-muted">{tech.name}</span>
        </div>
      ))}
    </div>
  );
}
