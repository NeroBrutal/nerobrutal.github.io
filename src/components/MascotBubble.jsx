/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TYPE_MS = 24;

function Typewriter({ text }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    const t = setInterval(() => {
      setShown((n) => {
        if (n >= text.length) {
          clearInterval(t);
          return n;
        }
        return n + 1;
      });
    }, TYPE_MS);
    return () => clearInterval(t);
  }, [text]);

  return (
    <>
      {/* Invisible full text reserves the final size so the bubble doesn't grow while typing. */}
      <span className="invisible">{text}</span>
      <span className="absolute inset-0 px-3.5 py-2.5">
        {text.slice(0, shown)}
        {shown < text.length && <span className="ml-0.5 inline-block w-1.5 h-3 bg-accent/80 align-middle animate-pulse" />}
      </span>
    </>
  );
}

// Thought cloud ("thinking…") that turns into a speech bubble typing a fact.
// `edge` is the screen edge the robot stands on — the bubble opens inward.
// `beside` puts it level with his head so it doesn't cover what he's sitting on.
export default function MascotBubble({ phase, text, edge, below, beside, onClick }) {
  const left = edge === "left";
  const tailSide = left ? "left-5" : "right-5";
  const placement = beside
    ? `top-0 ${left ? "left-full ml-3" : "right-full mr-3"}`
    : `${below ? "top-full mt-3" : "bottom-full mb-3"} ${left ? "left-0" : "right-0"}`;
  const dotA = beside ? `top-3 ${left ? "-left-2" : "-right-2"}` : `${below ? "-top-2" : "-bottom-2"} ${tailSide}`;
  const dotB = beside ? `top-4 ${left ? "-left-4" : "-right-4"}` : `${below ? "-top-4" : "-bottom-4"} ${left ? "left-3" : "right-3"}`;
  const tail = beside
    ? `top-4 ${left ? "-left-1.5 border-l border-b" : "-right-1.5 border-r border-t"}`
    : `${below ? "-top-1.5 border-l border-t" : "-bottom-1.5 border-r border-b"} ${tailSide}`;
  const enterOffset = beside ? { x: left ? -8 : 8 } : { y: below ? -8 : 8 };

  return (
    <motion.div
      className={`absolute ${placement} w-56 pointer-events-auto`}
      initial={{ opacity: 0, scale: 0.6, ...enterOffset }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, ...enterOffset }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      style={{ originX: left ? 0 : 1, originY: beside || below ? 0 : 1 }}
    >
      {phase === "thinking" ? (
        <div className={`flex ${left ? "justify-start" : "justify-end"}`}>
          <div className="relative">
            <div className="glass-panel bg-surface/90 border-border-bright rounded-full px-4 py-2.5 flex gap-1.5 shadow-lg shadow-black/40">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="w-2 h-2 rounded-full bg-accent"
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
            <span className={`absolute ${dotA} w-2.5 h-2.5 rounded-full glass-panel bg-surface/90 border-border-bright`} />
            <span className={`absolute ${dotB} w-1.5 h-1.5 rounded-full glass-panel bg-surface/90 border-border-bright`} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="relative w-full text-left glass-panel bg-surface/95 border-border-bright rounded-2xl shadow-lg shadow-black/40"
        >
          <span className="relative block px-3.5 py-2.5 text-[13px] leading-snug text-text">
            <Typewriter text={text} />
          </span>
          <span
            className={`absolute ${tail} w-3 h-3 rotate-45 bg-surface border-border-bright`}
          />
        </button>
      )}
    </motion.div>
  );
}
