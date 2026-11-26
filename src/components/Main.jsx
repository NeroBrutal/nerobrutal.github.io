/* eslint-disable react/no-unescaped-entities */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineChevronDown, HiOutlineBuildingLibrary } from "react-icons/hi2";
import Profile from "../assets/profile.jpg";
import MagneticButton from "./MagneticButton";
import data from "../data/data.json";

const name = data.name;
const location = data.location;
const roles = data.roles;
const socialLinks = data.socialLinks;
const resumeHref = data.navbar.find((item) => item.name === "Resume")?.href;

const socials = [
  { Icon: FaGithub, href: socialLinks.github },
  { Icon: FaLinkedin, href: socialLinks.linkedin },
  { Icon: FaTwitter, href: socialLinks.twitter },
  { Icon: FaInstagram, href: socialLinks.instagram },
  { Icon: FaFacebookF, href: socialLinks.facebook },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const nameContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.45 } },
};

const letter = {
  hidden: { opacity: 0, y: 28, rotateX: -70 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

function Main() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const profileY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const profileScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const profileOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <motion.div
      id="main"
      ref={heroRef}
      className="relative isolate flex flex-col items-center justify-center min-h-screen text-center px-4 pt-28 pb-16"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Location + credibility badges */}
      <motion.div
        variants={item}
        className="flex flex-wrap items-center justify-center gap-3 mb-8"
      >
        <div className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm text-muted">
          <HiOutlineLocationMarker className="text-accent" />
          {location}
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-glow" />
          Open to new roles
        </div>
        <div className="glass-pill inline-flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm text-muted">
          <HiOutlineBuildingLibrary className="text-accent" />
          Production AI for government &amp; enterprise
        </div>
      </motion.div>

      {/* Profile photo — fades gently with scroll, no spinning chrome */}
      <motion.div
        variants={item}
        style={{ y: profileY, scale: profileScale, opacity: profileOpacity }}
        className="relative w-44 h-44 sm:w-48 sm:h-48 mb-8"
      >
        <div
          className="absolute -inset-4 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--color-accent-rgb) / 0.1), transparent 70%)",
          }}
        />
        <img
          className="relative w-full h-full rounded-full object-cover border-2 border-border"
          src={Profile.src}
          alt={name}
        />
      </motion.div>

      <motion.h1
        variants={item}
        className="text-4xl sm:text-6xl font-display font-bold mb-3"
      >
        <span className="text-text">{`Hi, I'm `}</span>
        <motion.span
          className="inline-block text-gradient"
          style={{ perspective: 500 }}
          variants={nameContainer}
          initial="hidden"
          animate="show"
          aria-label={name}
        >
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={letter}
              className="inline-block"
              style={{ transformStyle: "preserve-3d" }}
              aria-hidden="true"
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.span>
      </motion.h1>

      <motion.h2
        variants={item}
        className="text-xl sm:text-2xl text-muted mb-10 flex flex-wrap justify-center gap-x-2 font-medium"
      >
        <span>I'm a</span>
        <TypeAnimation
          sequence={roles.flatMap((role) => [`"${role}"`, 2000])}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          className="font-semibold text-gradient"
        />
      </motion.h2>

      <motion.div
        variants={item}
        className="flex flex-wrap items-center justify-center gap-4 mb-10"
      >
        <MagneticButton>
          <a href="#case-studies" className="btn-cosmic">
            View Case Studies
          </a>
        </MagneticButton>
        <MagneticButton>
          <a href="#ask-ai" className="btn-outline-cosmic">
            Ask My AI Agent
          </a>
        </MagneticButton>
        {resumeHref && (
          <MagneticButton>
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-cosmic"
            >
              Download Resume
            </a>
          </MagneticButton>
        )}
      </motion.div>

      <motion.div variants={item} className="flex justify-center gap-5">
        {socials.map(({ Icon, href }, i) => (
          <MagneticButton key={i} strength={0.5}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill w-11 h-11 flex items-center justify-center text-muted transition-all duration-300 hover:-translate-y-1 hover:text-accent"
            >
              <Icon size={18} />
            </a>
          </MagneticButton>
        ))}
      </motion.div>

      <motion.a
        href="#work"
        aria-label="Scroll to About Me"
        className="absolute bottom-6 text-muted hover:text-accent transition-colors animate-bounce-slow"
        variants={item}
      >
        <HiOutlineChevronDown size={28} />
      </motion.a>
    </motion.div>
  );
}

export default Main;
