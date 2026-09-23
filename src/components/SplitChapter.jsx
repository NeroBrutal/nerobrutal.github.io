/* eslint-disable react/prop-types */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { chapterContainer, chapterLine, fadeUp, viewportOnce } from "../lib/motionPresets";

export default function SplitChapter({ line1, line2, subtitle, eyebrow, className = "" }) {
  const reduce = useReducedMotion();
  const line = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }
    : chapterLine;

  return (
    <motion.header
      className={`py-16 sm:py-24 ${className}`}
      variants={chapterContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      <div className="flex flex-col items-center text-center px-4">
        {eyebrow && (
          <motion.p variants={fadeUp} className="eyebrow mb-6">
            {eyebrow}
          </motion.p>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 w-full max-w-5xl">
          <motion.h2 variants={line} className="chapter-split text-text">
            {line1}
          </motion.h2>
          <motion.h2 variants={line} className="chapter-split text-gradient">
            {line2}
          </motion.h2>
        </div>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-muted text-sm sm:text-base leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.header>
  );
}
