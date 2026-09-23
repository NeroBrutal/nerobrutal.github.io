"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineArrowRight,
  HiOutlineExternalLink,
} from "react-icons/hi";
import data from "../data/data.json";

const isExternal = (href) => !href.startsWith("#");

const go = (href) => {
  if (isExternal(href)) {
    window.open(href, "_blank", "noopener,noreferrer");
  } else {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
};

function buildItems() {
  const navigate = data.navbar.map((item) => ({
    id: `nav-${item.name}`,
    group: "Navigate",
    label: item.name,
    hint: isExternal(item.href) ? "Opens in a new tab" : null,
    external: isExternal(item.href),
    action: () => go(item.href),
  }));

  const projects = data.projects.map((project) => ({
    id: `project-${project.title}`,
    group: "Projects",
    label: project.title,
    hint: project.technologies.slice(0, 2).join(" · "),
    action: () => go("#projects"),
  }));

  const connect = Object.entries(data.socialLinks).map(([key, url]) => ({
    id: `social-${key}`,
    group: "Connect",
    label: `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    hint: "Opens in a new tab",
    external: true,
    action: () => go(url),
  }));

  return [...navigate, ...projects, ...connect];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const items = useMemo(() => buildItems(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const select = (i) => {
    if (!i) return;
    i.action();
    close();
  };

  useEffect(() => {
    const onKeydown = (e) => {
      const isCombo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCombo) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    const onToggleEvent = () => setOpen((o) => !o);

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("toggle-command-palette", onToggleEvent);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("toggle-command-palette", onToggleEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleListKeydown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(filtered[activeIndex]);
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          />
          <motion.div
            className="fixed left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-lg z-[111] glass-panel bg-surface/95 border-border-bright overflow-hidden"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <HiOutlineSearch className="text-muted shrink-0" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleListKeydown}
                placeholder="Jump to a section, project, or profile…"
                className="w-full bg-transparent text-sm text-text placeholder:text-muted outline-none"
              />
              <kbd className="hidden sm:inline-block text-[10px] text-muted border border-border rounded px-1.5 py-0.5">
                Esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted text-center">
                  No matches for "{query}"
                </p>
              )}
              {filtered.map((i, idx) => {
                const showGroup = i.group !== lastGroup;
                lastGroup = i.group;
                return (
                  <div key={i.id}>
                    {showGroup && (
                      <p className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-muted">
                        {i.group}
                      </p>
                    )}
                    <button
                      onClick={() => select(i)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left border-l-2 transition-colors ${
                        idx === activeIndex
                          ? "border-accent bg-accent/5 text-text"
                          : "border-transparent text-text/90 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {i.label}
                        </span>
                        {i.hint && (
                          <span className="text-xs text-muted truncate">
                            {i.hint}
                          </span>
                        )}
                      </span>
                      {i.external ? (
                        <HiOutlineExternalLink
                          className="text-muted shrink-0"
                          size={14}
                        />
                      ) : (
                        <HiOutlineArrowRight
                          className={`shrink-0 transition-colors ${
                            idx === activeIndex ? "text-accent" : "text-muted"
                          }`}
                          size={14}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
