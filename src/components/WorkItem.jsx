/* eslint-disable react/prop-types */
import "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const WorkItem = ({ year, title, duration, details, alignLeft, schoolLogo }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });   

  const variants = {
    hidden: { opacity: 0, x: alignLeft ? -100 : 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex justify-center items-center mb-10">
      <motion.div
        ref={ref}
        className={`border-l-4 border-blue-200 p-4 rounded-md ${
          alignLeft ? "md:flex-row-reverse" : "md:flex-row"
        }`}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={variants}
        transition={{ duration: 2 }}
      >
        <div className="flex items-center">
          {schoolLogo && (
            <img src={schoolLogo} className="h-8 w-8 mr-2" alt="School Logo" />
          )}
          {year && (
            <span className="inline-block py-1 font-semibold text-white rounded-md">
              <span className="bg-blue-300 p-1 rounded-md">{year}</span>
            </span>
          )}
        </div>
        {duration && (
          <span className="ml-2 text-sm font-normal leading-none text-stone-400">
            {duration}
          </span>
        )}
        <h3 className="text-lg font-semibold text-blue-800 mb-2">{title}</h3>
        <p>{details}</p>
      </motion.div>
    </div>
  );
};

export default WorkItem;
