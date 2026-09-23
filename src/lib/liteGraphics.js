import { useEffect, useState } from "react";

/** True when we should skip expensive / flicker-prone visuals. */
export function detectLiteGraphics() {
  if (typeof window === "undefined") return false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reduceTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const lowMemory = navigator.deviceMemory != null && navigator.deviceMemory <= 4;
  const lowCores = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
  return reduceMotion || reduceTransparency || coarse || lowMemory || lowCores;
}

export function useLiteGraphics() {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    setLite(detectLiteGraphics());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setLite(detectLiteGraphics());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return lite;
}
