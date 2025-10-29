/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const ProjectItem = ({ img, title, Usage }) => {
  return (
    <motion.div
      className="relative flex items-center justify-center h-auto w-full shadow-xl shadow-gray-400 rounded-xl group hover:bg-gradient-to-r from-gray-200 to-blue-200"
      whileHover={{ y: -10 }}
    >
      <img src={img} alt="/" className="rounded-xl group-hover:opacity-10" />
      <div className="hidden group-hover:block absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h3 className="text-2xl font-bold text-blue-500 tracking-wider text-center">
          {title}
        </h3>
        <p className="pb-4 pt-2 text-blue-500 text-center">{Usage}</p>
        <a href="https://github.com/NeroBrutal?tab=repositories">
          <p className="text-center p-3 rounded-ld bg-white text-blue-500 font-bold cursor-pointer text-lg">
            More info
          </p>
        </a>
      </div>
    </motion.div>
  );
};

export default ProjectItem;
