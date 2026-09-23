import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { HiOutlineX, HiOutlineArrowRight, HiOutlineExternalLink } from "react-icons/hi";
import data from "../data/data.json";
import TiltCard from "./TiltCard";
import SplitChapter from "./SplitChapter";

function projectImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/assets/")) return image;
  return image.replace("../assets/", "/assets/");
}

function projectTagline(project) {
  if (project.tagline) return project.tagline;
  const text = project.description || "";
  const end = text.search(/[.!?](\s|$)/);
  if (end > 0 && end < 140) return text.slice(0, end + 1);
  return text.length > 120 ? `${text.slice(0, 117)}…` : text;
}

function statusStyles(status) {
  switch (status) {
    case "Live":
      return "border-success/40 text-success bg-success/10";
    case "Production":
      return "border-accent/40 text-accent bg-accent/10";
    case "Academic":
      return "border-border-bright text-muted bg-surface/80";
    default:
      return "border-border text-muted bg-surface/60";
  }
}

function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border ${statusStyles(status)}`}
    >
      {status}
    </span>
  );
}

function TechPills({ technologies, limit = 4 }) {
  const shown = technologies.slice(0, limit);
  const rest = technologies.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((tech) => (
        <span
          key={tech}
          className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface/80 text-muted"
        >
          {tech}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-[11px] px-2 py-0.5 text-muted">+{rest}</span>
      )}
    </div>
  );
}

function Projects() {
  const projects = data.projects;
  const labIntro = data.editorial?.lab?.intro;
  const [featured, ...rest] = projects;
  const [selectedProject, setSelectedProject] = useState(null);
  const [clickCoords, setClickCoords] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  const handleCardClick = (e, project) => {
    setClickCoords({ x: e.clientX, y: e.clientY });
    setSelectedProject(project);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setSelectedProject(null);
  };

  useEffect(() => {
    const handleOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const openProject = (e, project) => handleCardClick(e, project);

  return (
    <div id="projects" className="relative max-w-[1100px] mx-auto px-4 pb-24 scroll-mt-24">
      <SplitChapter
        eyebrow="Builds hall of fame"
        line1="IN"
        line2="THE LAB"
        subtitle="Agents, generative products, and automation—experiments that became real launches."
      />

      {labIntro && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-muted text-sm sm:text-base max-w-2xl mx-auto -mt-6 mb-10 leading-relaxed px-2"
        >
          {labIntro}
        </motion.p>
      )}

      {featured && (
        <motion.article
          data-perch
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="glass-panel overflow-hidden mb-8 cursor-pointer group"
          onClick={(e) => openProject(e, featured)}
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-56 sm:h-64 md:h-full min-h-[220px] overflow-hidden">
              <img
                src={projectImageSrc(featured.image)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-bg/30 md:to-bg/80" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="eyebrow !mb-0 !text-[10px]">Featured build</span>
                <StatusBadge status={featured.status || "Live"} />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-text mb-2">
                {featured.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-4">
                {projectTagline(featured)}
              </p>
              <TechPills technologies={featured.technologies} limit={5} />
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-3 transition-all">
                Open case study
                <HiOutlineArrowRight size={16} />
              </p>
            </div>
          </div>
        </motion.article>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rest.map((project, i) => (
          <motion.article
            key={project.title}
            data-perch
            className={`glass-panel overflow-hidden cursor-pointer group flex flex-col ${
              i === 0 ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-0" : ""
            }`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={(e) => openProject(e, project)}
          >
            <div
              className={`relative overflow-hidden shrink-0 ${
                i === 0 ? "h-52 md:h-full min-h-[200px]" : "h-44"
              }`}
            >
              <TiltCard className="relative w-full h-full">
                <img
                  src={projectImageSrc(project.image)}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent opacity-80" />
              </TiltCard>
            </div>
            <div className={`p-5 flex flex-col flex-1 ${i === 0 ? "md:justify-center md:p-7" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <StatusBadge status={project.status} />
              </div>
              <h3 className="font-display font-semibold text-lg text-text mb-1.5">
                {project.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3 flex-1">
                {projectTagline(project)}
              </p>
              <TechPills technologies={project.technologies} limit={3} />
              <span className="mt-3 text-xs font-semibold text-accent/90 uppercase tracking-wide">
                Case study →
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              id="modal"
              className="fixed inset-0 flex items-center justify-center z-50 px-4 py-8"
              initial={{
                opacity: 0,
                scale: 0.3,
                x: clickCoords.x - window.innerWidth / 2,
                y: clickCoords.y - window.innerHeight / 2,
              }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.3,
                x: clickCoords.x - window.innerWidth / 2,
                y: clickCoords.y - window.innerHeight / 2,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 15, duration: 0.5 }}
            >
              <motion.div
                ref={modalRef}
                className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto glass-panel bg-surface/95 border-border-bright"
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close project details"
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <HiOutlineX size={18} />
                </button>
                <img
                  src={projectImageSrc(selectedProject.image)}
                  alt=""
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <StatusBadge status={selectedProject.status} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 text-gradient">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm mb-6 text-muted leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted mb-2">Stack</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-surface border border-border text-accent text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {selectedProject.url && (
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline-cosmic text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit live build
                      <HiOutlineExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;
