import { motion } from "framer-motion";
import data from "../data/data.json";

const Capabilities = () => {
  const capabilities = data.capabilities;

  return (
    <section id="what-i-build" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-12">
        <span className="eyebrow">What I build</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((c, i) => (
          <motion.a
            key={c.title}
            href={c.href}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="glass-panel card-hover p-5 flex flex-col"
          >
            <span className="font-mono text-xs text-accent/70 mb-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-sm font-semibold text-text mb-2">{c.title}</p>
            <p className="text-xs text-muted leading-relaxed mb-4 flex-1">{c.detail}</p>
            <div className="flex flex-wrap gap-1.5">
              {c.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] text-accent/90 border border-accent/20 rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Capabilities;
