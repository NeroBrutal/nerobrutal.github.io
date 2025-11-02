"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 2 seconds (you can adjust)
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null; // hide once loading completes

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <ThreeDots />
      <h2 className="mt-4 text-blue-500 font-semibold text-lg">
        Loading your experience...
      </h2>
    </div>
  );
}

/* ================= Animation ================= */
function ThreeDots() {
  const dotVariants = {
    jump: {
      y: -15,
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: 0.2 }}
      className="flex gap-3"
    >
      <motion.div
        className="w-4 h-4 bg-blue-500 rounded-full"
        variants={dotVariants}
      />
      <motion.div
        className="w-4 h-4 bg-pink-500 rounded-full"
        variants={dotVariants}
      />
      <motion.div
        className="w-4 h-4 bg-purple-500 rounded-full"
        variants={dotVariants}
      />
    </motion.div>
  );
}
