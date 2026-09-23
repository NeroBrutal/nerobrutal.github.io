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
  const technologiesData = data.technologies.flatMap((cat) =>
    cat.technologies.map((tech) => ({
      name: tech.name,
      imageSrc: tech.imageSrc,
    }))
  );

  const midpoint = Math.ceil(technologiesData.length / 2);
  const rowOne = technologiesData.slice(0, midpoint);
  const rowTwo = technologiesData.slice(midpoint);

  return (
    <section id="technologies" className="relative py-24 overflow-hidden">
      <div className="text-center mb-14">
        <span className="eyebrow">⚙️ My toolkit</span>
        <h1 className="section-title">Technologies</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Row items={rowOne} duration={40} />
        <Row items={rowTwo} duration={46} reverse />
      </div>
    </section>
  );
};

export default Technologies;
