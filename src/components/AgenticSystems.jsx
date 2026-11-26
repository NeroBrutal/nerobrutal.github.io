import { motion } from "framer-motion";
import {
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlinePuzzlePiece,
  HiOutlineMicrophone,
  HiOutlineShieldCheck,
  HiOutlineServerStack,
} from "react-icons/hi2";
import data from "../data/data.json";
import TiltCard from "./TiltCard";

const iconMap = {
  HiOutlineCpuChip,
  HiOutlineCircleStack,
  HiOutlinePuzzlePiece,
  HiOutlineMicrophone,
  HiOutlineShieldCheck,
  HiOutlineServerStack,
};

const AgenticSystems = () => {
  const systems = data.agentic_systems;

  return (
    <section id="systems" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-24">
      <div className="text-center mb-14">
        <span className="eyebrow">🧠 How the agents are built</span>
        <h1 className="section-title">Agentic AI Systems</h1>
        <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base text-muted leading-relaxed">
          The architecture behind every agent I ship — not just the models,
          but what keeps them reliable, connected and useful in production.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system, i) => {
          const Icon = iconMap[system.icon];
          return (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <TiltCard className="group relative glass-panel card-hover h-full p-6 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 text-accent">
                  {Icon && <Icon size={24} />}
                </div>
                <h3 className="text-lg font-display font-semibold text-text mb-2">
                  {system.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                  {system.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {system.stack.map((tech) => (
                    <span
                      key={tech}
                      className="bg-surface border border-border text-accent text-xs px-2.5 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AgenticSystems;
