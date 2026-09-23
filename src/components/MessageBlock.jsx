/* eslint-disable react/prop-types */
"use client";

import { motion } from "framer-motion";
import data from "../data/data.json";
import { chapterContainer, fadeUp, viewportOnce } from "../lib/motionPresets";

const editorial = data.editorial ?? {};

function MessageBody({ parts }) {
  if (!parts?.length) return null;
  return (
    <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-muted max-w-3xl mx-auto text-center">
      {parts.map((part, i) =>
        part.bold ? (
          <span key={i} className="text-text font-semibold">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </p>
  );
}

export default function MessageBlock() {
  const msg = editorial.message ?? {};

  return (
    <section
      id="message"
      className="relative max-w-screen-lg mx-auto px-4 py-20 sm:py-28 scroll-mt-24"
    >
      <motion.div
        variants={chapterContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.p variants={fadeUp} className="eyebrow text-center">
          {msg.eyebrow ?? "Message from Mohamed"}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-center text-xs tracking-[0.25em] uppercase text-muted/80 mt-2 mb-10"
        >
          {editorial.sinceLine}
        </motion.p>

        <MessageBody parts={msg.parts} />

        {msg.quote && (
          <motion.blockquote
            variants={fadeUp}
            className="mt-12 text-center text-sm sm:text-base italic text-muted/90 max-w-lg mx-auto border-t border-border pt-8"
          >
            “{msg.quote}”
          </motion.blockquote>
        )}

        <motion.div
          variants={fadeUp}
          className="mt-10 flex justify-center"
          aria-hidden
        >
          <svg
            viewBox="0 0 200 48"
            className="h-10 w-48 text-accent opacity-90"
            fill="none"
          >
            <path
              d="M12 36 C40 8, 70 44, 98 22 S150 6, 188 30"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              x="100"
              y="42"
              textAnchor="middle"
              className="fill-accent text-[11px] font-display tracking-widest uppercase"
              style={{ fontFamily: "inherit" }}
            >
              MR
            </text>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
