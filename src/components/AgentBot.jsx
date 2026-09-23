"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi";
import { buildSystemPrompt } from "../lib/agentContext";
import {
  getMascotPosition,
  patrolNudge,
  travelDistance,
  SECTION_ANCHORS,
} from "../lib/mascotRoaming";
import {
  STUNTS,
  partMotion,
  pickArrivalStunt,
  pickIdleStunt,
} from "../lib/mascotStunts";
import RobotMascot from "./RobotMascot";
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

const AIR_REST = { x: 0, y: 0, rotate: 0 };
const SQUASH_REST = { scaleX: 1, scaleY: 1 };

function travelDurationMs(distance) {
  return Math.min(2200, Math.max(850, distance * 2.4));
}

// Stunts end on a full turn (-360°); snapping back to 0 is visually identical,
// so the rest transition must be instant or he'd unwind the flip in reverse.
function airMotion(stunt) {
  const m = partMotion(stunt, "air", AIR_REST);
  return stunt ? m : { animate: AIR_REST, transition: { duration: 0 } };
}

// The shadow stays on the ground but follows sideways travel (cartwheel, dance).
function shadowMotion(stunt) {
  const def = stunt && STUNTS[stunt];
  if (!def) {
    return { animate: { scale: 1, opacity: 0.5, x: 0 }, transition: { duration: 0.25 } };
  }
  return {
    animate: { scale: 1, opacity: 0.5, ...def.shadow, x: def.air?.x ?? 0 },
    transition: { duration: def.duration, times: def.times, ease: "easeInOut" },
  };
}

export default function AgentBot() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState(() => getMascotPosition("main"));
  const [edge, setEdge] = useState("right");
  const [sectionId, setSectionId] = useState("main");
  const [walking, setWalking] = useState(false);
  const [stunt, setStunt] = useState(null);
  const [moveMs, setMoveMs] = useState(1200);
  const listRef = useRef(null);
  const posRef = useRef(pos);
  const sectionRef = useRef(sectionId);
  const openRef = useRef(open);
  const walkingRef = useRef(walking);
  const stuntRef = useRef(stunt);
  const pendingStuntRef = useRef(null);

  posRef.current = pos;
  sectionRef.current = sectionId;
  openRef.current = open;
  walkingRef.current = walking;
  stuntRef.current = stunt;

  const playStunt = (id) => {
    if (reduceMotion || !id || stuntRef.current) return;
    setStunt(id);
  };

  const goTo = (nextSection, nextPos, options = {}) => {
    const dist = travelDistance(posRef.current, nextPos);
    setSectionId(nextSection);
    setEdge(nextPos.edge);
    if (dist < 1) return;
    setStunt(null);
    pendingStuntRef.current =
      options.stunt === false ? null : pickArrivalStunt(dist, nextPos.y);
    setMoveMs(options.durationMs ?? travelDurationMs(dist));
    setWalking(true);
    setPos({ x: nextPos.x, y: nextPos.y });
  };

  const finishMove = () => {
    setWalking(false);
    const pending = pendingStuntRef.current;
    pendingStuntRef.current = null;
    if (pending) playStunt(pending);
  };

  useEffect(() => {
    if (!stunt) return;
    const t = setTimeout(() => setStunt(null), STUNTS[stunt].duration * 1000 + 60);
    return () => clearTimeout(t);
  }, [stunt]);

  // Roam to whichever section is most visible while you scroll.
  useEffect(() => {
    const sections = Object.keys(SECTION_ANCHORS)
      .map((id) => document.querySelector(`#${id}`))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        if (openRef.current) return;
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const id = mostVisible.target.id;
        if (!SECTION_ANCHORS[id] || id === sectionRef.current) return;
        goTo(id, getMascotPosition(id));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo is stable helpers + refs
  }, []);

  // Keep anchors aligned on resize.
  useEffect(() => {
    const onResize = () => {
      const next = getMascotPosition(sectionRef.current);
      setPos({ x: next.x, y: next.y });
      setEdge(next.edge);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Idle routine — every few seconds either show off a stunt or wander a bit.
  useEffect(() => {
    if (reduceMotion || open) return;
    let timer;
    const tick = () => {
      timer = setTimeout(() => {
        if (!openRef.current && !walkingRef.current && !stuntRef.current) {
          if (Math.random() < 0.65) {
            playStunt(pickIdleStunt(posRef.current.y));
          } else {
            goTo(sectionRef.current, patrolNudge(sectionRef.current), {
              durationMs: 900,
              stunt: false,
            });
          }
        }
        tick();
      }, 6000 + Math.random() * 6000);
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduceMotion]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

  const openChat = () => setOpen(true);

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
      {/* Roaming mascot — scroll anchors + idle patrol stunts */}
      {!open && (
        <motion.div
          className="fixed left-0 top-0 z-50 pointer-events-none"
          animate={{ x: pos.x, y: pos.y }}
          transition={{ duration: moveMs / 1000, ease: "easeInOut" }}
          onAnimationComplete={finishMove}
        >
          <button
            onClick={openChat}
            onMouseEnter={() => {
              if (!walkingRef.current) playStunt("wave");
            }}
            aria-label="Open AI assistant"
            className="relative w-14 h-[88px] pointer-events-auto"
          >
            <div
              className="relative w-full h-full"
              style={{ transform: edge === "left" ? "scaleX(-1)" : undefined }}
            >
              <motion.span
                className="absolute left-1/2 -bottom-1 -ml-5 h-2.5 w-10 rounded-full bg-black/70 blur-[3px]"
                {...shadowMotion(stunt)}
              />
              <motion.span
                className="absolute left-1/2 -bottom-1 -ml-7 h-4 w-14 rounded-full border-2 border-accent/50 blur-[1px]"
                initial={{ opacity: 0, scale: 0.4 }}
                {...partMotion(stunt, "dust", { opacity: 0, scale: 0.4 })}
              />
              <motion.div
                className="relative w-full h-full"
                animate={
                  stunt
                    ? { y: 0 }
                    : walking
                      ? { y: [0, -4, 0, -4, 0] }
                      : { y: [0, -6, 0] }
                }
                transition={
                  stunt
                    ? { duration: 0.2 }
                    : walking
                      ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                      : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }
              >
                <motion.div className="relative w-full h-full" {...airMotion(stunt)}>
                  <motion.div
                    className="relative w-full h-full"
                    style={{ originY: 1 }}
                    {...partMotion(stunt, "squash", SQUASH_REST)}
                  >
                    <span className="absolute inset-x-0 -inset-y-2 rounded-full bg-accent/20 blur-xl" />
                    <RobotMascot walking={walking} stunt={stunt} />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </button>
        </motion.div>
      )}

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
                edge === "left" ? "left-0 sm:left-6" : "right-0 sm:right-6"
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
