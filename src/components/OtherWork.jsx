import { motion } from "framer-motion";
import data from "../data/data.json";

const OtherWork = () => {
  const projects = data.projects;

  return (
    <section id="projects" className="relative max-w-screen-lg mx-auto px-4 md:px-8 py-24">
      <div className="text-center mb-14">
        <span className="eyebrow">Smaller, still real</span>
        <h1 className="section-title">Other Work</h1>
      </div>

      <div className="divide-y divide-border glass-panel overflow-hidden">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="p-6 sm:p-7"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-display font-semibold text-text">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-xs text-accent/90">
                    {tech}
                    {tech !== project.technologies[project.technologies.length - 1] && (
                      <span className="text-muted"> ·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-prose">
              {project.description}
            </p>
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 font-mono text-xs text-accent hover:underline"
              >
                {new URL(project.href).hostname} ↗
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OtherWork;
