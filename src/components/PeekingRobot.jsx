/* eslint-disable react/prop-types */
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import RobotDefs from "./RobotDefs";

// A big robot that slides in from the right edge of the viewport, grips the
// border with its hand, and peeks its head over to look in at the page —
// the same glossy character as RobotMascot, just posed differently.
export default function PeekingRobot({ onOpen }) {
  const id = useId();
  const shell = `url(#${id}-shell)`;
  const visor = `url(#${id}-visor)`;
  const glow = `url(#${id}-glow)`;
  const joint = `url(#${id}-joint)`;

  return (
    <motion.button
      onClick={onOpen}
      aria-label="A robot is peeking in — click to chat"
      className="fixed z-[55] pointer-events-auto"
      style={{ top: "32%", right: 0, width: 220, height: 320 }}
      initial={{ x: "88%" }}
      animate={{ x: ["88%", "34%", "38%", "34%", "88%"] }}
      transition={{
        duration: 5,
        times: [0, 0.22, 0.55, 0.85, 1],
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 220 320"
        className="w-full h-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <RobotDefs id={id} />

        {/* shoulder / body mass, mostly implied off-canvas to the right */}
        <ellipse cx="170" cy="150" rx="90" ry="110" fill={shell} opacity="0.97" />

        {/* arm reaching down and in to the gripping hand */}
        <path
          d="M 185 125 Q 162 168 126 205"
          fill="none"
          stroke={shell}
          strokeWidth="26"
          strokeLinecap="round"
        />
        {/* gripping hand + articulated fingers curling over the edge */}
        <g>
          <rect x="106" y="206" width="34" height="38" rx="14" fill={shell} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={111 + i * 7.2} y="182" width="6" height="27" rx="3" fill={joint} />
              <circle cx={114 + i * 7.2} cy="182" r="3.3" fill={joint} />
            </g>
          ))}
        </g>

        {/* head, leaning in to peek */}
        <g transform="rotate(-8 90 90)">
          <rect x="30" y="40" width="110" height="90" rx="32" fill={shell} />
          {/* antenna */}
          <line x1="85" y1="40" x2="80" y2="16" stroke="#9aa4af" strokeWidth="3" strokeLinecap="round" />
          <circle cx="79" cy="14" r="11" fill={glow} />
          <motion.circle
            cx="79"
            cy="14"
            r="5"
            fill="rgb(var(--color-accent-rgb))"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* visor / face plate */}
          <rect x="45" y="60" width="80" height="46" rx="20" fill={visor} />
          {/* eye glow bloom */}
          <circle cx="65" cy="82" r="14" fill={glow} />
          <circle cx="105" cy="82" r="14" fill={glow} />
          {/* screen-slit eyes */}
          <rect x="55" y="76" width="22" height="12" rx="6" fill="rgb(var(--color-accent-rgb))" />
          <rect x="93" y="76" width="22" height="12" rx="6" fill="rgb(var(--color-accent-rgb))" />
        </g>
      </svg>
    </motion.button>
  );
}
