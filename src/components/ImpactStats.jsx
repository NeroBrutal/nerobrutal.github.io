/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import data from "../data/data.json";

// Counts up from 0 to the stat's numeric value once it scrolls into view —
// framer-motion's own whileInView drives the fade/rise, this just drives the digits.
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.floor(progress * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, ref];
}

const StatTile = ({ value, label, index }) => {
  const numeric = parseInt(value, 10) || 0;
  const suffix = value.replace(/^[0-9]+/, "");
  const [count, countRef] = useCountUp(numeric);

  return (
    <motion.div
      ref={countRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-panel px-4 py-6 text-center"
    >
      <p className="text-3xl sm:text-4xl font-display font-bold text-gradient">
        {count}
        {suffix}
      </p>
      <p className="mt-2 text-xs sm:text-sm text-muted leading-snug">{label}</p>
    </motion.div>
  );
};

const ImpactStats = () => {
  const impact = data.impact;

  return (
    <div className="relative max-w-screen-lg mx-auto px-4 md:px-8 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {impact.map((item, i) => (
          <StatTile key={item.label} value={item.value} label={item.label} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ImpactStats;
