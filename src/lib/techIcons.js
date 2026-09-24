/**
 * Tech stack icon URLs.
 * - Devicon (colored): https://devicon.dev/ — same set as https://techicons.dev/
 * - LobeHub / Iconify: colored marks for AI vendors not in Devicon releases yet.
 */

const DEVICON_LATEST =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const DEVICON_DEVELOP =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@develop/icons";

const LOBE =
  "https://cdn.jsdelivr.net/gh/lobehub/lobe-icons@master/packages/static-svg/icons";

const iconifySimple = (slug) =>
  `https://api.iconify.design/simple-icons/${slug}.svg`;
const iconifyLogos = (slug) => `https://api.iconify.design/logos/${slug}.svg`;

export function deviconUrl(icon, variant = "original", branch = "latest") {
  const base = branch === "develop" ? DEVICON_DEVELOP : DEVICON_LATEST;
  return `${base}/${icon}/${icon}-${variant}.svg`;
}

/** Colored / reliable sources for workflow + AI provider nodes. */
const BY_NAME = {
  OpenAI: `${LOBE}/openai.svg`,
  Claude: `${LOBE}/anthropic.svg`,
  OpenRouter: iconifySimple("openrouter"),
  Gemini: `${LOBE}/gemini.svg`,
  Mistral: `${LOBE}/mistral.svg`,
  Groq: `${LOBE}/groq.svg`,
  Cohere: `${LOBE}/cohere.svg`,
  Llama: `${LOBE}/meta.svg`,
  DeepSeek: `${LOBE}/deepseek.svg`,
  Perplexity: `${LOBE}/perplexity.svg`,
  xAI: `${LOBE}/xai.svg`,
  "Hugging Face": iconifyLogos("hugging-face-icon"),
  "Stability AI": `${LOBE}/stability.svg`,
  "Together AI": `${LOBE}/together.svg`,
  "Azure OpenAI": `${LOBE}/azure.svg`,
  "AWS Bedrock": `${LOBE}/aws.svg`,
  LangChain: iconifySimple("langchain"),
  Ollama: `${LOBE}/ollama.svg`,
  Replicate: `${LOBE}/replicate.svg`,
  "Fal.Ai": `${LOBE}/fal.svg`,
  n8n: `${LOBE}/n8n.svg`,
};

/**
 * @param {string} name Technology label from data.json
 * @param {string} [fallback] imageSrc from data.json
 */
export function resolveTechIconSrc(name, fallback) {
  if (BY_NAME[name]) return BY_NAME[name];

  if (fallback) {
    if (fallback.includes("cdn.simpleicons.org")) {
      const slug = fallback.split("/").filter(Boolean).pop();
      if (slug) return iconifySimple(slug);
    }
    if (name === "n8n" && fallback.includes("devicon@latest")) {
      return deviconUrl("n8n", "original", "develop");
    }
    if (name === "Hugging Face" && fallback.includes("devicon@latest")) {
      return iconifyLogos("hugging-face-icon");
    }
    if (name === "Ollama" && fallback.includes("devicon@latest")) {
      return `${LOBE}/ollama.svg`;
    }
  }

  if (name === "Django") return deviconUrl("django", "plain");
  if (name === "Express JS" || name === "Express") {
    return deviconUrl("express", "original");
  }

  return fallback;
}

/** @returns {"mono" | "django" | "brand"} */
export function getTechIconDisplayStyle(name, src) {
  if (name === "Express JS" || name === "Express") return "mono";
  if (name === "Django") return "django";
  if (isMonochromeTechIcon(src, name)) return "mono";
  return "brand";
}

/** True for white/currentColor marks that need a light tile + black render. */
export function isMonochromeTechIcon(src, name) {
  if (name === "Express JS" || name === "Express") return true;
  if (!src) return false;
  if (src.includes("devicons/devicon")) return false;
  if (src.includes("api.iconify.design/logos/")) return false;
  if (src.includes("fal.ai/") || src.endsWith(".png") || src.endsWith(".jpg")) return false;
  if (
    src.includes("lobehub/lobe-icons") ||
    src.includes("api.iconify.design/simple-icons/") ||
    src.includes("cdn.simpleicons.org")
  ) {
    return true;
  }
  return false;
}
