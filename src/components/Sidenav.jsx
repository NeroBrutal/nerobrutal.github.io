/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../data/data.json";

// Import all possible icons you’ll use
import { AiOutlineMail, AiOutlineProject } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AppsIcon from "@mui/icons-material/Apps";

// Icon map so we can reference icons by name from JSON
const iconMap = {
  AiOutlineMail,
  AiOutlineProject,
  BsPerson,
  BiCodeAlt,
  EngineeringIcon,
  AppsIcon,
};
//make this black
const inactiveColor = "#000000"; // black
const activeColor = "#3b82f6"; // blue-400
const inactiveBoarderColor = "#e5e7eb"; // gray-200
const activeBoarderColor = "#3b82f6"; // blue-400

const Sidenav = () => {
  const [nav, setNav] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const navbarItems = data.navbar;

  const handleNav = () => setNav(!nav);

  return (
    <div>
      {/* Mobile Menu Button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-[99] md:hidden cursor-pointer"
          onClick={handleNav}
        >
          <motion.div
            animate={{ rotate: nav ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <AppsIcon style={{ color: inactiveColor }} fontSize="large" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {nav && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed w-full h-screen bg-white flex flex-col justify-center items-center z-20"
          >
            {navbarItems.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.a
                  key={index}
                  href={item.href}
                  onClick={() => {
                    setActiveIndex(index);
                    handleNav();
                  }}
                  className={`w-[75%] flex justify-center items-center rounded-xl m-3 p-4 cursor-pointer ${
                    activeIndex === index ? "bg-blue-100" : "bg-transparent"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: "#f5f3f0",
                    transition: { duration: 0.3 },
                  }}
                >
                  {Icon && (
                    <motion.div
                      initial={{ color: inactiveColor }}
                      animate={{
                        color:
                          activeIndex === index ? activeColor : inactiveColor,
                      }}
                      whileHover={{
                        color: activeColor,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <Icon size={22} />
                    </motion.div>
                  )}
                  <span
                    className="pl-4 font-semibold"
                    style={{
                      color: activeIndex === index ? activeColor : "#1f2937",
                    }}
                  >
                    {item.name}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Side Navigation */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex flex-col fixed top-[32%] left-4 transform -translate-y-[40%] z-10 bg-transparent"
      >
        {navbarItems.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.a
              key={index}
              href={item.href}
              onClick={() => setActiveIndex(index)}
              className={`rounded-xl m-2 p-3 cursor-pointer flex justify-center items-center ${
                activeIndex === index ? "bg-blue-100" : "bg-transparent"
              }`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "#f5f3f0",
                transition: { duration: 0.3 },
              }}
            >
              {Icon && (
                <motion.div
                  initial={{ color: inactiveColor }}
                  animate={{
                    color: activeIndex === index ? activeColor : inactiveColor,
                  }}
                  whileHover={{
                    color: activeColor,
                    scale: 1.1,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Icon size={24} />
                </motion.div>
              )}
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Sidenav;
