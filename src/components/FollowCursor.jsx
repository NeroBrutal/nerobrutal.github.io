"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function FollowCursor() {
  const ref = useRef(null);
  const { x, y } = useFollowPointer(ref);

  return (
    <motion.div
      ref={ref}
      style={{
        ...ball,
        x,
        y,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
    />
  );
}

const spring = { damping: 8, stiffness: 100, restDelta: 0.001 };

function useFollowPointer(ref) {
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }) => {
      const el = ref.current;
      x.set(clientX - el.offsetWidth / 2);
      y.set(clientY - el.offsetHeight / 2);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return { x, y };
}

const ball = {
  width: 20,
  height: 20,
  backgroundColor: "#fff",
  border: "2px solid #3B82F6",
  borderRadius: "50%",
  mixBlendMode: "difference",
  boxShadow: "0 0 15px rgba(59,130,246,0.4)",
  opacity: 0.9,
};
