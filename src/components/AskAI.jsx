import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import data from "../data/data.json";

// Same backend contract as the retired mascot chat: the model, system prompt
// and OpenRouter key all live server-side in worker/agent-proxy.js — this
// component only ever sees the Worker's URL and the conversation so far.
const MAX_MESSAGES_PER_SESSION = 24;
const AGENT_ENDPOINT = import.meta.env.PUBLIC_AGENT_ENDPOINT;

const STARTER_PROMPTS = [
  "What does he do?",
  "What's he built recently?",
  "How can I hire him?",
];

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, loading]);

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
            "This agent isn't wired up in this environment yet — try the contact form below in the meantime.",
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
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Something went wrong reaching the agent just now — mind trying again in a moment?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ask-ai" className="relative max-w-2xl mx-auto px-4 py-24">
      <div className="text-center mb-10">
        <span className="eyebrow">Ask the agent</span>
        <h1 className="section-title text-2xl sm:text-3xl">
          Rather ask than read?
        </h1>
        <p className="max-w-md mx-auto mt-4 text-sm text-muted leading-relaxed">
          This is a small, grounded AI agent built the same way I build them
          for clients — a system prompt scoped strictly to my real profile,
          served through a locked-down proxy, no fabricated answers.
        </p>
      </div>

      <div className="glass-panel flex flex-col h-[480px] overflow-hidden">
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                    : "bg-text/[0.06] text-text/90"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-text/[0.06] rounded-xl px-3.5 py-2.5 flex gap-1">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-accent"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
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
            placeholder={`Ask about ${data.name.split(" ")[0]}'s work...`}
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
      </div>
    </section>
  );
};

export default AskAI;
