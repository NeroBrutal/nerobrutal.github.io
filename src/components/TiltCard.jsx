/* eslint-disable react/prop-types */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";

// 3D mouse-tracked tilt with a light sweep that follows the cursor —
// disabled on touch devices and for prefers-reduced-motion, where it just
// renders children flat.
export default function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), {
    stiffness: 260,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), {
    stiffness: 260,
    damping: 24,
  });
  const shineX = useTransform(px, (v) => `${v * 100}%`);
  const shineY = useTransform(py, (v) => `${v * 100}%`);
  const shine = useMotionTemplate`radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.16), transparent 55%)`;

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setEnabled(isFinePointer && !reduceMotion);
  }, []);

  const handleMove = (e) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: shine }}
      />
    </motion.div>
  );
}
