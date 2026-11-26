import { motion } from "framer-motion";
import data from "../data/data.json";

// Stays invisible until data.testimonials has real, consented quotes in it —
// never populated with placeholder or invented text.
const Testimonials = () => {
  const testimonials = data.testimonials;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-20">
      <div className="text-center mb-14">
        <span className="eyebrow">What people say</span>
        <h1 className="section-title">Testimonials</h1>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-panel p-6"
          >
            <p className="text-sm text-text/90 leading-relaxed mb-4">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              {t.photo && (
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-border"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-text">{t.name}</p>
                <p className="text-xs text-muted">{t.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
