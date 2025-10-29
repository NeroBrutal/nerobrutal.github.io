/* eslint-disable react/prop-types */
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TechnologyItem = ({ name, imageSrc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex items-center mb-4"
  >
    <img src={imageSrc} alt={`${name} Logo`} className="h-8 w-8 mr-2" />
    <span>{name}</span>
  </motion.div>
);

const Technologies = () => {
  const technologiesData = [
    {
      category: "Client Side",
      technologies: [
        {
          name: "HTML",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        },
        {
          name: "CSS",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        },
        {
          name: "JavaScript",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        },
        {
          name: "React",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg",
        },
        {
          name: "Bootstrap",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
        },
        {
          name: "Tailwind",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original-wordmark.svg",
        },
      ],
    },
    {
      category: "Server Side",
      technologies: [
        {
          name: "PHP",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        },
        {
          name: "ASP.NET",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg",
        },
        {
          name: "Node.js",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        },
        {
          name: "Express JS",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
        },
      ],
    },
    {
      category: "Database",
      technologies: [
        {
          name: "SQL",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        },
        {
          name: "NoSQL",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
        },
      ],
    },
    {
      category: "Project Control",
      technologies: [
        {
          name: "Github",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        },
        {
          name: "HEROKU",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg",
        },
      ],
    },
    {
      category: "Graphics",
      technologies: [
        {
          name: "Figma",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        },
        {
          name: "Maya",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maya/maya-original.svg",
        },
      ],
    },
    {
      category: "Programming Languages",
      technologies: [
        {
          name: "Java",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg",
        },
        {
          name: "C",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
        },
        {
          name: "C++",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        },
        {
          name: "Python",
          imageSrc:
            "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg",
        },
      ],
    },
  ];
  const controls = useAnimation();
  const sectionRef = useRef();
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY + window.innerHeight >= sectionRef.current.offsetTop) {
        setIsInView(true);
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [controls]);

  return (
    <div id="technologies" className="max-w-3xl mx-auto py-16">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        Technologies 🚀
      </h1>

      <div
        ref={sectionRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-12 justify-center pb-8 pl-5 pr-5"
      >
        {technologiesData.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : controls}
            transition={{ duration: 1, delay: index * 0.5 }}
          >
            <h2 className="text-lg font-semibold mb-4">{category.category}</h2>
            {category.technologies.map((tech, techIndex) => (
              <TechnologyItem key={techIndex} {...tech} />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Technologies;
