import { useEffect, useState } from "react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "light" ? "#f7f8fa" : "#05060a");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing can block storage; the theme still applies for this visit.
    }
    setTheme(next);
  };

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="glass-pill w-9 h-9 flex items-center justify-center text-muted hover:text-text hover:border-accent/40 transition-colors"
    >
      {theme === "light" ? <HiOutlineMoon size={16} /> : <HiOutlineSun size={16} />}
    </button>
  );
};

export default ThemeToggle;
