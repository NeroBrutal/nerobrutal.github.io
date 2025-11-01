/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  AiOutlineMenu,
  AiOutlineHome,
  AiOutlineProject,
  AiOutlineMail,
} from "react-icons/ai";
import { GrProjects } from "react-icons/gr";
import { BsPerson } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AppsIcon from "@mui/icons-material/Apps";

const Sidenav = () => {
  const [nav, setNav] = useState(false);
  const handleNav = () => {
    setNav(!nav);
  };
  return (
    <div>
      <AiOutlineMenu
        onClick={handleNav}
        className="absolute top-4 right-4 z-[99] md:hidden"
      />
      {nav ? (
        <div className="fixed w-full h-screen bg-blue-100 flex flex-col justify-center items-center z-20">
          <a
            onClick={handleNav}
            href="#main"
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            {/* <AiOutlineHome size={20} /> */}
            <EngineeringIcon size={20} />
            <span className="pl-4">Home</span>
          </a>
          <a
            onClick={handleNav}
            href="#work"
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            {/* <GrProjects size={20} /> */}
            <AppsIcon size={20} />
            <span className="pl-4">Work</span>
          </a>
          <a
            onClick={handleNav}
            href="#technologies" // Add the href for Technologies
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            <BiCodeAlt size={20} /> {/* Use the new icon */}
            <span className="pl-4">Technologies</span>
          </a>
          <a
            onClick={handleNav}
            href="#projects"
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            <AiOutlineProject size={20} />
            <span className="pl-3">Projects</span>
          </a>
          <a
            onClick={handleNav}
            href="https://drive.google.com/file/d/1MqwLGnLaUDohIegpI6AleBdI8IWqXUYe/view?usp=sharing"
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            <BsPerson size={20} />
            <span className="pl-4">Resume</span>
          </a>
          <a
            onClick={handleNav}
            href="#contact"
            className="w-[75%] flex justify-center items-center rounded-full shadow-lg bg-blue-200 shadow-gray-400 m-3 p-4 cursor-pointer hover:scale-110 ease-in duration-200"
          >
            <AiOutlineMail size={20} />
            <span className="pl-4">Contact</span>
          </a>
        </div>
      ) : (
        ""
      )}

      <div className="md:block hidden fixed top-[25%] z-10">
        <div className="flex flex-col">
          <a
            href="#main"
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
          >
            {/* <AiOutlineHome size={20} /> */}
            <EngineeringIcon size={20} />
          </a>
          <a
            href="#work"
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
          >
            {/* <GrProjects size={20} /> */}
            <AppsIcon size={20} />
          </a>
          <a
            href="#technologies" // Add the href for Technologies
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300 "
          >
            <BiCodeAlt size={20} /> {/* Use the new icon */}
          </a>
          <a
            href="#projects"
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
          >
            <AiOutlineProject size={20} />
          </a>
          <a
            href="https://drive.google.com/file/d/1HWcRpKXmnTnul3fu6iiMOM8DD9tNzGBG/view?usp=sharing"
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
          >
            <BsPerson size={20} />
          </a>
          <a
            href="#contact"
            className="rounded-full shadow-lg bg-blue-200 shadow-gray-500 m-2 p-4 cursor-pointer hover:scale-110 ease-in duration-300"
          >
            <AiOutlineMail size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
