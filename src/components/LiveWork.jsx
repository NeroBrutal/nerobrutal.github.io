import { motion } from "framer-motion";
import data from "../data/data.json";
import BrowserFrame from "./BrowserFrame";

/* eslint-disable react/prop-types */
const Card = ({ site, index, big }) => (
  <motion.a
    href={site.href}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.45, delay: index * 0.06 }}
    className={`group block ${big ? "sm:col-span-2" : ""}`}
  >
    <div className="transition-transform duration-300 group-hover:-translate-y-1">
      <BrowserFrame
        src={site.image}
        alt={`${site.name} home page`}
        url={new URL(site.href).hostname}
      />
    </div>
    <div className="mt-3 flex items-baseline justify-between gap-3">
      <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
        {site.name} <span className="text-accent">↗</span>
      </p>
      <p className="text-xs text-muted text-right">{site.kind}</p>
    </div>
  </motion.a>
);

const LiveWork = () => {
  const [featured, ...rest] = data.live_work;

  return (
    <section
      id="live-work"
      className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-20"
    >
      <div className="text-center mb-12">
        <span className="eyebrow">Shipped and live</span>
        <h1 className="section-title">Live Work</h1>
        <p className="mt-4 text-sm text-muted max-w-xl mx-auto">
          Websites I built that are running today, on Astro and Cloudflare.
          Screenshots of the live home pages, taken November 2026.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-10">
        <Card site={featured} index={0} big />
        {rest.map((site, i) => (
          <Card key={site.href} site={site} index={i + 1} />
        ))}
      </div>
    </section>
  );
};

export default LiveWork;
