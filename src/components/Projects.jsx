/* eslint-disable react/no-unescaped-entities */
import  "react";
import ProjectItem from "./ProjectItem";
import EveryMove from "../assets/EveryMove.png";
import RestApi from "../assets/RestApi.png";
import Portfolio from "../assets/Portfolio.png";
import Loading from "../assets/Loading.png";
import Tomato from "../assets/Tomato.png";
import Dresses from "../assets/Dresses.png";

function Projects() {
  return (
    <div id="projects" className="max-w-[1040px] m-auto md:pl-20 p-2">
      <h1 className="text-4xl font-bold text-center text-blue-400">
        Projects 🚀
      </h1>
      <p className="text-center py-8">
        Welcome to my Project Page! Here, I'm excited to showcase a collection
        of hands-on projects that encapsulate my journey in the world of
        Computer Science and Software Engineering. These projects reflect my
        passion for problem-solving, creativity, and innovation. Each endeavor
        represents a blend of technical skills, critical thinking, and the drive
        to create meaningful solutions. Explore these projects to get a glimpse
        of my journey and the impact I aspire to make in the realm of
        technology. 🌐💻
      </p>
      <div className="grid sm:grid-cols-2 gap-12">
        <ProjectItem
          img={EveryMove}
          title="Android Fitness App"
          Usage="Android Studio/Java"
        />
        <ProjectItem
          img={Loading}
          title="Stand Alone Java App"
          Usage="Java with Netbeans IDE"
        />
        <ProjectItem
          img={RestApi}
          title="Rest API"
          Usage="Node.js HTML/CSS"
        />
        <ProjectItem
          img={Portfolio}
          title="My Portfolio"
          Usage="React/Tailwind CSS"
        />
        <ProjectItem
          img={Dresses}
          title="Dresses E-commerce"
          Usage="MERN Stack"
        />
        <ProjectItem
          img={Tomato}
          title="Tomato Mystery Challenge"
          Usage="MERN Stack"
          src="https://nerobrutal.github.io/tomato-mystery-challenge/"
        />
      </div>
    </div>
  );
}

export default Projects;
