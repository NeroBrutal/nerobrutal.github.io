import { motion } from "framer-motion";
import data from "../data/data.json";

const Skills = () => {
  const categories = data.technologies;

  return (
    <section id="skills" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-24">
      <div className="text-center mb-14">
        <span className="eyebrow">Reference, not a demo reel</span>
        <h1 className="section-title">Skills</h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
            className="glass-panel p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-accent/80 font-semibold mb-4">
              {cat.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface border border-border text-text/80 text-xs px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
