export const MASCOT_WIDTH = 56;
export const MASCOT_HEIGHT = 88;
export const MASCOT_MARGIN = 24;

/** Mascot hang-out spots — must match real `#id`s on the page. */
export const SECTION_ANCHORS = {
  main: { edge: "right", y: 0.78 },
  work: { edge: "left", y: 0.4 },
  technologies: { edge: "right", y: 0.5 },
  projects: { edge: "left", y: 0.46 },
  contact: { edge: "right", y: 0.64 },
};

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
  const y = clampMascotY(anchor.y * vh - MASCOT_HEIGHT / 2, vh);
  return { x, y, edge: anchor.edge };
}

export function travelDistance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function patrolNudge(sectionId) {
  const base = getMascotPosition(sectionId);
  const dy = (Math.random() - 0.5) * 72;
  return {
    ...base,
    y: clampMascotY(base.y + dy),
  };
}
