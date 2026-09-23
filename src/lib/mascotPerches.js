import { MASCOT_WIDTH } from "./mascotRoaming";

// Distance from the robot box's top to his hips (69/100 of the 88px SVG) —
// placing the box this far above an edge sits him on it.
export const SIT_OFFSET = 60;

const NAVBAR_CLEARANCE = 72;
const MIN_WIDTH = 70;
const MIN_HEIGHT = 28;

// Things he can sit on, with how much he likes each (higher = picked more).
const PERCH_TYPES = [
  // Buttons: perch on a corner so the label stays readable.
  { selector: ".btn-cosmic, .btn-outline-cosmic", weight: 3, corner: true },
  { selector: "img.rounded-full", weight: 3, center: true },
  { selector: ".section-title", weight: 2 },
  { selector: "[data-perch]", weight: 2 },
  { selector: ".glass-panel, .glass-pill", weight: 1 },
  { selector: "h3", weight: 1 },
];

// Marquees scroll on their own and modals/fixed UI aren't part of the page.
function isStable(el) {
  if (el.closest('[class*="mask-image"], [role="dialog"], nav, .fixed')) return false;
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    if (getComputedStyle(node).position === "fixed") return false;
  }
  return true;
}

function sitX(rect, { center, corner }) {
  const vw = window.innerWidth;
  if (corner) {
    const x = Math.random() < 0.5 ? rect.left - MASCOT_WIDTH * 0.35 : rect.right - MASCOT_WIDTH * 0.65;
    return Math.max(8, Math.min(vw - MASCOT_WIDTH - 8, x));
  }
  const narrow = rect.width < MASCOT_WIDTH + 60;
  const x = center || narrow
    ? rect.left + rect.width / 2 - MASCOT_WIDTH / 2
    : rect.left + 12 + Math.random() * (rect.width - MASCOT_WIDTH - 24);
  return Math.max(8, Math.min(vw - MASCOT_WIDTH - 8, x));
}

/** True while `rect`'s top edge sits somewhere he can comfortably perch. */
export function perchInView(rect) {
  return (
    rect.width > 0 &&
    rect.top - SIT_OFFSET > NAVBAR_CLEARANCE &&
    rect.top < window.innerHeight - 60
  );
}

/** Pick a random perch in `sectionId`, or null if nothing's in view. */
export function findPerch(sectionId, exclude = null) {
  const section = document.getElementById(sectionId);
  if (!section) return null;

  const candidates = [];
  for (const type of PERCH_TYPES) {
    section.querySelectorAll(type.selector).forEach((el) => {
      if (el === exclude || candidates.some((c) => c.el === el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < MIN_WIDTH || rect.height < MIN_HEIGHT) return;
      if (!perchInView(rect) || !isStable(el)) return;
      candidates.push({ el, type });
    });
  }
  if (!candidates.length) return null;

  let roll = Math.random() * candidates.reduce((sum, c) => sum + c.type.weight, 0);
  const pick = candidates.find((c) => (roll -= c.type.weight) <= 0) ?? candidates[0];
  const rect = pick.el.getBoundingClientRect();
  const x = sitX(rect, pick.type);
  return { el: pick.el, offsetX: x - rect.left };
}

/** Screen position (and facing edge) for sitting on `perch` right now. */
export function perchPosition(perch) {
  const rect = perch.el.getBoundingClientRect();
  const x = Math.max(8, Math.min(window.innerWidth - MASCOT_WIDTH - 8, rect.left + perch.offsetX));
  return {
    x,
    y: rect.top - SIT_OFFSET,
    edge: x + MASCOT_WIDTH / 2 < window.innerWidth / 2 ? "left" : "right",
    rect,
  };
}
