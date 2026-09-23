"use client";
import { motion } from "framer-motion";
import data from "../data/data.json";
import SplitChapter from "./SplitChapter";

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
    <section id="technologies" className="relative pb-24 overflow-hidden">
      <SplitChapter
        eyebrow="Partners & stack"
        line1="TOOLS"
        line2="I SHIP WITH"
        subtitle="Frameworks, models, and infrastructure behind the agents and products on this site."
        className="py-12 sm:py-16"
      />

      <div className="flex flex-col gap-6 max-w-[1200px] mx-auto px-4">
        <Row items={rowOne} duration={40} />
        <Row items={rowTwo} duration={46} reverse />
      </div>
    </section>
  );
};

export default Technologies;
