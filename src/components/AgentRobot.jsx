/* eslint-disable react/prop-types */
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import RobotDefs from "./RobotDefs";
import { partMotion } from "../lib/mascotStunts";

const walkCycle = { duration: 0.5, repeat: Infinity, ease: "easeInOut" };
const eyePulse = { duration: 2.2, repeat: Infinity, ease: "easeInOut" };

// Framer Motion pivots SVG transforms around the element's bounding-box centre
// and ignores `transformOrigin`, so an invisible circle centred on the joint
// makes the bbox centre land exactly on the pivot.
function Joint({ px, py, reach = 40, motionProps, children }) {
  return (
    <motion.g {...motionProps}>
      <circle cx={px} cy={py} r={reach} fill="none" pointerEvents="none" />
      {children}
    </motion.g>
  );
}

function LitEye({ x, y, w = 5.5, h = 13, accent, glow, filter }) {
  return (
    <g filter={filter}>
      <rect x={x - 2} y={y - 1} width={w + 4} height={h + 2} rx={(w + 4) / 2} fill={glow} opacity="0.85" />
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={accent} />
    </g>
  );
}

function Head({ id, cx, cy, shell, visor, glow, accent, eyeFilter }) {
  const x = cx - 26;
  const y = cy - 22;
  return (
    <g>
      <circle cx={x - 2} cy={cy + 1} r="8" fill={shell} stroke={accent} strokeWidth="1.2" />
      <circle cx={x - 2} cy={cy + 1} r="5" fill={glow} opacity="0.4" />
      <circle cx={x + 54} cy={cy + 1} r="8" fill={shell} stroke={accent} strokeWidth="1.2" />
      <circle cx={x + 54} cy={cy + 1} r="5" fill={glow} opacity="0.4" />

      <rect x={x} y={y} width="52" height="44" rx="18" fill={shell} />
      <rect x={x + 3} y={y + 3} width="46" height="38" rx="15" fill={`url(#${id}-shell-side)`} opacity="0.35" />

      <line x1={cx} y1={y - 1} x2={cx} y2={y - 11} stroke="#8b96a3" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={y - 13} r="5" fill={glow} />
      <motion.circle
        cx={cx}
        cy={y - 13}
        r="2.4"
        fill={accent}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={eyePulse}
      />

      <rect x={x + 8} y={y + 10} width="36" height="24" rx="10" fill={visor} />
      <rect x={x + 10} y={y + 12} width="14" height="6" rx="3" fill="#ffffff" opacity="0.07" />

      <LitEye x={x + 15} y={y + 14} accent={accent} glow={glow} filter={eyeFilter} />
      <LitEye x={x + 30} y={y + 14} accent={accent} glow={glow} filter={eyeFilter} />
    </g>
  );
}

function Hand({ cx, y, shell, joint }) {
  return (
    <g>
      <rect x={cx - 5} y={y - 2} width="10" height="7" rx="3" fill={joint} />
      {[-3.5, 0, 3.5].map((dx) => (
        <g key={dx}>
          <line x1={cx + dx} y1={y + 3} x2={cx + dx * 1.2} y2={y + 8} stroke={joint} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx={cx + dx * 1.2} cy={y + 8.5} r="1.8" fill={shell} />
        </g>
      ))}
    </g>
  );
}

function Flame({ cx, cy, accent }) {
  return (
    <motion.g
      animate={{ scaleY: [1, 1.35, 0.9, 1.25, 1] }}
      transition={{ duration: 0.18, repeat: Infinity }}
    >
      <circle cx={cx} cy={cy} r="14" fill="none" />
      <path d={`M${cx - 5} ${cy - 4} Q${cx} ${cy + 20} ${cx + 5} ${cy - 4} Z`} fill="#fff7d6" opacity="0.9" />
      <path d={`M${cx - 3.5} ${cy - 4} Q${cx} ${cy + 13} ${cx + 3.5} ${cy - 4} Z`} fill={accent} />
    </motion.g>
  );
}

function limbProps(stunt, walking, part, walkFrames) {
  if (stunt) return partMotion(stunt, part, { rotate: 0, y: 0 });
  if (walking) return { animate: { rotate: walkFrames, y: 0 }, transition: walkCycle };
  return { animate: { rotate: 0, y: 0 }, transition: { duration: 0.3 } };
}

export default function AgentRobot({ walking = false, stunt = null, className = "" }) {
  const id = useId().replace(/:/g, "");
  const accent = "rgb(var(--color-accent-rgb))";
  const shell = `url(#${id}-shell)`;
  const visor = `url(#${id}-visor)`;
  const glow = `url(#${id}-glow)`;
  const joint = `url(#${id}-joint)`;
  const eyeFilter = `url(#${id}-eye-glow)`;

  const flame = partMotion(stunt, "flame", { opacity: 0 });

  return (
    <div className={className}>
      <svg
        viewBox="0 0 64 100"
        className="relative w-full h-full overflow-visible"
        filter={`url(#${id}-drop)`}
      >
        <RobotDefs id={id} />

        <motion.g {...flame}>
          <Flame cx={24} cy={97} accent={accent} />
          <Flame cx={40} cy={97} accent={accent} />
        </motion.g>

        <Joint px={24} py={69} motionProps={limbProps(stunt, walking, "leftLeg", [0, 18, 0, -18, 0])}>
          <rect x="19" y="66" width="10" height="26" rx="5" fill={shell} />
          <ellipse cx="24" cy="93" rx="7" ry="3.2" fill={joint} />
        </Joint>

        <Joint px={40} py={69} motionProps={limbProps(stunt, walking, "rightLeg", [0, -18, 0, 18, 0])}>
          <rect x="35" y="66" width="10" height="26" rx="5" fill={shell} />
          <ellipse cx="40" cy="93" rx="7" ry="3.2" fill={joint} />
        </Joint>

        <rect x="16" y="40" width="32" height="30" rx="9" fill={shell} />
        <circle cx="32" cy="55" r="7.5" fill={glow} />
        <motion.circle
          cx="32"
          cy="55"
          r="3.6"
          fill={accent}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={eyePulse}
        />

        <Joint px={32} py={40} reach={50} motionProps={limbProps(stunt, false, "head")}>
          <Head id={id} cx={32} cy={23} shell={shell} visor={visor} glow={glow} accent={accent} eyeFilter={eyeFilter} />
        </Joint>

        <Joint px={11} py={44} motionProps={limbProps(stunt, walking, "leftArm", [0, -14, 0, 12, 0])}>
          <rect x="6.5" y="42" width="9" height="22" rx="4.5" fill={shell} />
          <Hand cx={11} y={64} shell={shell} joint={joint} />
        </Joint>

        <Joint px={53} py={44} motionProps={limbProps(stunt, walking, "rightArm", [0, 12, 0, -14, 0])}>
          <rect x="48.5" y="42" width="9" height="22" rx="4.5" fill={shell} />
          <Hand cx={53} y={64} shell={shell} joint={joint} />
        </Joint>
      </svg>
    </div>
  );
}
