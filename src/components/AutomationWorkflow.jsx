/* eslint-disable react/prop-types */
"use client";

import { motion, useReducedMotion } from "framer-motion";
import data from "../data/data.json";
import { fadeUp, viewportOnce } from "../lib/motionPresets";
import { resolveTechIconSrc } from "../lib/techIcons";

function Connector({ vertical = false }) {
  return (
    <div
      className={
        vertical
          ? "flex flex-col items-center justify-center py-1 md:hidden"
          : "hidden md:flex items-center shrink-0 w-10 lg:w-14"
      }
      aria-hidden
    >
      {vertical ? (
        <>
          <span className="w-px h-5 bg-accent/35" />
          <span className="w-2 h-2 rounded-full border border-accent/50 bg-bg" />
          <span className="w-px h-5 bg-accent/35" />
        </>
      ) : (
        <>
          <span className="h-px flex-1 bg-gradient-to-r from-accent/10 via-accent/45 to-accent/10" />
          <span className="w-2 h-2 rounded-full border border-accent/60 bg-accent/20 shrink-0" />
          <span className="h-px flex-1 bg-gradient-to-r from-accent/10 via-accent/45 to-accent/10" />
        </>
      )}
    </div>
  );
}

function FlowNode({ title, detail, iconSrc, variant, ports = "both" }) {
  const variantClass = {
    trigger: "workflow-node--trigger",
    orchestrator: "workflow-node--orchestrator",
    router: "workflow-node--router",
    provider: "workflow-node--provider",
  }[variant];

  return (
    <div className={`workflow-node ${variantClass}`}>
      {(ports === "both" || ports === "in") && (
        <span className="workflow-port workflow-port--in" />
      )}
      {(ports === "both" || ports === "out") && (
        <span className="workflow-port workflow-port--out" />
      )}
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          className="h-8 w-8 object-contain shrink-0"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <span className="workflow-node-icon-placeholder" aria-hidden />
      )}
      <div className="min-w-0 text-left">
        <p className="text-sm font-semibold text-text leading-tight truncate">{title}</p>
        {detail && (
          <p className="text-[11px] text-muted leading-snug mt-0.5 truncate">{detail}</p>
        )}
      </div>
    </div>
  );
}

export default function AutomationWorkflow() {
  const categories = data.technologies ?? [];
  const reduce = useReducedMotion();

  const flatTech = categories.flatMap((cat) => cat.technologies);
  const iconByName = (...names) => {
    for (const name of names) {
      const hit = flatTech.find((t) => t.name === name);
      if (hit?.imageSrc) return resolveTechIconSrc(hit.name, hit.imageSrc);
    }
    return undefined;
  };

  const appsIcon = iconByName("React", "Replicate", "FastAPI", "Node.js");
  const n8nIcon = iconByName("n8n");
  const shipIcon = iconByName("Python", "Github", "Docker");

  if (categories.length === 0) return null;

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6"
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div
        variants={fadeUp}
        className="relative p-4 sm:p-6 md:p-8 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />

        <div className="relative flex flex-col items-stretch md:items-center">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            <FlowNode
              variant="trigger"
              title="Apps & APIs"
              detail="Agents · products · integrations"
              iconSrc={appsIcon}
              ports="out"
            />
            <Connector />
            <Connector vertical />
            <FlowNode
              variant="orchestrator"
              title="n8n"
              detail="Workflows & automation"
              iconSrc={n8nIcon}
            />
            <Connector />
            <Connector vertical />
            <FlowNode
              variant="router"
              title="Ship stack"
              detail="Same tools as production"
              iconSrc={shipIcon}
              ports="out"
            />
          </div>

          <div className="hidden md:flex justify-center my-4" aria-hidden>
            <span className="w-px h-10 bg-gradient-to-b from-accent/50 to-accent/15" />
          </div>
          <Connector vertical />

          <div className="space-y-8 mt-2 md:mt-0">
            {categories.map((cat) => (
              <div key={cat.category}>
                <p className="text-center text-[11px] sm:text-xs uppercase tracking-[0.25em] text-accent/75 font-semibold mb-3">
                  {cat.category}
                </p>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                  aria-label={cat.category}
                >
                  {cat.technologies.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: i * 0.02 }}
                      className="relative"
                    >
                      <span
                        className="hidden md:block absolute left-1/2 -top-4 -translate-x-1/2 w-px h-3 bg-accent/20"
                        aria-hidden
                      />
                      <FlowNode
                        variant="provider"
                        title={tech.name}
                        iconSrc={resolveTechIconSrc(tech.name, tech.imageSrc)}
                        ports="in"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
