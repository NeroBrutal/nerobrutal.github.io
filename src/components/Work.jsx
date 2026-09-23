/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import data from "../data/data.json";
import TimelineItem from "./TimelineItem";

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
    <div id="work" className="relative max-w-screen-lg m-auto px-4 md:px-8 py-24">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <span className="eyebrow">🛰️ The journey so far</span>
        <h1 className="section-title">About Me</h1>
      </motion.div>

      {/* About me paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-6 sm:p-8 max-w-3xl mx-auto mt-8"
      >
        <p className="text-center text-muted leading-relaxed">{aboutMe}</p>
      </motion.div>

      {/* Scrolling Technology Icons */}
      <div className="overflow-hidden py-14 relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 22, repeat: Infinity }}
        >
          {[...languages, ...languages].map((lang, index) => (
            <div
              key={index}
              title={lang.name}
              className="glass-pill flex items-center justify-center h-16 w-16 md:h-20 md:w-20 shrink-0 p-3 transition-transform hover:scale-110"
            >
              <img
                src={lang.icon}
                alt={lang.name}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dynamic Sections as a constellation timeline */}
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} id={key} className="mt-16 scroll-mt-20">
          <motion.h3
            className="text-2xl sm:text-3xl font-bold font-display text-center mb-12 text-gradient"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {section.title}
          </motion.h3>

          <div className="relative">
            {/* Center line */}
            <span className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-gradient-to-b from-accent/50 to-transparent" />

            {section.items.map((item, index) => (
              <TimelineItem
                key={index}
                item={item}
                index={index}
                align={index % 2 === 0 ? "left" : "right"}
                logoSrc={item.logo ? getLogo(item.logo) : null}
                duration={calculateDuration(item.startDate, item.endDate)}
                subtitle={item.company}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Work;
