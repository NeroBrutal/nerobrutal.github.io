"use client";

import { motion } from "framer-motion";

/**
 * Reusable Motion Path animation component
 *
 * Props:
 * - color: stroke color for the path (default "#00BFFF")
 * - boxColor: color of the moving box (default "#8df0cc")
 * - boxSize: number (default 50)
 * - strokeWidth: number (default 8)
 * - duration: seconds (default 4)
 * - repeatType: "reverse" | "loop" (default "reverse")
 */
export default function MotionPath({
  color = "#00BFFF",
  boxColor = "#8df0cc",
  boxSize = 50,
  strokeWidth = 8,
  duration = 4,
  repeatType = "reverse",
}) {
  const transition = {
    duration,
    repeat: Infinity,
    repeatType,
    ease: "easeInOut",
  };

  const pathData =
    "M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5";

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Path */}
      <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
        <motion.path
          d={pathData}
          fill="transparent"
          strokeWidth={strokeWidth}
          stroke={color}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={transition}
        />
      </svg>

      {/* Moving Box */}
      <motion.div
        style={{
          ...boxStyle(boxColor, boxSize, pathData),
        }}
        initial={{ offsetDistance: "0%", scale: 2 }}
        animate={{ offsetDistance: "100%", scale: 1 }}
        transition={transition}
      />
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
const boxStyle = (color, size, path) => ({
  width: size,
  height: size,
  backgroundColor: color,
  borderRadius: 10,
  position: "absolute",
  top: 0,
  left: 0,
  offsetPath: `path("${path}")`,
});
