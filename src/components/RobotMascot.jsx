/* eslint-disable react/prop-types */
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import RobotDefs from "./RobotDefs";

const legTransition = {
  duration: 0.5,
  repeat: Infinity,
  ease: "easeInOut",
};

// A full-body glossy toy-robot — head, torso, articulated arms and legs —
// that swings its limbs through a real walk cycle while `walking` is true,
// and just stands with a slight idle presence otherwise.
export default function RobotMascot({ walking = false }) {
  const id = useId();

  const leftLeg = walking ? { rotate: [0, 22, 0, -22, 0] } : { rotate: 0 };
  const rightLeg = walking ? { rotate: [0, -22, 0, 22, 0] } : { rotate: 0 };
  const leftArm = walking ? { rotate: [0, -16, 0, 16, 0] } : { rotate: 0 };
  const rightArm = walking ? { rotate: [0, 16, 0, -16, 0] } : { rotate: 0 };

  const shell = `url(#${id}-shell)`;
  const visor = `url(#${id}-visor)`;
  const glow = `url(#${id}-glow)`;

  return (
    <svg
      viewBox="0 0 64 100"
      className="relative w-full h-full drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
    >
      <RobotDefs id={id} />

      {/* antenna */}
      <line x1="32" y1="10" x2="32" y2="4" stroke="#9aa4af" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="3" r="5.5" fill={glow} />
      <motion.circle
        cx="32"
        cy="3"
        r="2.3"
        fill="rgb(var(--color-accent-rgb))"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* left arm */}
      <motion.g style={{ transformOrigin: "13px 42px" }} animate={leftArm} transition={legTransition}>
        <rect x="5" y="40" width="9" height="24" rx="4.5" fill={shell} />
        <circle cx="9.5" cy="64" r="4.4" fill={shell} />
      </motion.g>

      {/* right arm */}
      <motion.g style={{ transformOrigin: "51px 42px" }} animate={rightArm} transition={legTransition}>
        <rect x="50" y="40" width="9" height="24" rx="4.5" fill={shell} />
        <circle cx="54.5" cy="64" r="4.4" fill={shell} />
      </motion.g>

      {/* left leg */}
      <motion.g style={{ transformOrigin: "24px 68px" }} animate={leftLeg} transition={legTransition}>
        <rect x="19" y="66" width="10" height="26" rx="5" fill={shell} />
        <ellipse cx="24" cy="93" rx="7" ry="3.3" fill={`url(#${id}-joint)`} />
      </motion.g>

      {/* right leg */}
      <motion.g style={{ transformOrigin: "40px 68px" }} animate={rightLeg} transition={legTransition}>
        <rect x="35" y="66" width="10" height="26" rx="5" fill={shell} />
        <ellipse cx="40" cy="93" rx="7" ry="3.3" fill={`url(#${id}-joint)`} />
      </motion.g>

      {/* torso */}
      <rect x="15" y="38" width="34" height="30" rx="9" fill={shell} />
      <circle cx="32" cy="53" r="8" fill={glow} />
      <motion.circle
        cx="32"
        cy="53"
        r="4"
        fill="rgb(var(--color-accent-rgb))"
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* neck */}
      <rect x="29" y="33" width="6" height="6" fill={shell} />

      {/* head */}
      <rect x="17" y="9" width="30" height="24" rx="10" fill={shell} />
      {/* visor / face plate */}
      <rect x="20.5" y="14" width="23" height="14" rx="7" fill={visor} />
      {/* eye glow bloom */}
      <circle cx="25.5" cy="21" r="4.5" fill={glow} />
      <circle cx="38.5" cy="21" r="4.5" fill={glow} />
      {/* eyes */}
      <rect x="23" y="19" width="5" height="4" rx="2" fill="rgb(var(--color-accent-rgb))" />
      <rect x="36" y="19" width="5" height="4" rx="2" fill="rgb(var(--color-accent-rgb))" />
    </svg>
  );
}
