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

function Main() {
  return (
    <motion.div
      id="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <img className="w-full h-screen object-cover object-left scale-x-[-1] bg-blue-200" />
      <motion.div
        className="w-full h-screen absolute top-0 left-0 bg-white/30 flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-[700px] mx-auto">
          <motion.img
            className="w-58 h-96 rounded-full mx-auto mb-4"
            src={Profile}
            alt="Your Name"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.h1
            className="sm:text-5xl text-4xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {name}
          </motion.h1>
          <motion.h2
            className="flex text-center sm:text-3xl text-2xl pt-4 text-gray-800"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            I'm a
            <TypeAnimation
              sequence={[
                "Developer",
                2000,
                "Coder",
                2000,
                "Tech Enthusiast",
                2000,
              ]}
              wrapper="div"
              speed={50}
              style={{ fontSize: "1em", paddingLeft: "5px" }}
              repeat={Infinity}
            />
          </motion.h2>

          <motion.div
            className="flex justify-between pt-6 max-w-[200px] w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            {/* Social media links */}
            <a href="https://twitter.com/mohamed77068570?s=21&t=r7SL2Gkmuw5SNKNzGlVtkg">
              <FaTwitter className="cursor-pointer" size={20} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100008542111766&mibextid=LQQJ4d">
              <FaFacebookF className="cursor-pointer" size={20} />
            </a>
            <a href="https://instagram.com/___r.a.s.h.i.d.h___?igshid=MjEwN2IyYWYwYw==">
              <FaInstagram className="cursor-pointer" size={20} />
            </a>
            <a href="https://www.linkedin.com/in/mohamed-rashidh-bb948121b">
              <FaLinkedin className="cursor-pointer" size={20} />
            </a>
            <a href="https://github.com/NeroBrutal">
              <FaGithub className="cursor-pointer" size={20} />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Main;
