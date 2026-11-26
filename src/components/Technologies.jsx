"use client";
import { motion } from "framer-motion";
import data from "../data/data.json";

const Row = ({ items, duration, reverse }) => (
  <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
    <motion.div
      className="flex gap-5"
      animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
      transition={{ repeat: Infinity, repeatType: "loop", ease: "linear", duration }}
    >
      {[...items, ...items].map((tech, index) => (
        <div
          key={index}
          className="glass-panel card-hover flex flex-col items-center justify-center min-w-[140px] p-4 shrink-0"
        >
          <img
            src={tech.imageSrc}
            alt={tech.name}
            className="h-10 w-10 mb-2 object-contain"
          />
          <span className="text-xs text-center text-muted">
            {tech.name}
          </span>
        </div>
      ))}
    </motion.div>
  </div>
);

const Technologies = () => {
  const categories = data.technologies;

  return (
    <section id="technologies" className="relative py-24 overflow-hidden">
      <div className="text-center mb-14">
        <span className="eyebrow">⚙️ My toolkit</span>
        <h1 className="section-title">Technologies</h1>
      </div>

      <div className="flex flex-col gap-10">
        {categories.map((cat, i) => (
          <div key={cat.category}>
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted mb-4">
              {cat.category}
            </p>
            <Row
              items={cat.technologies}
              duration={32 + cat.technologies.length * 2}
              reverse={i % 2 === 1}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Technologies;
