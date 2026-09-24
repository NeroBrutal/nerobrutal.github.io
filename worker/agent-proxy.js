// Cloudflare Worker that proxies the portfolio chat agent to OpenRouter.
// The OpenRouter key lives only here (as a Worker secret), never in the
// static site bundle. The system prompt, model and token cap are fixed
// server-side so the endpoint can't be repurposed as a general chatbot.
import { buildSystemPrompt } from "../src/lib/agentContext.js";
import data from "../src/data/data.json";

const MODEL = "openai/gpt-4o-mini";
const MAX_MESSAGES = 24;
const MAX_CHARS_PER_MESSAGE = 1000;
const MAX_REPLY_TOKENS = 400;

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || "https://rashidh.com")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

function validMessages(messages) {
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_CHARS_PER_MESSAGE,
    ) &&
    messages[messages.length - 1].role === "user"
  );
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!allowedOrigins(env).includes(origin)) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, origin);
    }

    const messages = body?.messages;
    if (!validMessages(messages)) {
      return json({ error: "Invalid messages" }, 400, origin);
    }

    if (!env.OPENROUTER_API_KEY) {
      return json({ error: "Agent not configured" }, 503, origin);
    }

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://rashidh.com",
        "X-Title": `${data.name} Portfolio Agent`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_REPLY_TOKENS,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages.map(({ role, content }) => ({ role, content })),
        ],
      }),
    });

    if (!upstream.ok) {
      return json({ error: "Upstream error" }, 502, origin);
    }

    const result = await upstream.json();
    const reply = result.choices?.[0]?.message?.content?.trim() || "";
    return json({ reply }, 200, origin);
  },
};
