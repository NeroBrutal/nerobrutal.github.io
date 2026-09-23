"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi";
import {
  getMascotPosition,
  patrolNudge,
  travelDistance,
  SECTION_ANCHORS,
} from "../lib/mascotRoaming";
import {
  buildFlight,
  partMotion,
  pickArrivalStunt,
  pickIdleStunt,
  resolveStunt,
} from "../lib/mascotStunts";
import { nextFact, SPACESHIP_LINES } from "../lib/mascotFacts";
import { findPerch, perchInView, perchPosition } from "../lib/mascotPerches";
import RobotMascot from "./RobotMascot";
import MascotBubble from "./MascotBubble";
import { FLYBY_EVENT } from "./SpaceshipFlyby";
import { LOADER_MS } from "./LoadingOverlay";
import data from "../data/data.json";

// The model, system prompt and OpenRouter key live in the proxy (worker/).
const MAX_MESSAGES_PER_SESSION = 24;
const AGENT_ENDPOINT = import.meta.env.PUBLIC_AGENT_ENDPOINT;

const STARTER_PROMPTS = [
  "What does he do?",
  "What's he built recently?",
  "How can I hire him?",
];

const AIR_REST = { x: 0, y: 0, rotate: 0 };
const SQUASH_REST = { scaleX: 1, scaleY: 1 };

// Moves longer than this are flown Iron Man-style instead of walked.
const FLY_DISTANCE = 260;
// Chance he picks something on the page to sit on when arriving at a section.
const PERCH_CHANCE = 0.85;
const THINK_MS = 1000;
const FIRST_GREETING_MS = 2500;

// Just off the right edge, so he can jetpack in once the loader clears.
function offstagePosition() {
  if (typeof window === "undefined") return getMascotPosition("main");
  return { x: window.innerWidth + 90, y: window.innerHeight * 0.3, edge: "right" };
}

function travelDurationMs(distance) {
  return Math.min(2200, Math.max(850, distance * 2.4));
}

function readingMs(text) {
  return Math.min(7500, Math.max(3500, text.length * 60));
}

// Stunts end on a full turn (-360°); snapping back to 0 is visually identical,
// so the rest transition must be instant or he'd unwind the flip in reverse.
function airMotion(stunt) {
  const m = partMotion(stunt, "air", AIR_REST);
  return stunt ? m : { animate: AIR_REST, transition: { duration: 0 } };
}

// The shadow stays on the ground but follows sideways travel (cartwheel, dance).
function shadowMotion(stunt) {
  const def = resolveStunt(stunt);
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
  const [pos, setPos] = useState(offstagePosition);
  const [edge, setEdge] = useState("right");
  const [sectionId, setSectionId] = useState("main");
  const [walking, setWalking] = useState(false);
  const [stunt, setStunt] = useState(null);
  const [moveMs, setMoveMs] = useState(1200);
  const [flightPath, setFlightPath] = useState(null);
  const [bubble, setBubble] = useState(null);
  const [perch, setPerch] = useState(null);
  const listRef = useRef(null);
  const perchRef = useRef(perch);
  const pendingPerchRef = useRef(null);
  const posRef = useRef(pos);
  const sectionRef = useRef(sectionId);
  const openRef = useRef(open);
  const walkingRef = useRef(walking);
  const stuntRef = useRef(stunt);
  const flightRef = useRef(flightPath);
  const bubbleRef = useRef(bubble);
  const pendingStuntRef = useRef(null);
  const queuedSectionRef = useRef(null);
  const announceRef = useRef(true);
  const greetedRef = useRef(false);
  const enteredRef = useRef(false);
  const bubbleTimersRef = useRef([]);
  // While perched, the mascot's frame is pinned to the page so it scrolls
  // natively with the element he sits on (a fixed box re-positioned from JS
  // always trails the compositor's scroll by a frame and looks jittery).
  const frameRef = useRef(null);
  const pinnedRef = useRef(false);
  const [pin, setPin] = useState(null);
  const mx = useMotionValue(pos.x);
  const my = useMotionValue(pos.y);

  // posRef always holds his live on-screen position; while pinned it's kept
  // current by the perch scroll listener instead.
  if (!pinnedRef.current) posRef.current = pos;
  sectionRef.current = sectionId;
  openRef.current = open;
  walkingRef.current = walking;
  stuntRef.current = stunt;
  flightRef.current = flightPath;
  bubbleRef.current = bubble;
  perchRef.current = perch;

  const pinToPage = () => {
    const frame = frameRef.current;
    const box = frame?.parentElement?.getBoundingClientRect();
    if (!box) return;
    const next = { top: -box.top, left: -box.left };
    Object.assign(frame.style, { position: "absolute", top: `${next.top}px`, left: `${next.left}px` });
    pinnedRef.current = true;
    setPin(next);
  };

  const unpin = () => {
    if (!pinnedRef.current) return;
    pinnedRef.current = false;
    const frame = frameRef.current;
    if (frame) Object.assign(frame.style, { position: "fixed", top: "0px", left: "0px" });
    mx.jump(posRef.current.x);
    my.jump(posRef.current.y);
    setPin(null);
  };

  const clearBubble = () => {
    bubbleTimersRef.current.forEach(clearTimeout);
    bubbleTimersRef.current = [];
    setBubble(null);
  };

  // Think for a beat, then type the line out, then fade.
  const speak = (text, { force = false } = {}) => {
    if (!text || openRef.current) return;
    if (!force && (walkingRef.current || stuntRef.current)) return;
    clearBubble();
    setBubble({ text, phase: "thinking" });
    bubbleTimersRef.current = [
      setTimeout(() => setBubble({ text, phase: "speaking" }), THINK_MS),
      setTimeout(() => setBubble(null), THINK_MS + readingMs(text)),
    ];
  };

  const playStunt = (id) => {
    if (reduceMotion || !id || stuntRef.current) return;
    if (id !== "wave") clearBubble();
    setStunt(id);
  };

  // options.stunt === false → plain walk (no flight, no arrival stunt).
  // options.perch → sit on that perch on arrival instead of an arrival stunt.
  const goTo = (nextSection, nextPos, options = {}) => {
    unpin();
    const from = posRef.current;
    const dist = travelDistance(from, nextPos);
    if (nextSection !== sectionRef.current) announceRef.current = true;
    setSectionId(nextSection);
    setEdge(nextPos.edge);
    setPerch(null);
    pendingPerchRef.current = options.perch ?? null;
    if (dist < 1) {
      arrive();
      return;
    }
    clearBubble();

    if (!reduceMotion && dist > FLY_DISTANCE && options.stunt !== false) {
      const { def, path } = buildFlight(from, nextPos, nextPos.edge === "left");
      pendingStuntRef.current = null;
      setStunt(def);
      setFlightPath(path);
      setPos({ x: nextPos.x, y: nextPos.y });
      return;
    }

    setStunt(null);
    pendingStuntRef.current =
      options.stunt === false || options.perch || reduceMotion
        ? null
        : pickArrivalStunt(dist, nextPos.y);
    setMoveMs(options.durationMs ?? travelDurationMs(dist));
    setWalking(true);
    setPos({ x: nextPos.x, y: nextPos.y });
  };

  const goToAnchor = (section = sectionRef.current) =>
    goTo(section, getMascotPosition(section));

  const goToPerch = (section, target) => {
    const spot = perchPosition(target);
    goTo(section, spot, { perch: target });
  };

  // Landed somewhere. If he was heading for a perch, sit on it — hopping the
  // last few px if the page scrolled while he was on his way.
  const arrive = () => {
    const target = pendingPerchRef.current;
    pendingPerchRef.current = null;
    if (!target) return;
    const spot = perchPosition(target);
    if (!target.el.isConnected || !perchInView(spot.rect)) {
      goToAnchor();
      return;
    }
    if (travelDistance(posRef.current, spot) > 6) {
      goTo(sectionRef.current, spot, { perch: target, stunt: false, durationMs: 260 });
      return;
    }
    setEdge(spot.edge);
    setPos({ x: spot.x, y: spot.y });
    setPerch(target);
    mx.jump(spot.x);
    my.jump(spot.y);
    posRef.current = { x: spot.x, y: spot.y };
    pinToPage();
  };

  const finishMove = () => {
    if (!walkingRef.current) return;
    setWalking(false);
    const pending = pendingStuntRef.current;
    pendingStuntRef.current = null;
    if (pending) playStunt(pending);
    arrive();
  };

  // Framer skips onAnimationComplete when there's nothing to animate (e.g. the
  // mascot remounted after the chat closed), which would leave him walking forever.
  useEffect(() => {
    if (!walking) return;
    const t = setTimeout(finishMove, moveMs + 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walking, moveMs, pos]);

  // The pinned frame scrolls with the page on its own; just track where he is
  // on screen, re-seat him if layout shifts, and hop off if the perch leaves view.
  useEffect(() => {
    if (!perch) return;
    let frame = null;
    const update = (relayout) => {
      frame = null;
      if (!pinnedRef.current) return;
      const spot = perchPosition(perch);
      if (!perch.el.isConnected || !perchInView(spot.rect)) {
        goToAnchor();
        return;
      }
      posRef.current = { x: spot.x, y: spot.y };
      if (relayout) {
        mx.jump(spot.x);
        my.jump(spot.y);
        setPos({ x: spot.x, y: spot.y });
        pinToPage();
      }
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(() => update(false));
    };
    const onResize = () => update(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perch]);

  useEffect(() => {
    if (!stunt) return;
    const t = setTimeout(() => {
      setStunt(null);
      if (flightRef.current) {
        setFlightPath(null);
        const queued = queuedSectionRef.current;
        queuedSectionRef.current = null;
        if (queued && queued !== sectionRef.current) {
          pendingPerchRef.current = null;
          setTimeout(() => arriveAtSection(queued), 50);
        } else {
          arrive();
        }
      }
    }, resolveStunt(stunt).duration * 1000 + 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stunt]);

  // Say something about the section once he's settled after arriving.
  useEffect(() => {
    if (open || walking || stunt || !announceRef.current) return;
    const t = setTimeout(
      () => {
        announceRef.current = false;
        greetedRef.current = true;
        speak(nextFact(sectionRef.current));
      },
      greetedRef.current ? 700 : FIRST_GREETING_MS,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, walking, stunt, sectionId]);

  // Wave at the spaceship when it passes.
  useEffect(() => {
    const onFlyby = () => {
      if (openRef.current || flightRef.current) return;
      if (!walkingRef.current) playStunt("wave");
      speak(SPACESHIP_LINES[Math.floor(Math.random() * SPACESHIP_LINES.length)], {
        force: true,
      });
    };
    window.addEventListener(FLYBY_EVENT, onFlyby);
    return () => window.removeEventListener(FLYBY_EVENT, onFlyby);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => bubbleTimersRef.current.forEach(clearTimeout), []);

  const arriveAtSection = (id) => {
    const target = !reduceMotion && Math.random() < PERCH_CHANCE && findPerch(id);
    if (target) goToPerch(id, target);
    else goToAnchor(id);
  };

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
        if (!SECTION_ANCHORS[id]) return;
        if (!enteredRef.current) {
          setSectionId(id);
          return;
        }
        if (flightRef.current) {
          queuedSectionRef.current = id;
          return;
        }
        if (id === sectionRef.current) return;
        arriveAtSection(id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- goTo is stable helpers + refs
  }, []);

  // Entrance: once "Entering orbit" fades, fly in to wherever the page is.
  useEffect(() => {
    const t = setTimeout(() => {
      enteredRef.current = true;
      if (reduceMotion) {
        const spot = getMascotPosition(sectionRef.current);
        mx.jump(spot.x);
        my.jump(spot.y);
        setEdge(spot.edge);
        setPos({ x: spot.x, y: spot.y });
      } else {
        arriveAtSection(sectionRef.current);
      }
    }, LOADER_MS + 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep anchors aligned on resize.
  useEffect(() => {
    const onResize = () => {
      if (!enteredRef.current || perchRef.current || flightRef.current) return;
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
        const busy =
          !enteredRef.current ||
          openRef.current ||
          walkingRef.current ||
          stuntRef.current ||
          bubbleRef.current ||
          announceRef.current;
        const section = sectionRef.current;
        const roll = Math.random();
        if (busy) {
          // wait for the next tick
        } else if (perchRef.current) {
          // Sitting: chat, shuffle to another spot, or hop down.
          const other = roll >= 0.45 && roll < 0.75 && findPerch(section, perchRef.current.el);
          if (roll < 0.45) speak(nextFact(section));
          else if (other) goToPerch(section, other);
          else if (roll >= 0.88) goToAnchor(section);
        } else {
          // On the floor: mostly look for something to climb onto.
          const target = roll < 0.45 && findPerch(section);
          if (target) goToPerch(section, target);
          else if (roll < 0.65) speak(nextFact(section));
          else if (roll < 0.85) playStunt(pickIdleStunt(posRef.current.y));
          else goTo(section, patrolNudge(section, posRef.current.x), { durationMs: 1200, stunt: false });
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

    if (!AGENT_ENDPOINT) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm not wired up yet — my owner still needs to connect my brain. Try the contact form in the meantime!",
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(AGENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error(`Agent error: ${res.status}`);
      const data_ = await res.json();
      const reply =
        data_.reply || "Sorry, I couldn't come up with an answer to that.";
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

  const sitting = !!perch && !walking && !flightPath;  return (
    <>
      {/* Roaming mascot — scroll anchors + idle patrol stunts */}
      <div
        ref={frameRef}
        className="z-50 pointer-events-none"
        style={pin ? { position: "absolute", top: pin.top, left: pin.left } : { position: "fixed", top: 0, left: 0 }}
      >
        {!open && (
          <motion.div
            className="absolute left-0 top-0 pointer-events-none will-change-transform"
            style={{ x: mx, y: my }}
            animate={flightPath ? { x: flightPath.x, y: flightPath.y } : { x: pos.x, y: pos.y }}
            transition={
              flightPath
                ? { duration: flightPath.duration, times: flightPath.times, ease: "easeInOut" }
                : perch
                  ? { duration: 0 }
                  : { duration: moveMs / 1000, ease: "easeInOut" }
            }
            onAnimationComplete={finishMove}
          >
            {flightPath &&
              [-4, 4].map((dy) => (
                <motion.span
                  key={dy}
                  className="absolute h-1.5 w-52 rounded-full bg-gradient-to-r from-white/90 via-accent/60 to-transparent"
                  style={{
                    left: flightPath.trailOrigin.x,
                    top: flightPath.trailOrigin.y + dy,
                    originX: 0,
                    rotate: flightPath.trailAngle,
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  {...partMotion(stunt, "trail", { opacity: 0, scaleX: 0 })}
                />
              ))}

            <AnimatePresence>
              {bubble && !flightPath && (
                <MascotBubble
                  key="bubble"
                  phase={bubble.phase}
                  text={bubble.text}
                  edge={edge}
                  below={pos.y < 140}
                  beside={!!perch}
                  onClick={openChat}
                />
              )}
            </AnimatePresence>

            <button
              onClick={openChat}
              onMouseEnter={() => {
                if (!walkingRef.current) playStunt("wave");
              }}
              aria-label="Open AI assistant"
              className={`relative w-14 h-[88px] ${sitting ? "pointer-events-none" : "pointer-events-auto"}`}
            >
              {/* While sitting, only his upper body is clickable so his dangling
                  legs don't block the button/card he's perched on. */}
              {sitting && <span className="absolute inset-x-0 top-0 h-[64%] pointer-events-auto" />}
              <div
                className="relative w-full h-full"
                style={{ transform: edge === "left" ? "scaleX(-1)" : undefined }}
              >
                <motion.span
                  className="absolute left-1/2 -bottom-1 -ml-5 h-2.5 w-10 rounded-full"
                  style={{ background: "radial-gradient(closest-side, rgb(0 0 0 / 0.7), transparent)" }}
                  {...(sitting
                    ? { animate: { opacity: 0 }, transition: { duration: 0.2 } }
                    : shadowMotion(stunt))}
                />
                <motion.span
                  className="absolute left-1/2 -bottom-1 -ml-7 h-4 w-14 rounded-full border-2 border-accent/40"
                  initial={{ opacity: 0, scale: 0.4 }}
                  {...partMotion(stunt, "dust", { opacity: 0, scale: 0.4 })}
                />
                <motion.div
                  className="relative w-full h-full"
                  animate={
                    stunt || sitting
                      ? { y: 0 }
                      : walking
                        ? { y: [0, -4, 0, -4, 0] }
                        : { y: [0, -6, 0] }
                  }
                  transition={
                    stunt || sitting
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
                      <span
                        className="absolute -inset-x-4 -inset-y-4"
                        style={{ background: "radial-gradient(closest-side, rgb(var(--color-accent-rgb) / 0.2), transparent)" }}
                      />
                      <RobotMascot walking={walking} stunt={stunt} sitting={sitting} />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </button>
          </motion.div>
        )}
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
