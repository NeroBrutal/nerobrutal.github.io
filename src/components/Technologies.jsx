"use client";
import { motion } from "framer-motion";
import data from "../data/data.json";

const Technologies = () => {
  const technologiesData = data.technologies.flatMap((cat) =>
    cat.technologies.map((tech) => ({
      name: tech.name,
      imageSrc: tech.imageSrc,
    }))
  );
  console.log(technologiesData);

  // Duplicate items to create an infinite seamless scroll
  const scrollingItems = [...technologiesData, ...technologiesData];

  return (
    <section
      id="technologies"
      className="py-20 bg-gray-900 text-white overflow-hidden"
    >
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-12">
        Technologies 🚀
      </h1>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 50, // adjust speed
          }}
        >
          {scrollingItems.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center min-w-[150px] rounded-lg p-4 bg-gray-800 hover:bg-gray-700 transition"
            >
              <img
                src={tech.imageSrc}
                alt={tech.name}
                className="h-12 w-12 mb-2 object-contain"
              />
              <span className="text-sm text-center">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Technologies;
