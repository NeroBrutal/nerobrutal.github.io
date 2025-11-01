/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import Profile from "../assets/profile_new.png";
import data from "../data/data.json";
import MotionPath from "./MotionPath";

const name = data.name;
const location = data.location;
const roles = data.roles;
const socialLinks = data.socialLinks;

function Main() {
  return (
    <motion.div
      id="main"
      className="relative flex flex-col items-center justify-center min-h-screen bg-blue-200 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        className="w-60 h-60 rounded-full object-cover mb-6"
        src={Profile}
        alt={name}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <motion.h1
        className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {`Hi, I'm ${name}.`}
      </motion.h1>

      <motion.h2
        className="text-2xl sm:text-3xl text-gray-700 mb-6 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        I'm a&nbsp;
        <TypeAnimation
          sequence={[
            `"${roles[0]}"`,
            2000,
            `"${roles[1]}"`,
            2000,
            `"${roles[2]}"`,
            2000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="font-semibold text-gray-900"
        />
      </motion.h2>

      <motion.div
        className="flex justify-center gap-6 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <a href={socialLinks.twitter}>
          <FaTwitter
            size={22}
            className="hover:text-blue-500 transition-colors duration-200"
          />
        </a>
        <a href={socialLinks.facebook}>
          <FaFacebookF
            size={22}
            className="hover:text-blue-600 transition-colors duration-200"
          />
        </a>
        <a href={socialLinks.instagram}>
          <FaInstagram
            size={22}
            className="hover:text-pink-500 transition-colors duration-200"
          />
        </a>
        <a href={socialLinks.linkedin}>
          <FaLinkedin
            size={22}
            className="hover:text-blue-700 transition-colors duration-200"
          />
        </a>
        <a href={socialLinks.github}>
          <FaGithub
            size={22}
            className="hover:text-gray-700 transition-colors duration-200"
          />
        </a>
      </motion.div>
    </motion.div>
  );
}

export default Main;
