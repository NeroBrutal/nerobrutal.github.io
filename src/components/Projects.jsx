import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import data from "../data/data.json";

function Projects() {
  const projects = data.projects.slice(0, 4);
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
      // ✅ closes only if clicked outside the actual modal card
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
    <div id="projects" className="max-w-[1100px] mx-auto px-4 py-20">
      <motion.h1
        className="text-4xl font-bold text-center text-blue-400 mb-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Projects 🚀
      </motion.h1>

      {/* Apple-style asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[260px]">
        {/* Large Feature Card */}
        <motion.div
          className="md:col-span-2 md:row-span-2 relative rounded-[28px] overflow-hidden cursor-pointer group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => handleCardClick(e, projects[0])}
        >
          <motion.img
            src={projects[0].image.replace("../assets/", "/src/assets/")}
            alt={projects[0].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-sm opacity-80">{projects[0].technologies[0]}</p>
            <h2 className="text-xl md:text-2xl font-semibold">
              {projects[0].title}
            </h2>
          </div>
        </motion.div>

        {/* Smaller Cards */}
        {projects.slice(1, 3).map((project, i) => (
          <motion.div
            key={i}
            className="relative rounded-[28px] overflow-hidden cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => handleCardClick(e, project)}
          >
            <motion.img
              src={project.image.replace("../assets/", "/src/assets/")}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm opacity-80">{project.technologies[0]}</p>
              <h2 className="text-lg font-semibold">{project.title}</h2>
            </div>
          </motion.div>
        ))}

        {/* Wide Bottom Card */}
        <motion.div
          className="md:col-span-3 relative rounded-[28px] overflow-hidden cursor-pointer group"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => handleCardClick(e, projects[3])}
        >
          <motion.img
            src={projects[3].image.replace("../assets/", "/src/assets/")}
            alt={projects[3].title}
            className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-sm opacity-80">{projects[3].technologies[0]}</p>
            <h2 className="text-xl font-semibold">{projects[3].title}</h2>
          </div>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Modal */}
            <motion.div
              id="modal"
              ref={modalRef}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
              initial={{
                opacity: 0,
                scale: 0.3,
                x: clickCoords.x - window.innerWidth / 2,
                y: clickCoords.y - window.innerHeight / 2,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.3,
                x: clickCoords.x - window.innerWidth / 2,
                y: clickCoords.y - window.innerHeight / 2,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 15,
                duration: 0.5,
              }}
            >
              <motion.div className="max-w-2xl bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl">
                <motion.img
                  src={selectedProject.image.replace(
                    "../assets/",
                    "/src/assets/"
                  )}
                  alt={selectedProject.title}
                  className="w-full h-80 object-cover"
                />
                <motion.div className="p-8 text-gray-800 dark:text-gray-100">
                  <h2 className="text-3xl font-bold mb-3">
                    {selectedProject.title}
                  </h2>
                  <p className="text-sm mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-2 transition"
                    onClick={() => setSelectedProject(null)}
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;
