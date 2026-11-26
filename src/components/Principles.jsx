import { motion } from "framer-motion";
import data from "../data/data.json";

const Principles = () => {
  const principles = data.principles;

  return (
    <section id="how-i-work" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-12">
        <span className="eyebrow">How I work</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex gap-4"
          >
            <span className="font-mono text-xs text-accent/70 pt-1 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-text mb-1">{p.title}</p>
              <p className="text-sm text-muted leading-relaxed">{p.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Principles;
