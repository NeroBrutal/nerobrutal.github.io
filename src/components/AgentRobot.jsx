/* eslint-disable react/prop-types */
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import RobotDefs from "./RobotDefs";
import { partMotion, resolveStunt } from "../lib/mascotStunts";

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

// MCU-style eye slit: outer corner higher, bright cyan core, white hot-spot.
function IronEye({ slit, well, accent, glow, id }) {
  return (
    <g>
      <path d={well} fill={`url(#${id}-eye-well)`} />
      <path d={well} fill={glow} opacity="0.35" />
      <path d={slit} fill={glow} opacity="0.9" />
      <path d={slit} fill={accent} />
      <motion.path
        d={slit}
        fill="#ffffff"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={eyePulse}
      />
    </g>
  );
}

function Head({ id, cx, cy, shell, glow, accent }) {
  const face = `url(#${id}-faceplate)`;
  const top = cy - 21;
  const chin = cy + 19;
  const eyeY = top + 12;

  // Helmet shell (wider at temples, wraps behind faceplate).
  const helmet = `M ${cx - 24} ${top + 11}
    L ${cx - 20} ${top + 2}
    L ${cx - 8} ${top - 4}
    L ${cx} ${top - 5}
    L ${cx + 8} ${top - 4}
    L ${cx + 20} ${top + 2}
    L ${cx + 24} ${top + 11}
    L ${cx + 22} ${chin - 4}
    L ${cx + 10} ${chin + 2}
    L ${cx} ${chin + 4}
    L ${cx - 10} ${chin + 2}
    L ${cx - 22} ${chin - 4} Z`;

  // Raised brow / upper faceplate (classic Iron Man overhang).
  const brow = `M ${cx - 20} ${top + 8}
    L ${cx - 16} ${top + 3}
    L ${cx} ${top + 1}
    L ${cx + 16} ${top + 3}
    L ${cx + 20} ${top + 8}
    L ${cx + 18} ${top + 14}
    L ${cx - 18} ${top + 14} Z`;

  const lowerFace = `M ${cx - 18} ${top + 14}
    L ${cx + 18} ${top + 14}
    L ${cx + 20} ${chin - 5}
    L ${cx + 8} ${chin + 1}
    L ${cx} ${chin + 3}
    L ${cx - 8} ${chin + 1}
    L ${cx - 20} ${chin - 5} Z`;

  // Eye wells (dark recess) + iconic swept slits.
  const leftWell = `M ${cx - 19} ${eyeY + 1}
    L ${cx - 6} ${eyeY}
    L ${cx - 5} ${eyeY + 10}
    L ${cx - 18} ${eyeY + 11} Z`;
  const rightWell = `M ${cx + 6} ${eyeY}
    L ${cx + 19} ${eyeY + 1}
    L ${cx + 18} ${eyeY + 11}
    L ${cx + 5} ${eyeY + 10} Z`;

  const leftSlit = `M ${cx - 5.5} ${eyeY + 7}
    L ${cx - 4.5} ${eyeY + 3}
    L ${cx - 15} ${eyeY + 2}
    L ${cx - 17} ${eyeY + 5}
    L ${cx - 14} ${eyeY + 9}
    L ${cx - 6} ${eyeY + 9.5} Z`;
  const rightSlit = `M ${cx + 5.5} ${eyeY + 7}
    L ${cx + 6.5} ${eyeY + 3}
    L ${cx + 15} ${eyeY + 2}
    L ${cx + 17} ${eyeY + 5}
    L ${cx + 14} ${eyeY + 9}
    L ${cx + 6} ${eyeY + 9.5} Z`;

  return (
    <g>
      <path d={helmet} fill={shell} opacity="0.92" />
      <path d={helmet} fill={`url(#${id}-shell-side)`} opacity="0.22" />

      <path d={brow} fill={face} stroke="#b8c5d0" strokeWidth="0.45" />
      <path
        d={`M ${cx - 14} ${top + 13} L ${cx + 14} ${top + 13}`}
        stroke="#7a8794"
        strokeWidth="0.55"
        opacity="0.55"
      />

      <path d={lowerFace} fill={face} stroke="#a8b4c0" strokeWidth="0.45" />

      {/* Nose bridge + center seam */}
      <path
        d={`M ${cx} ${top + 14} L ${cx} ${chin - 1}`}
        stroke="#8b96a3"
        strokeWidth="0.65"
        opacity="0.4"
      />
      <path
        d={`M ${cx - 2} ${top + 15} L ${cx} ${top + 13} L ${cx + 2} ${top + 15}`}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="0.5"
        opacity="0.6"
      />

      <IronEye slit={leftSlit} well={leftWell} accent={accent} glow={glow} id={id} />
      <IronEye slit={rightSlit} well={rightWell} accent={accent} glow={glow} id={id} />

      {/* Chin vent grille (horizontal slots) */}
      {[-8, -4, 0, 4, 8].map((dx) => (
        <rect
          key={dx}
          x={cx + dx - 2.5}
          y={chin - 1}
          width="5"
          height="1.4"
          rx="0.4"
          fill="#0a0e14"
          opacity="0.9"
        />
      ))}

      {/* Cheek contour lines */}
      <path
        d={`M ${cx - 16} ${top + 20} Q ${cx - 20} ${cy + 4} ${cx - 12} ${chin - 4}`}
        fill="none"
        stroke="#9aa8b6"
        strokeWidth="0.45"
        opacity="0.35"
      />
      <path
        d={`M ${cx + 16} ${top + 20} Q ${cx + 20} ${cy + 4} ${cx + 12} ${chin - 4}`}
        fill="none"
        stroke="#9aa8b6"
        strokeWidth="0.45"
        opacity="0.35"
      />

      {/* Forehead arc (reactor hint) */}
      <motion.circle
        cx={cx}
        cy={top + 5}
        r="2"
        fill={accent}
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={eyePulse}
      />
      <circle cx={cx} cy={top + 5} r="3.2" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.35" />
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

// Boot thruster: outer plume, white-hot core and a bloom, flickering.
function Flame({ cx, cy, accent, glow }) {
  return (
    <motion.g
      animate={{ scaleY: [1, 1.3, 0.92, 1.22, 1], opacity: [1, 0.85, 1, 0.9, 1] }}
      transition={{ duration: 0.16, repeat: Infinity }}
    >
      <circle cx={cx} cy={cy - 4} r="26" fill="none" />
      <ellipse cx={cx} cy={cy + 6} rx="8" ry="14" fill={glow} opacity="0.8" />
      <path d={`M${cx - 5.5} ${cy - 4} Q${cx} ${cy + 24} ${cx + 5.5} ${cy - 4} Z`} fill={accent} opacity="0.85" />
      <path d={`M${cx - 3} ${cy - 4} Q${cx} ${cy + 14} ${cx + 3} ${cy - 4} Z`} fill="#ffffff" />
    </motion.g>
  );
}

function Repulsor({ cx, cy, accent, glow, motionProps }) {
  return (
    <motion.g {...motionProps}>
      <circle cx={cx} cy={cy} r="10" fill={glow} />
      <circle cx={cx} cy={cy} r="3.4" fill="#ffffff" />
      <circle cx={cx} cy={cy} r="5.2" fill="none" stroke={accent} strokeWidth="1.2" />
    </motion.g>
  );
}

// Perched on an edge: hands resting beside him, legs dangling over the front
// and kicking slowly, head tilting as he looks around.
const SIT_POSE = {
  leftArm: { animate: { rotate: 22, y: 0 }, transition: { duration: 0.35 } },
  rightArm: { animate: { rotate: -22, y: 0 }, transition: { duration: 0.35 } },
  leftLeg: {
    animate: { rotate: [14, -6, 14], y: 0 },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  rightLeg: {
    animate: { rotate: [-6, 14, -6], y: 0 },
    transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
  },
  head: {
    animate: { rotate: [0, 7, 0, -7, 0], y: 0 },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

function limbProps(stunt, walking, sitting, part, walkFrames) {
  if (stunt && resolveStunt(stunt)?.[part]) return partMotion(stunt, part, { rotate: 0, y: 0 });
  if (sitting && SIT_POSE[part]) return SIT_POSE[part];
  if (stunt) return partMotion(stunt, part, { rotate: 0, y: 0 });
  if (walking && walkFrames) return { animate: { rotate: walkFrames, y: 0 }, transition: walkCycle };
  return { animate: { rotate: 0, y: 0 }, transition: { duration: 0.3 } };
}

export default function AgentRobot({ walking = false, stunt = null, sitting = false, className = "" }) {
  const id = useId().replace(/:/g, "");
  const accent = "rgb(var(--color-accent-rgb))";
  const shell = `url(#${id}-shell)`;
  const glow = `url(#${id}-glow)`;
  const joint = `url(#${id}-joint)`;

  const flame = partMotion(stunt, "flame", { opacity: 0 });
  const thrust = partMotion(stunt, "thrust", { scaleY: 1 });
  const repulsor = partMotion(stunt, "repulsor", { opacity: 0 });

  return (
    <div className={className}>
      <svg
        viewBox="0 0 64 100"
        className="relative w-full h-full overflow-visible"
      >
        <RobotDefs id={id} />

        <motion.g {...flame}>
          <Joint px={32} py={94} reach={60} motionProps={thrust}>
            <Flame cx={24} cy={97} accent={accent} glow={glow} />
            <Flame cx={40} cy={97} accent={accent} glow={glow} />
          </Joint>
        </motion.g>

        <Joint px={24} py={69} motionProps={limbProps(stunt, walking, sitting, "leftLeg", [0, 18, 0, -18, 0])}>
          <rect x="19" y="66" width="10" height="26" rx="5" fill={shell} />
          <ellipse cx="24" cy="93" rx="7" ry="3.2" fill={joint} />
        </Joint>

        <Joint px={40} py={69} motionProps={limbProps(stunt, walking, sitting, "rightLeg", [0, -18, 0, 18, 0])}>
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

        <Joint px={32} py={40} reach={50} motionProps={limbProps(stunt, false, sitting, "head")}>
          <Head id={id} cx={32} cy={23} shell={shell} glow={glow} accent={accent} />
        </Joint>

        <Joint px={11} py={44} motionProps={limbProps(stunt, walking, sitting, "leftArm", [0, -14, 0, 12, 0])}>
          <rect x="6.5" y="42" width="9" height="22" rx="4.5" fill={shell} />
          <Hand cx={11} y={64} shell={shell} joint={joint} />
          <Repulsor cx={11} cy={71} accent={accent} glow={glow} motionProps={repulsor} />
        </Joint>

        <Joint px={53} py={44} motionProps={limbProps(stunt, walking, sitting, "rightArm", [0, 12, 0, -14, 0])}>
          <rect x="48.5" y="42" width="9" height="22" rx="4.5" fill={shell} />
          <Hand cx={53} y={64} shell={shell} joint={joint} />
          <Repulsor cx={53} cy={71} accent={accent} glow={glow} motionProps={repulsor} />
        </Joint>
      </svg>
    </div>
  );
}
