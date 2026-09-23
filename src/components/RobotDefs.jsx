/* eslint-disable react/prop-types */
"use client";

// Shared gradient/filter defs for the glossy toy-robot look — used by both
// RobotMascot (walking companion) and PeekingRobot so they read as the same
// character. `id` must be unique per SVG instance (pass a React useId()) so
// multiple robots can be mounted on the page at once without id collisions.
export default function RobotDefs({ id }) {
  return (
    <defs>
      {/* glossy white/silver plastic shell */}
      <radialGradient id={`${id}-shell`} cx="35%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#f6f9fc" />
        <stop offset="45%" stopColor="#dde3ea" />
        <stop offset="100%" stopColor="#a7b0ba" />
      </radialGradient>
      {/* dark glass visor with a soft diagonal sheen */}
      <linearGradient id={`${id}-visor`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#232c3d" />
        <stop offset="45%" stopColor="#0a0d14" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>
      {/* soft glow bloom behind lit elements (eyes, antenna, core) */}
      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgb(var(--color-accent-rgb))" stopOpacity="0.9" />
        <stop offset="100%" stopColor="rgb(var(--color-accent-rgb))" stopOpacity="0" />
      </radialGradient>
      {/* dark joint plastic (fingers, hinges) */}
      <linearGradient id={`${id}-joint`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a4250" />
        <stop offset="100%" stopColor="#181c24" />
      </linearGradient>
    </defs>
  );
}
