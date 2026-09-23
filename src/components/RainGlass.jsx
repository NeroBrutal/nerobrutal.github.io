"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DROPLET_COUNT = 20;

// Each droplet's own backdrop-filter blur genuinely lenses whatever sits
// behind it (the starfield), which is a cheap but convincing approximation
// of real refraction — distant lights melt into soft glowing blobs, the
// same way they do through actual rain-speckled glass.
function makeDroplets() {
  return Array.from({ length: DROPLET_COUNT }, (_, i) => {
    const size = 6 + Math.random() * 30;
    return {
      id: i,
      size,
      stretch: 1 + Math.random() * 0.4,
      x: Math.random() * 100,
      y: Math.random() * 100,
      blur: Math.max(4, size / 2.6),
      trickle: Math.random() < 0.32,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 9,
      travel: 60 + Math.random() * 120,
    };
  });
}

export default function RainGlass() {
  const droplets = useMemo(makeDroplets, []);
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Faint vignette — sells depth and keeps the hero text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-bg/70" />

      {droplets.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size * d.stretch,
            backdropFilter: `blur(${d.blur}px) brightness(1.25) saturate(1.3)`,
            WebkitBackdropFilter: `blur(${d.blur}px) brightness(1.25) saturate(1.3)`,
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3), rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.2) 100%)",
            boxShadow:
              "inset 0 -2px 5px rgba(0,0,0,0.5), inset 0 1.5px 3px rgba(255,255,255,0.3), 0 0 10px rgba(34,211,238,0.1)",
          }}
          animate={
            d.trickle && !reduceMotion
              ? { y: [0, d.travel], opacity: [0, 0.9, 0.9, 0] }
              : undefined
          }
          transition={
            d.trickle && !reduceMotion
              ? {
                  duration: d.duration,
                  delay: d.delay,
                  repeat: Infinity,
                  ease: "easeIn",
                  times: [0, 0.15, 0.85, 1],
                }
              : undefined
          }
        >
          {/* Specular highlight — the little bright fleck real droplets get */}
          <span
            className="absolute rounded-full bg-white/60"
            style={{
              width: d.size * 0.28,
              height: d.size * 0.22,
              top: d.size * 0.14,
              left: d.size * 0.18,
              filter: "blur(0.5px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
