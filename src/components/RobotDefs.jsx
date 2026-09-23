/* eslint-disable react/prop-types */
"use client";

// Shared gradients and filters for the coded agent robot. Pass a React useId()
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

      <filter id={`${id}-drop`} x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.45" />
      </filter>

      <filter id={`${id}-eye-glow`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="2.2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
