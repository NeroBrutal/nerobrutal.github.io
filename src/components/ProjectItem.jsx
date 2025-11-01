/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const ProjectItem = ({ img, title, Usage }) => {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      {/* Full image */}
      <motion.img
        src={img}
        alt={title}
        className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Text overlay */}
      <div className="absolute bottom-6 left-6 text-white">
        <p className="text-xs opacity-80 mb-1">{Usage}</p>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
    </motion.div>
  );
};

export default ProjectItem;
