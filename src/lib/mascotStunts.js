// Keyframed choreography per body part. Every array in a stunt shares the
// stunt's `times`, so the parts stay in sync. Local coordinates: -x is always
// "inward" (away from the screen edge he's standing on) because the mirror
// flip is applied outside the stunt layer.
//
// air     → whole body translate/rotate (pivot at body centre)
// squash  → scaleX/scaleY anchored at the feet (anticipation + landing)
// head / leftArm / rightArm / leftLeg / rightLeg → rotate (+ y) at joints
// shadow  → ground shadow under the feet
// flame   → boot thruster opacity
// thrust  → boot thruster length (scaleY)
// repulsor→ palm repulsor glow opacity
// dust    → takeoff / landing shockwave ring
// trail   → contrail streak behind him in flight (opacity + scaleX)
//
// A stunt is either a key of STUNTS or a def object built at runtime
// (see buildFlight), so the same renderer handles both.

const mirror = (arr) => arr.map((v) => -v);

const backflipArm = [0, -35, 170, 70, 70, 120, 95, 0];
const backflipLeg = [0, 8, 0, -18, -18, 0, 10, 0];

const cartArm = [0, 150, 160, 160, 160, 160, 150, 0];
const cartLeg = [0, 20, 38, 38, 38, 38, 20, 0];

// Superhero landing: body dropped into a crouch, one fist planted on the
// ground, the other arm swept back, legs split, head bowed.
const LANDING = {
  leftArm: 75,
  rightArm: -4,
  leftLeg: 35,
  rightLeg: -18,
  head: 12,
  headY: 4,
};

const headstandArm = [0, -25, 150, 135, 150, 135, 150, 0];
const headstandLeftLeg = [0, 0, 0, 28, -12, 28, 0, 0];

const danceLeftArm = [0, 120, 40, 120, 40, 165, 20, 165, 0];
const danceRightArm = [0, -40, -120, -40, -120, -165, -20, -165, 0];
const danceLeg = [0, 12, 0, 12, 0, -12, 0, -12, 0];

export const STUNTS = {
  backflip: {
    duration: 1.6,
    times: [0, 0.15, 0.28, 0.45, 0.62, 0.78, 0.88, 1],
    air: {
      y: [0, 4, -60, -105, -92, -30, 0, 0],
      rotate: [0, 0, -40, -180, -300, -360, -360, -360],
    },
    squash: {
      scaleY: [1, 0.74, 1.16, 0.92, 0.92, 1.05, 0.76, 1],
      scaleX: [1, 1.2, 0.9, 1.04, 1.04, 0.98, 1.22, 1],
    },
    head: { rotate: [0, 10, -12, 0, 0, 0, -8, 0] },
    leftArm: { rotate: backflipArm },
    rightArm: { rotate: mirror(backflipArm) },
    leftLeg: { rotate: backflipLeg, y: [0, 0, 0, -14, -14, 0, 0, 0] },
    rightLeg: { rotate: mirror(backflipLeg), y: [0, 0, 0, -14, -14, 0, 0, 0] },
    shadow: {
      scale: [1, 1.15, 0.65, 0.4, 0.45, 0.8, 1.25, 1],
      opacity: [0.5, 0.6, 0.3, 0.15, 0.18, 0.35, 0.65, 0.5],
    },
    dust: { opacity: [0, 0, 0, 0, 0, 0, 0.8, 0], scale: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 1, 1.8] },
  },

  cartwheel: {
    duration: 1.9,
    times: [0, 0.1, 0.3, 0.45, 0.55, 0.7, 0.9, 1],
    air: {
      x: [0, -6, -45, -85, -85, -45, -6, 0],
      y: [0, 0, -24, 0, 0, -24, 0, 0],
      rotate: [0, 0, -180, -360, -360, -180, 0, 0],
    },
    squash: {
      scaleY: [1, 0.85, 1, 1, 1, 1, 0.85, 1],
      scaleX: [1, 1.1, 1, 1, 1, 1, 1.1, 1],
    },
    leftArm: { rotate: cartArm },
    rightArm: { rotate: mirror(cartArm) },
    leftLeg: { rotate: cartLeg },
    rightLeg: { rotate: mirror(cartLeg) },
    shadow: {
      scale: [1, 1, 0.8, 1, 1, 0.8, 1, 1],
      opacity: [0.5, 0.5, 0.35, 0.5, 0.5, 0.35, 0.5, 0.5],
    },
  },

  // Iron Man hover: blast off, barrel roll at the top, superhero landing.
  jetpack: {
    duration: 3.4,
    needsHeadroom: 230,
    times: [0, 0.1, 0.2, 0.4, 0.55, 0.7, 0.8, 0.92, 1],
    air: {
      x: [0, 0, -10, -50, -40, -15, 0, 0, 0],
      y: [0, 4, -60, -185, -200, -110, 0, 0, 0],
      rotate: [0, 0, -6, -12, -372, -360, -360, -360, -360],
    },
    squash: {
      scaleY: [1, 0.76, 1.12, 1, 1, 1.04, 0.72, 0.8, 1],
      scaleX: [1, 1.18, 0.92, 1, 1, 0.98, 1.22, 1.15, 1],
    },
    head: {
      rotate: [0, 0, -6, 6, 6, 0, LANDING.head, LANDING.head, 0],
      y: [0, 0, 0, 0, 0, 0, LANDING.headY, LANDING.headY, 0],
    },
    leftArm: { rotate: [0, 20, 25, 30, 30, 40, LANDING.leftArm, LANDING.leftArm, 0] },
    rightArm: { rotate: [0, -20, -25, -30, -30, -40, LANDING.rightArm, LANDING.rightArm, 0] },
    leftLeg: { rotate: [0, 8, -4, -4, -4, 6, LANDING.leftLeg, LANDING.leftLeg, 0] },
    rightLeg: { rotate: [0, -8, 4, 4, 4, -6, LANDING.rightLeg, LANDING.rightLeg, 0] },
    flame: { opacity: [0, 0.6, 1, 1, 1, 1, 0.2, 0, 0] },
    thrust: { scaleY: [1, 1, 2.2, 1.6, 1.6, 1.9, 0.6, 1, 1] },
    repulsor: { opacity: [0, 0.5, 1, 1, 1, 1, 0.5, 0, 0] },
    shadow: {
      scale: [1, 1.15, 0.7, 0.25, 0.2, 0.45, 1.35, 1.2, 1],
      opacity: [0.5, 0.6, 0.35, 0.08, 0.06, 0.2, 0.7, 0.6, 0.5],
    },
    dust: {
      opacity: [0, 0, 0.7, 0, 0, 0, 0.9, 0.3, 0],
      scale: [0.4, 0.4, 1.4, 2, 0.4, 0.4, 1.2, 2.2, 2.2],
    },
  },

  // Balances on the antenna tip — the chibi head is too big for the arms to
  // reach the floor, so arms spread out for balance instead.
  headstand: {
    duration: 2.5,
    times: [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    air: {
      y: [0, 4, -50, -16, -16, -16, -50, 0],
      rotate: [0, 0, -180, -180, -180, -180, -360, -360],
    },
    squash: {
      scaleY: [1, 0.8, 1, 0.94, 1, 0.94, 1, 1],
      scaleX: [1, 1.12, 1, 1.04, 1, 1.04, 1, 1],
    },
    head: { rotate: [0, 0, 0, 12, -12, 12, 0, 0] },
    leftArm: { rotate: headstandArm },
    rightArm: { rotate: mirror(headstandArm) },
    leftLeg: { rotate: headstandLeftLeg },
    rightLeg: { rotate: mirror(headstandLeftLeg) },
    shadow: {
      scale: [1, 1.1, 0.7, 1, 1, 1, 0.7, 1],
      opacity: [0.5, 0.55, 0.3, 0.5, 0.5, 0.5, 0.3, 0.5],
    },
  },

  dance: {
    duration: 2.4,
    times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    air: {
      x: [0, -6, 6, -6, 6, 0, 0, 0, 0],
      y: [0, -8, 0, -8, 0, -16, 0, -16, 0],
      rotate: [0, -7, 7, -7, 7, 0, 0, 0, 0],
    },
    squash: {
      scaleY: [1, 1.04, 0.92, 1.04, 0.92, 1.06, 0.9, 1.06, 1],
      scaleX: [1, 0.97, 1.06, 0.97, 1.06, 0.96, 1.08, 0.96, 1],
    },
    head: { rotate: [0, -14, 14, -14, 14, 0, -16, 16, 0] },
    leftArm: { rotate: danceLeftArm },
    rightArm: { rotate: danceRightArm },
    leftLeg: { rotate: danceLeg },
    rightLeg: { rotate: danceLeg },
  },

  wave: {
    duration: 1.7,
    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.88, 1],
    head: { rotate: [0, 0, 10, 10, 10, 10, 0, 0] },
    rightArm: { rotate: [0, -150, -115, -160, -115, -160, -150, 0] },
    squash: { scaleY: [1, 1.03, 1, 1.03, 1, 1.03, 1, 1] },
  },
};

export const TRAVEL_STUNTS = ["backflip", "cartwheel", "headstand"];
export const IDLE_STUNTS = ["backflip", "cartwheel", "jetpack", "headstand", "dance", "wave"];

function pickFrom(list, mascotY) {
  const usable = list.filter((id) => !STUNTS[id].needsHeadroom || mascotY > STUNTS[id].needsHeadroom);
  return usable[Math.floor(Math.random() * usable.length)] ?? null;
}

/** Stunt to perform on arrival after walking `distance` px (or null). */
export function pickArrivalStunt(distance, mascotY) {
  if (distance < 140) return null;
  if (distance < 400 && Math.random() < 0.4) return null;
  return pickFrom(TRAVEL_STUNTS, mascotY);
}

export function pickIdleStunt(mascotY) {
  return pickFrom(IDLE_STUNTS, mascotY);
}

export function resolveStunt(stunt) {
  if (!stunt) return null;
  return typeof stunt === "string" ? STUNTS[stunt] : stunt;
}

const FLIGHT_TIMES = [0, 0.07, 0.14, 0.24, 0.62, 0.72, 0.78, 0.92, 1];

/**
 * Iron Man flight between two screen positions: crouch, blast off, lean into
 * a near-horizontal cruise with palms back and long boot thrust, pull up over
 * the target, then a superhero landing.
 *
 * `mirrored` is true when the robot is drawn flipped (standing on the left
 * edge), which reverses what "forward" means for the body tilt.
 * Returns { def, path } — `def` animates the body, `path` the screen position.
 */
export function buildFlight(from, to, mirrored) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const duration = Math.min(3.8, 2.6 + dist / 900);

  const localDx = mirrored ? -dx : dx;
  const tilt = (localDx >= 0 ? 1 : -1) * 68;
  const peak = Math.max(30, Math.min(from.y, to.y) - 110);
  const lerp = (t) => ({ x: from.x + dx * t, y: from.y + dy * t });
  const a = lerp(0.18);
  const b = lerp(0.82);

  const path = {
    x: [from.x, from.x, from.x, a.x, b.x, to.x, to.x, to.x, to.x],
    y: [from.y, from.y, from.y - 45, peak, peak + 10, to.y - 55, to.y, to.y, to.y],
    times: FLIGHT_TIMES,
    duration,
    // Contrail starts at the boots — which, tilted 68° into the flight, sit
    // behind and below the body centre (28, 44) — and points back along the
    // cruise direction (peak → peak + 10).
    trailOrigin: { x: 28 - Math.sign(dx || 1) * 41, y: 60 },
    trailAngle: (Math.atan2(10, b.x - a.x) * 180) / Math.PI + 180,
  };

  const def = {
    duration,
    times: FLIGHT_TIMES,
    air: { rotate: [0, 0, 0, tilt, tilt * 0.92, 0, 0, 0, 0] },
    squash: {
      scaleY: [1, 0.74, 1.14, 1, 1, 1.04, 0.72, 0.8, 1],
      scaleX: [1, 1.2, 0.92, 1, 1, 0.98, 1.22, 1.15, 1],
    },
    head: {
      rotate: [0, 0, 0, -tilt * 0.35, -tilt * 0.35, 0, LANDING.head, LANDING.head, 0],
      y: [0, 0, 0, 0, 0, 0, LANDING.headY, LANDING.headY, 0],
    },
    leftArm: { rotate: [0, 22, 12, 10, 10, 55, LANDING.leftArm, LANDING.leftArm, 0] },
    rightArm: { rotate: [0, -22, -12, -10, -10, -55, LANDING.rightArm, LANDING.rightArm, 0] },
    leftLeg: { rotate: [0, 8, 0, -3, -3, 8, LANDING.leftLeg, LANDING.leftLeg, 0] },
    rightLeg: { rotate: [0, -8, 0, 3, 3, -8, LANDING.rightLeg, LANDING.rightLeg, 0] },
    flame: { opacity: [0, 0.6, 1, 1, 1, 1, 0.2, 0, 0] },
    thrust: { scaleY: [1, 1, 1.8, 2.8, 2.8, 1.9, 0.6, 1, 1] },
    repulsor: { opacity: [0, 0.4, 1, 1, 1, 1, 0.5, 0, 0] },
    trail: {
      opacity: [0, 0, 0.3, 1, 1, 0, 0, 0, 0],
      scaleX: [0, 0, 0.4, 1, 1, 0.2, 0, 0, 0],
    },
    shadow: {
      scale: [1, 1.15, 0.7, 0.3, 0.3, 0.6, 1.35, 1.2, 1],
      opacity: [0.5, 0.6, 0.3, 0, 0, 0.3, 0.7, 0.6, 0.5],
    },
    dust: {
      opacity: [0, 0, 0.8, 0, 0, 0, 0.9, 0.3, 0],
      scale: [0.4, 0.4, 1.4, 2, 0.4, 0.4, 1.2, 2.2, 2.2],
    },
  };

  return { def, path };
}

/** Framer Motion props for one part of a stunt, or the rest pose. */
export function partMotion(stunt, part, rest) {
  const def = resolveStunt(stunt);
  const frames = def?.[part];
  if (!frames) return { animate: rest, transition: { duration: 0.25 } };
  return {
    animate: frames,
    transition: { duration: def.duration, times: def.times, ease: "easeInOut" },
  };
}
