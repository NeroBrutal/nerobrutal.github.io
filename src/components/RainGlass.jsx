"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLiteGraphics } from "../lib/liteGraphics";

const DROPLET_COUNT = 14;

// Static glass beads — no backdrop-filter (moving full-screen blur flickers on some GPUs).
function makeDroplets() {
  return Array.from({ length: DROPLET_COUNT }, (_, i) => {
    const size = 6 + Math.random() * 26;
    return {
      id: i,
      size,
      stretch: 1 + Math.random() * 0.35,
      x: Math.random() * 100,
      y: Math.random() * 100,
      trickle: Math.random() < 0.22,
      delay: Math.random() * 8,
      duration: 9 + Math.random() * 10,
      travel: 40 + Math.random() * 90,
    };
  });
}

export default function RainGlass() {
  const droplets = useMemo(makeDroplets, []);
  const reduceMotion = useReducedMotion();
  const lite = useLiteGraphics();

  if (lite) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-bg/70" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
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
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.15) 100%)",
            boxShadow:
              "inset 0 -2px 4px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.2)",
          }}
          animate={
            d.trickle && !reduceMotion
              ? { y: [0, d.travel], opacity: [0.35, 0.75, 0.75, 0.35] }
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
          <span
            className="absolute rounded-full bg-white/50"
            style={{
              width: d.size * 0.28,
              height: d.size * 0.22,
              top: d.size * 0.14,
              left: d.size * 0.18,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
