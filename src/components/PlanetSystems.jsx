/* eslint-disable react/prop-types */
"use client";

import { useLiteGraphics } from "../lib/liteGraphics";

// Background planets on tilted, elliptical orbits. Everything moves with pure
// CSS transforms (see the `orbit-*` keyframes in index.css) so it runs on the
// compositor and costs nothing per frame on the main thread.
//
// An orbit is a circle squashed by `squash` and tilted by `tilt`; the body
// counter-rotates and un-squashes so it stays round and upright. It is drawn
// in front of the planet for the near half of the lap and behind it for the far half.

function Orbit({ radius, squash, tilt, seconds, phase = 0, children }) {
  const timing = { animationDuration: `${seconds}s`, animationDelay: `${-phase * seconds}s` };
  return (
    <div className="absolute left-0 top-0 orbit-depth" style={timing}>
      <div style={{ transform: `rotate(${tilt}deg) scaleY(${squash})` }}>
        <div className="orbit-spin" style={timing}>
          <div style={{ transform: `translateX(${radius}px)` }}>
            <div
              className="orbit-counter"
              style={{ ...timing, "--unsquash": 1 / squash, "--untilt": `${-tilt}deg` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrbitPath({ radius, squash, tilt }) {
  return (
    <div
      className="absolute left-0 top-0"
      style={{ transform: `rotate(${tilt}deg) scaleY(${squash})` }}
    >
      <div
        className="absolute rounded-full border border-dashed border-white/[0.07]"
        style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }}
      />
    </div>
  );
}

function Sphere({ size, id, light, mid, dark, glow }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="block overflow-visible">
      <defs>
        <radialGradient id={`${id}-body`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
        {glow && (
          <radialGradient id={`${id}-glow`}>
            <stop offset="55%" stopColor={glow} stopOpacity="0.35" />
            <stop offset="100%" stopColor={glow} stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      {glow && <circle cx="50" cy="50" r="80" fill={`url(#${id}-glow)`} />}
      <circle cx="50" cy="50" r="50" fill={`url(#${id}-body)`} />
    </svg>
  );
}

function RingedGiant({ size }) {
  return (
    <svg
      width={size * 2.2}
      height={size * 2.2}
      viewBox="-60 -60 220 220"
      className="block overflow-visible"
      style={{ transform: "rotate(-18deg)" }}
    >
      <defs>
        <radialGradient id="giant-body" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="45%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#082f49" />
        </radialGradient>
        <radialGradient id="giant-atmo">
          <stop offset="60%" stopColor="rgb(34 211 238)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="giant-ring" x1="0" x2="1">
          <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.05" />
          <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#a5f3fc" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="giant-shade" cx="80%" cy="85%" r="70%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id="giant-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        {/* Only the half of the ring nearer the viewer is drawn over the planet. */}
        <clipPath id="giant-ring-front">
          <rect x="-60" y="50" width="220" height="60" />
        </clipPath>
      </defs>

      <circle cx="50" cy="50" r="68" fill="url(#giant-atmo)" />
      <ellipse cx="50" cy="50" rx="95" ry="20" fill="none" stroke="url(#giant-ring)" strokeWidth="9" />
      <ellipse cx="50" cy="50" rx="80" ry="16" fill="none" stroke="url(#giant-ring)" strokeWidth="3" opacity="0.6" />

      <circle cx="50" cy="50" r="50" fill="url(#giant-body)" />
      <g clipPath="url(#giant-clip)" opacity="0.35">
        <ellipse cx="50" cy="30" rx="70" ry="5" fill="#ccfbf1" />
        <ellipse cx="50" cy="46" rx="70" ry="3" fill="#083344" />
        <ellipse cx="50" cy="60" rx="70" ry="7" fill="#99f6e4" opacity="0.6" />
        <ellipse cx="50" cy="76" rx="70" ry="4" fill="#083344" />
      </g>
      {/* Terminator shadow on the far side from the light. */}
      <circle cx="50" cy="50" r="50" fill="url(#giant-shade)" />

      <g clipPath="url(#giant-ring-front)">
        <ellipse cx="50" cy="50" rx="95" ry="20" fill="none" stroke="url(#giant-ring)" strokeWidth="9" />
        <ellipse cx="50" cy="50" rx="80" ry="16" fill="none" stroke="url(#giant-ring)" strokeWidth="3" opacity="0.6" />
      </g>
    </svg>
  );
}

const GIANT = 140;
const MOONS = [
  { radius: 150, squash: 0.32, tilt: -14, seconds: 28, phase: 0.1, size: 20, id: "moon-rock", light: "#e5e7eb", mid: "#9ca3af", dark: "#374151" },
  { radius: 225, squash: 0.3, tilt: -20, seconds: 52, phase: 0.62, size: 30, id: "moon-ice", light: "#e0f2fe", mid: "#60a5fa", dark: "#1e3a8a", glow: "#93c5fd" },
];

export default function PlanetSystems() {
  const lite = useLiteGraphics();
  if (lite) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Gas giant with two moons, upper right. */}
      <div className="absolute right-[16vw] top-[28vh] scale-[0.55] sm:scale-75 lg:scale-100 origin-top-right opacity-90">
        <div className="relative" style={{ width: 0, height: 0 }}>
          {MOONS.map((m) => (
            <OrbitPath key={`${m.id}-path`} {...m} />
          ))}
          <div className="absolute left-0 top-0 z-[2] -translate-x-1/2 -translate-y-1/2">
            <RingedGiant size={GIANT} />
          </div>
          {MOONS.map((m) => (
            <Orbit key={m.id} {...m}>
              <Sphere {...m} />
            </Orbit>
          ))}
        </div>
      </div>

      {/* A distant red planet circling a small star, lower left. */}
      <div className="absolute left-[9vw] bottom-[16vh] hidden md:block opacity-75">
        <div className="relative" style={{ width: 0, height: 0 }}>
          <OrbitPath radius={90} squash={0.42} tilt={10} />
          <div className="absolute left-0 top-0 z-[2] -translate-x-1/2 -translate-y-1/2">
            <Sphere size={16} id="dwarf-star" light="#fffbeb" mid="#fde68a" dark="#f59e0b" glow="#fcd34d" />
          </div>
          <Orbit radius={90} squash={0.42} tilt={10} seconds={36} phase={0.3}>
            <Sphere size={26} id="red-planet" light="#fdba74" mid="#ea580c" dark="#7c2d12" />
          </Orbit>
        </div>
      </div>
    </div>
  );
}
