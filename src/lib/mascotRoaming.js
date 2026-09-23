export const MASCOT_WIDTH = 56;
export const MASCOT_HEIGHT = 88;
export const MASCOT_MARGIN = 24;

/** Which bottom corner he stands in per section — must match real `#id`s on the page. */
export const SECTION_ANCHORS = {
  main: { edge: "right" },
  work: { edge: "left" },
  technologies: { edge: "right" },
  projects: { edge: "left" },
  contact: { edge: "right" },
};

// When he isn't perched he stands on the bottom of the screen, never mid-air.
function floorY(vh) {
  return vh - MASCOT_HEIGHT - MASCOT_MARGIN;
}

export function clampMascotY(y, vh = typeof window !== "undefined" ? window.innerHeight : 800) {
  const maxY = vh - MASCOT_HEIGHT - MASCOT_MARGIN;
  return Math.max(MASCOT_MARGIN, Math.min(maxY, y));
}

export function getMascotPosition(sectionId, viewport = null) {
  const vw = viewport?.width ?? (typeof window !== "undefined" ? window.innerWidth : 1200);
  const vh = viewport?.height ?? (typeof window !== "undefined" ? window.innerHeight : 800);
  const anchor = SECTION_ANCHORS[sectionId] ?? SECTION_ANCHORS.main;
  const x =
    anchor.edge === "left"
      ? MASCOT_MARGIN
      : vw - MASCOT_MARGIN - MASCOT_WIDTH;
  return { x, y: floorY(vh), edge: anchor.edge };
}

export function travelDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** A short stroll along the floor, staying in his corner's third of the screen. */
export function patrolNudge(sectionId, currentX) {
  const base = getMascotPosition(sectionId);
  const vw = window.innerWidth;
  const range = Math.min(220, vw / 3 - MASCOT_WIDTH);
  const min = base.edge === "left" ? base.x : base.x - range;
  const max = base.edge === "left" ? base.x + range : base.x;
  const from = Math.max(min, Math.min(max, currentX ?? base.x));
  const step = (60 + Math.random() * 100) * (Math.random() < 0.5 ? -1 : 1);
  let x = from + step;
  if (x < min || x > max) x = from - step;
  return { ...base, x: Math.max(min, Math.min(max, x)) };
}
