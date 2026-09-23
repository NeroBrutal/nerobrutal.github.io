/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineChevronDown } from "react-icons/hi2";

const TimelineItem = ({
  item,
  index,
  align,
  logoSrc,
  duration,
  subtitle,
}) => {
  const [open, setOpen] = useState(false);
  const hasMoreDetails = Array.isArray(item.details) && item.details.length > 2;
  const visibleDetails = hasMoreDetails && !open
    ? item.details.slice(0, 2)
    : item.details;

  return (
    <motion.div
      className={`relative flex flex-col md:flex-row items-start gap-6 mb-10 md:mb-14 ${
        align === "right" ? "md:flex-row-reverse" : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
    >
      {/* Node on the center line (desktop only) */}
      <span className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-bg border-2 border-accent z-10">
        <span className="m-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
      </span>

      <div className="hidden md:block md:w-1/2" />

      <div className="w-full md:w-1/2">
        <div className="glass-panel card-hover p-6">
          <div className="flex items-start gap-4">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={item.title}
                className="w-14 h-14 object-contain rounded-xl border border-border bg-surface p-1.5 shrink-0"
              />
            )}
            <div className="min-w-0">
              <h4 className="text-lg font-semibold font-display text-text">
                {item.title}
              </h4>
              {subtitle && (
                <p className="text-sm text-accent/90 font-medium">
                  {subtitle}
                </p>
              )}
              <p className="text-xs text-muted mt-1">
                {item.year} {duration && `• ${duration}`}
              </p>
              {item.location && (
                <p className="text-xs text-muted">{item.location}</p>
              )}
            </div>
          </div>

          {item.summary && (
            <p className="mt-4 text-sm text-text/80 leading-relaxed">
              {item.summary}
            </p>
          )}

          {Array.isArray(item.details) && item.details.length > 0 && (
            <>
              <ul className="list-disc list-inside mt-3 space-y-1.5">
                {visibleDetails.map((point, i) => (
                  <li key={i} className="text-sm text-muted">
                    {point}
                  </li>
                ))}
              </ul>

              {hasMoreDetails && (
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-2 transition-colors"
                >
                  {open ? "Show less" : `Show ${item.details.length - 2} more`}
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineChevronDown size={14} />
                  </motion.span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineItem;
