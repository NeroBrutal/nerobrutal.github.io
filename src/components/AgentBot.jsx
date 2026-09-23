"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi";
import { buildSystemPrompt } from "../lib/agentContext";
import RobotMascot from "./RobotMascot";
import PeekingRobot from "./PeekingRobot";
import data from "../data/data.json";

// Swap this for a free-tier model (e.g. "meta-llama/llama-3.1-8b-instruct:free")
// if you'd rather trade answer quality for zero per-token cost.
const MODEL = "openai/gpt-4o-mini";
const MAX_MESSAGES_PER_SESSION = 24;
const API_KEY = import.meta.env.PUBLIC_OPENROUTER_API_KEY;

const STARTER_PROMPTS = [
  "What does he do?",
  "What's he built recently?",
  "How can I hire him?",
];

// Which side of the screen he rests on per section — alternating sides means
// he visibly walks across the page as a visitor scrolls through it.
const SECTION_SIDE = {
  main: "right",
  education: "left",
  work_experience: "right",
  technologies: "left",
  projects: "right",
  contact: "left",
};
const MASCOT_MARGIN = 24; // px, matches bottom-6/right-6
const MASCOT_WIDTH = 56; // px, matches w-14

function computeWalkX(side) {
  if (side === "right" || typeof window === "undefined") return 0;
  const currentLeft = window.innerWidth - MASCOT_MARGIN - MASCOT_WIDTH;
  return MASCOT_MARGIN - currentLeft;
}

export default function AgentBot() {
  const [open, setOpen] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [dismissedPeek, setDismissedPeek] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [side, setSide] = useState("right");
  const [walkX, setWalkX] = useState(0);
  const [walking, setWalking] = useState(false);
  const listRef = useRef(null);

  // One-time "peek" nudge the first time a visitor scrolls past the hero.
  useEffect(() => {
    const target = document.querySelector("#work");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !dismissedPeek) {
          setShowPeek(true);
          setDismissedPeek(true);
          observer.disconnect();
          // matches PeekingRobot's own 5s slide-in/out cycle
          setTimeout(() => setShowPeek(false), 5200);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [dismissedPeek]);

  // Track which section is in view and walk him to that section's side.
  useEffect(() => {
    const sections = Object.keys(SECTION_SIDE)
      .map((id) => document.querySelector(`#${id}`))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't relocate him mid-conversation — that'd yank the chat
        // panel around while someone's typing.
        if (open) return;
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) {
          const nextSide = SECTION_SIDE[mostVisible.target.id];
          if (nextSide) setSide(nextSide);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    setWalkX(computeWalkX(side));
    const onResize = () => setWalkX(computeWalkX(side));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [side]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  const openChat = () => {
    setOpen(true);
    setShowPeek(false);
    setDismissedPeek(true);
  };

  const send = async (text) => {
    const question = text.trim();
    if (!question || loading) return;
    if (messages.length >= MAX_MESSAGES_PER_SESSION) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "We've hit this session's message limit — refresh the page to keep chatting, or use the contact form below for anything more.",
        },
      ]);
      return;
    }

    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    if (!API_KEY) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm not wired up yet — my owner still needs to add an OpenRouter API key. Try the contact form in the meantime!",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "https://rashidh.com",
          "X-Title": `${data.name} Portfolio Agent`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...nextMessages,
          ],
        }),
      });

      if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
      const data_ = await res.json();
      const reply =
        data_.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I couldn't come up with an answer to that.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Something went wrong reaching my brain just now — mind trying again in a moment?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* One-time dramatic entrance: a big robot slides in from the edge,
          grips the border, and peeks in at the page. */}
      <AnimatePresence>
        {showPeek && !open && <PeekingRobot onOpen={openChat} />}
      </AnimatePresence>

      {/* Floating mascot — anchored bottom-right, walks left/right via translateX */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          className="flex flex-col items-end gap-3"
          animate={{ x: walkX }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          onAnimationStart={() => setWalking(true)}
          onAnimationComplete={() => setWalking(false)}
        >
          <button
            onClick={openChat}
            aria-label="Open AI assistant"
            className="relative w-14 h-[88px]"
          >
            <motion.div
              className="relative w-full h-full"
              style={{ scaleX: side === "left" ? -1 : 1 }}
              animate={walking ? { y: [0, -4, 0, -4, 0] } : { y: [0, -6, 0] }}
              transition={
                walking
                  ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="absolute inset-x-0 -inset-y-2 rounded-full bg-accent/20 blur-xl" />
              <RobotMascot walking={walking} />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className={`fixed bottom-0 sm:bottom-24 z-[101] w-full sm:w-[380px] h-[80vh] sm:h-[560px] max-h-[80vh] glass-panel bg-surface/95 border-border-bright rounded-b-none sm:rounded-b-2xl flex flex-col overflow-hidden ${
                side === "left" ? "left-0 sm:left-6" : "right-0 sm:right-6"
              }`}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div>
                  <p className="text-sm font-display font-semibold text-text">
                    Ask about {data.name.split(" ")[0]}
                  </p>
                  <p className="text-xs text-muted">
                    AI agent · answers from his real profile
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-accent hover:bg-white/5 transition-colors"
                >
                  <HiOutlineX size={16} />
                </button>
              </div>

              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              >
                {messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted mb-3">
                      Try one of these, or ask your own question:
                    </p>
                    {STARTER_PROMPTS.map((p) => (
                      <button
                        key={p}
                        onClick={() => send(p)}
                        className="block w-full text-left text-sm glass-pill px-3 py-2 text-text hover:border-accent/50 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-accent/15 text-text"
                          : "bg-white/5 text-text/90"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 rounded-xl px-3.5 py-2.5 flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-accent"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: d * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2 p-3 border-t border-border"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-accent/60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="w-10 h-10 shrink-0 rounded-lg bg-accent text-bg flex items-center justify-center disabled:opacity-40 transition-opacity"
                >
                  <HiOutlinePaperAirplane className="rotate-90" size={16} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
