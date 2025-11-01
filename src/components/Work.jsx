/* eslint-disable react/no-unescaped-entities */
import "react";
import { motion } from "framer-motion";
import data from "../data/data.json";

const Work = () => {
  const aboutMe = data.about_me;
  const sections = data.sections;
  const languages = data.programming_languages;

  const getLogo = (fileName) =>
    new URL(`../assets/${fileName}`, import.meta.url).href;

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate =
      end.toLowerCase() === "present" ? new Date() : new Date(end);
    const diffInMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    let durationStr = "";
    if (years > 0) {
      durationStr += `${years} year${years > 1 ? "s" : ""} `;
    }
    if (months > 0) {
      durationStr += `${months} month${months > 1 ? "s" : ""}`;
    }

    return durationStr.trim();
  };

  return (
    <div id="work" className="max-w-screen-lg m-auto md:pl-20 p-2 py-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center text-blue-400 py-4">
          About Me 🚀
        </h1>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center py-6">{aboutMe}</p>
      </motion.p>
      {/* Programming language icons */}
      <div className="flex justify-center flex-wrap gap-3 md:px-7">
        {languages.map((lang, index) => (
          <img
            key={index}
            src={lang.icon}
            alt={lang.name}
            title={lang.name}
            className="h-12 w-12 md:h-14 md:w-14 object-contain"
          />
        ))}
      </div>
      {/* Dynamic Sections */}
      {Object.entries(sections).map(([key, section]) => (
        <div key={key}>
          <h3 className="text-2xl font-bold text-left text-blue-400 pb-7 pt-10">
            {section.title}
          </h3>

          {section.items.map((item, index) => (
            <motion.div
              key={index}
              className="mb-8 flex flex-col md:flex-row items-start border-b pb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.logo && (
                <motion.img
                  src={getLogo(item.logo)}
                  alt={item.title}
                  className="w-20 h-20 object-contain mb-4 md:mb-0 md:mr-6 border-2 border-gray-300 rounded-md p-1 shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              )}

              <div>
                <motion.h4
                  className="text-xl font-semibold text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {item.title}
                </motion.h4>

                <motion.p
                  className="text-gray-500 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {item.year} •{" "}
                  {calculateDuration(item.startDate, item.endDate)}
                </motion.p>

                {item.summary && (
                  <motion.p
                    className="mt-2 text-gray-700"
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {item.summary}
                  </motion.p>
                )}

                {Array.isArray(item.details) && (
                  <ul className="list-disc list-inside mt-3 space-y-2">
                    {item.details.map((point, i) => (
                      <motion.li
                        key={i}
                        className="text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      >
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Work;
