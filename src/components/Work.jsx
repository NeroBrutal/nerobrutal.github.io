/* eslint-disable react/no-unescaped-entities */
import "react";
import WorkItem from "./WorkItem";
import schoolLogo1 from "../assets/st.joseph.jpg";
import schoolLogo2 from "../assets/st.peters.png";
import univercitylogo from "../assets/SLIIT_Logo_.png";

const data = [
  {
    year: "2003-2014",
    title: "St. Joseph's College, Negombo",
    duration: "11 years",
    details:
      "From grade 1 to grade 11, I studied at St. Joseph's College, Negombo. I completed my scholarship and Ordinary Level exams at this school, gaining proficiency in various subjects and laying the foundation for further academic pursuits. 🎉",
    alignLeft: false,
    schoolLogo: schoolLogo1,
  },
  {
    year: "2015-2018",
    title: "St. Peter's College, Negombo",
    duration: "2 years",
    details:
      "Completed Advanced Level in Physical Science at St. Peter's College, Negombo, excelling in subjects like Combined Maths, Physics, and Chemistry. Developed a strong analytical and problem-solving mindset. 🧪🔢",
    alignLeft: false,
    schoolLogo: schoolLogo2,
  },
  {
    year: "2021-2024",
    title: "SLIIT City University",
    duration: "3 years ⌛",
    details:
      "Having completed a B.Sc. (Hons) in Computer Science & Software Engineering, offered in collaboration with SLIIT City University, I have honed my skills and knowledge across a diverse array of subjects. The curriculum included foundational programming, algorithms, databases, and software development methodologies, along with hands-on projects that provided practical experience in designing and implementing software solutions. My final year was marked by a significant Undergraduate Project, where I applied my accumulated knowledge to real-world challenges. Modules such as Social and Professional Project Management refined my teamwork and project leadership skills, while Research Methodologies fostered critical thinking and analytical abilities. The Comparative Integrated Systems course broadened my understanding of various technological approaches. This academic journey has equipped me with essential skills and insights, preparing me for a promising future in the dynamic fields of Computer Science and Software Engineering. I am eagerly awaiting my official graduation with First-Class Honors based on my results.",
    alignLeft: false,
    schoolLogo: univercitylogo,
  },
];

const Work = () => {
  return (
    <div id="work" className="max-w-screen-lg m-auto md:pl-20 p-2 py-16">
      <h1 className="text-4xl font-bold text-center text-blue-400 py-4">
        About Me 🚀
      </h1>
      <p className="text-center py-6">
        Welcome to my portfolio! Here, I showcase my educational journey,
        skills, and projects in Computer Science and Software Engineering.
        During my time at SLIIT City University, I've learned a lot about
        computer science and how to build software. I enjoy solving practical
        problems using technology and believe it can drive innovation in the
        real world. Take a look at my portfolio to see what I've achieved in my
        studies, the skills I've developed, and the projects I've worked on. If
        you have any questions or need more information, feel free to get in
        touch with me. 🌐💻
      </p>

      {/* Programming language icons */}
      <div className="flex justify-center md:pr-7 md:pl-7">
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
        <img
          src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original-wordmark.svg"
          className="h-12 md:h-18 w-8 md:w-8 pr-2"
        />
      </div>
      <h3 className="text-2xl font-bold text-left text-blue-400 pb-7 pt-5">
        Educational Journey
      </h3>

      {/* Render Work items */}
      {data.map((item, index) => (
        <WorkItem key={index} {...item} />
      ))}
    </div>
  );
};

export default Work;
