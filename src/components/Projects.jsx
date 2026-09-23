import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { HiOutlineX } from "react-icons/hi";
import data from "../data/data.json";
import TiltCard from "./TiltCard";
import SplitChapter from "./SplitChapter";

function Projects() {
  const projects = data.projects;
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

  return (
    <div id="projects" className="relative max-w-[1100px] mx-auto px-4 pb-24">
      <SplitChapter
        eyebrow="Builds hall of fame"
        line1="IN"
        line2="THE LAB"
        subtitle="Agents, generative products, and automation—experiments that became real launches."
      />

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
        {projects.map((project, i) => (
          <motion.div
            key={i}
            data-perch
            className={`relative rounded-[29px] p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-transparent cursor-pointer group ${
              i === 0 ? "md:col-span-2 md:row-span-2" : ""
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={(e) => handleCardClick(e, project)}
          >
            <TiltCard className="relative w-full h-full rounded-[28px] overflow-hidden">
              <motion.img
                src={project.image.replace("../assets/", "/src/assets/")}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent/10" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-wide text-accent/90 mb-1">
                  {project.technologies[0]}
                </p>
                <h2
                  className={`font-display font-semibold ${
                    i === 0 ? "text-xl md:text-2xl" : "text-lg"
                  }`}
                >
                  {project.title}
                </h2>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
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
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
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
                <motion.img
                  src={selectedProject.image.replace("../assets/", "/src/assets/")}
                  alt={selectedProject.title}
                  className="w-full h-72 object-cover"
                />
                <div className="p-8">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 text-gradient">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm mb-6 text-muted leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-surface border border-border text-accent text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
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
