"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export const FLYBY_EVENT = "spaceship:flyby";

const FIRST_PASS_MS = 12000;
const PASS_SECONDS = 13;
const random = (min, max) => min + Math.random() * (max - min);

function Ship() {
  const accent = "rgb(var(--color-accent-rgb))";
  const windows = Array.from({ length: 17 }, (_, i) => 180 + i * 14);

  return (
    <svg viewBox="0 0 600 200" className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id="ship-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a5669" />
          <stop offset="45%" stopColor="#1c2330" />
          <stop offset="100%" stopColor="#07090e" />
        </linearGradient>
        <linearGradient id="ship-deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b687d" />
          <stop offset="100%" stopColor="#1a212c" />
        </linearGradient>
        <linearGradient id="ship-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0b3a48" />
        </linearGradient>
        <linearGradient id="ship-plume" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="18%" stopColor={accent} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ship-nozzle">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor={accent} />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <filter id="ship-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* engine plume */}
      <motion.g
        animate={{ opacity: [0.85, 1, 0.9, 1], scaleX: [1, 1.08, 0.96, 1.05] }}
        transition={{ duration: 0.25, repeat: Infinity }}
        style={{ originX: 1 }}
      >
        <ellipse cx="-40" cy="100" rx="150" ry="30" fill="url(#ship-plume)" filter="url(#ship-blur)" />
        {[82, 100, 118].map((y) => (
          <ellipse key={y} cx="10" cy={y} rx="95" ry="6" fill="url(#ship-plume)" />
        ))}
      </motion.g>

      {/* far wing */}
      <path d="M250 70 L170 18 L310 62 Z" fill="#11161f" />

      {/* hull */}
      <path
        d="M100 68 L330 56 Q470 58 565 100 Q470 142 330 144 L100 132 Q86 100 100 68 Z"
        fill="url(#ship-hull)"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.2"
      />

      {/* superstructure / bridge */}
      <path d="M240 60 Q300 26 385 36 L440 62 Z" fill="url(#ship-deck)" stroke="rgba(255,255,255,0.12)" />
      <path d="M330 44 L372 42 L386 54 L332 56 Z" fill="url(#ship-glass)" opacity="0.8" />

      {/* fins */}
      <path d="M140 70 L112 26 L205 64 Z" fill="url(#ship-deck)" />
      <path d="M140 130 L112 172 L205 136 Z" fill="#141a24" />

      {/* near wing */}
      <path d="M220 120 L140 192 L320 138 Z" fill="url(#ship-deck)" stroke="rgba(255,255,255,0.1)" />

      {/* cockpit */}
      <path d="M452 78 Q508 84 536 100 L468 100 Z" fill="url(#ship-glass)" />

      {/* panel lines + accent stripe */}
      <path d="M120 88 L520 88 M120 118 L500 118 M260 60 L260 140 M390 60 L390 140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <path d="M115 108 L525 108" stroke={accent} strokeWidth="1.6" opacity="0.7" />

      {/* windows */}
      {windows.map((x, i) => (
        <rect
          key={x}
          x={x}
          y="94"
          width="7"
          height="4"
          rx="1"
          fill={i % 3 === 1 ? "#fff3c4" : accent}
          opacity={i % 4 === 0 ? 0.35 : 0.9}
        />
      ))}

      {/* engine nozzles */}
      {[82, 100, 118].map((y) => (
        <g key={y}>
          <rect x="88" y={y - 7} width="18" height="14" rx="3" fill="#0a0d13" stroke="#3a4454" />
          <circle cx="90" cy={y} r="9" fill="url(#ship-nozzle)" />
        </g>
      ))}

      {/* nav lights */}
      <motion.circle cx="112" cy="26" r="3" fill="#34d399" animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <motion.circle cx="140" cy="192" r="3" fill="#f87171" animate={{ opacity: [0.15, 1, 0.15] }} transition={{ duration: 1.2, repeat: Infinity }} />
      <motion.circle cx="565" cy="100" r="2.5" fill="#ffffff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.8, repeat: Infinity }} />
    </svg>
  );
}

// A big cruiser that dives from the top-right corner to the bottom-left every
// minute or so, growing as it "approaches". Rendered right after the cosmic
// background, so it passes behind the content.
export default function SpaceshipFlyby() {
  const reduceMotion = useReducedMotion();
  const [pass, setPass] = useState(null);
  const timerRef = useRef();

  const schedule = (ms) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(640, Math.max(360, vw * 0.42));
      const height = width / 3;
      const start = { x: vw + 80, y: -height - random(40, 120) };
      const end = { x: -width - 160, y: vh * random(0.6, 0.9) };
      const angle = (Math.atan2(end.y - start.y, end.x - start.x) * 180) / Math.PI;
      setPass({
        id: Date.now(),
        width,
        start,
        end,
        // The ship's nose points left (-x, 180°); turn it to face its path.
        rotate: angle - 180,
      });
    }, ms);
  };

  useEffect(() => {
    if (reduceMotion) return;
    schedule(FIRST_PASS_MS);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    if (!pass) return;
    const t = setTimeout(
      () => window.dispatchEvent(new CustomEvent(FLYBY_EVENT)),
      PASS_SECONDS * 400,
    );
    return () => clearTimeout(t);
  }, [pass]);

  if (!pass) return null;

  return (
    <motion.div
      key={pass.id}
      aria-hidden
      className="fixed left-0 top-0 z-0 pointer-events-none"
      style={{ width: pass.width }}
      initial={{ x: pass.start.x, y: pass.start.y, scale: 0.6 }}
      animate={{ x: pass.end.x, y: pass.end.y, scale: 1.25 }}
      transition={{ duration: PASS_SECONDS, ease: "linear" }}
      onAnimationComplete={() => {
        setPass(null);
        schedule(random(45000, 80000));
      }}
    >
      <div style={{ transform: `rotate(${pass.rotate}deg)` }}>
        <motion.div
          style={{ scaleX: -1 }}
          animate={{ y: [0, -6, 0], rotate: [0, -0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        >
          <Ship />
        </motion.div>
      </div>
    </motion.div>
  );
}
