"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LOADER_MS = 1800;

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOADER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="relative w-24 h-24 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-accent/30 animate-spin-slow" />
            <span className="absolute inset-3 rounded-full border border-dashed border-border-bright animate-spin-slower" />
            <motion.span
              className="w-4 h-4 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-6 text-sm tracking-[0.3em] uppercase text-muted opacity-80">
            Entering orbit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
