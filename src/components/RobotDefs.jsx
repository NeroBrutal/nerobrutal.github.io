/* eslint-disable react/prop-types */
"use client";

// Shared gradients for the coded agent robot. Pass a React useId()
// so multiple instances can mount without id collisions.
export default function RobotDefs({ id }) {
  const accent = "rgb(var(--color-accent-rgb))";
  const accent2 = "rgb(var(--color-accent-2-rgb))";

  return (
    <defs>
      <radialGradient id={`${id}-shell`} cx="32%" cy="22%" r="78%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="38%" stopColor="#eef2f7" />
        <stop offset="72%" stopColor="#c8d0da" />
        <stop offset="100%" stopColor="#9aa6b3" />
      </radialGradient>

      <linearGradient id={`${id}-shell-side`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#b8c2cc" />
        <stop offset="35%" stopColor="#f4f7fa" />
        <stop offset="100%" stopColor="#9fadbb" />
      </linearGradient>

      <linearGradient id={`${id}-visor`} x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#2a3545" />
        <stop offset="40%" stopColor="#0a0e16" />
        <stop offset="100%" stopColor="#000000" />
      </linearGradient>

      <linearGradient id={`${id}-faceplate`} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#e8edf3" />
        <stop offset="100%" stopColor="#9aa8b6" />
      </linearGradient>

      <radialGradient id={`${id}-eye-well`} cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#1a2330" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>

      <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>

      <radialGradient id={`${id}-glow-soft`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={accent2} stopOpacity="0.55" />
        <stop offset="100%" stopColor={accent} stopOpacity="0" />
      </radialGradient>

      <linearGradient id={`${id}-joint`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4a5564" />
        <stop offset="100%" stopColor="#151920" />
      </linearGradient>
    </defs>
  );
}
