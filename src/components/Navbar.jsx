/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../data/data.json";

import { AiOutlineMail, AiOutlineProject, AiOutlineHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { BiCodeAlt } from "react-icons/bi";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineViewGrid,
  HiOutlineAcademicCap,
} from "react-icons/hi";
import { HiOutlineCommandLine, HiOutlineRocketLaunch } from "react-icons/hi2";

// EngineeringIcon / AppsIcon map to react-icons equivalents; the names come
// straight from data.json's navbar entries.
const iconMap = {
  AiOutlineMail,
  AiOutlineProject,
  BsPerson,
  BiCodeAlt,
  EngineeringIcon: AiOutlineHome,
  AppsIcon: HiOutlineViewGrid,
  AcademicCapIcon: HiOutlineAcademicCap,
  ProductionIcon: HiOutlineRocketLaunch,
};

const isExternal = (href) => !href.startsWith("#");

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [activeHref, setActiveHref] = useState("#main");
  const [scrolled, setScrolled] = useState(false);
  const navbarItems = data.navbar;

  const handleNav = () => setNav(!nav);
  const openPalette = () =>
    window.dispatchEvent(new Event("toggle-command-palette"));

  // Highlight whichever section is currently most in view.
  useEffect(() => {
    const sections = navbarItems
      .filter((item) => !isExternal(item.href))
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveHref(`#${mostVisible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navbarItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!nav) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [nav]);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-40 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300 ${
        scrolled || nav
          ? "bg-surface/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Mark */}
        <a
          href="#main"
          className="font-display font-bold text-sm tracking-wide text-text hover:text-accent transition-colors"
        >
          MR<span className="text-accent">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navbarItems.map((item, index) => {
            const active = activeHref === item.href;
            return (
              <a
                key={index}
                href={item.href}
                target={isExternal(item.href) ? "_blank" : undefined}
                rel={isExternal(item.href) ? "noopener noreferrer" : undefined}
                className="relative px-3 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-x-2 -bottom-[1px] h-[2px] bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={active ? "text-text" : ""}>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden md:flex items-center gap-2 glass-pill pl-3 pr-2 py-1.5 text-xs text-muted hover:border-accent/40 hover:text-text transition-colors"
          >
            <HiOutlineCommandLine size={14} />
            Search
            <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>

          <button
            aria-label={nav ? "Close menu" : "Open menu"}
            className="md:hidden glass-pill w-9 h-9 flex items-center justify-center text-text"
            onClick={handleNav}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={nav ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {nav ? <HiOutlineX size={18} /> : <HiOutlineMenu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {nav && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden w-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-surface/95 backdrop-blur-xl border-b border-border pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="px-4 py-3 flex flex-col gap-0.5 min-w-0">
              {navbarItems.map((item, index) => {
                const Icon = iconMap[item.icon];
                const active = activeHref === item.href;
                return (
                  <a
                    key={index}
                    href={item.href}
                    target={isExternal(item.href) ? "_blank" : undefined}
                    rel={
                      isExternal(item.href) ? "noopener noreferrer" : undefined
                    }
                    onClick={handleNav}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:bg-white/[0.04] hover:text-text"
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
