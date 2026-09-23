// Keyframed choreography per body part. Every array in a stunt shares the
// stunt's `times`, so the parts stay in sync. Local coordinates: -x is always
// "inward" (away from the screen edge he's standing on) because the mirror
// flip is applied outside the stunt layer.
//
// air     → whole body translate/rotate (pivot at body centre)
// squash  → scaleX/scaleY anchored at the feet (anticipation + landing)
// head / leftArm / rightArm / leftLeg / rightLeg → rotate (+ y) at joints
// shadow  → ground shadow under the feet
// flame   → jetpack exhaust opacity
// dust    → landing puff

const mirror = (arr) => arr.map((v) => -v);

const backflipArm = [0, -35, 170, 70, 70, 120, 95, 0];
const backflipLeg = [0, 8, 0, -18, -18, 0, 10, 0];

const cartArm = [0, 150, 160, 160, 160, 160, 150, 0];
const cartLeg = [0, 20, 38, 38, 38, 38, 20, 0];

const jetArm = [0, 20, 35, 105, 105, 45, 25, 0];
const jetLeg = [0, 0, -8, -8, -8, -8, 0, 0];

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

  jetpack: {
    duration: 2.8,
    needsHeadroom: 230,
    times: [0, 0.12, 0.25, 0.45, 0.62, 0.8, 0.92, 1],
    air: {
      x: [0, 0, -10, -60, -45, -20, 0, 0],
      y: [0, 6, -45, -175, -195, -120, 0, 0],
      rotate: [0, 0, -8, -8, -368, -360, -360, -360],
    },
    squash: {
      scaleY: [1, 0.8, 1.1, 1, 1, 1, 0.78, 1],
      scaleX: [1, 1.15, 0.94, 1, 1, 1, 1.2, 1],
    },
    head: { rotate: [0, 0, -6, 8, 8, 0, 0, 0] },
    leftArm: { rotate: jetArm },
    rightArm: { rotate: mirror(jetArm) },
    leftLeg: { rotate: jetLeg },
    rightLeg: { rotate: mirror(jetLeg) },
    flame: { opacity: [0, 0, 1, 1, 1, 1, 0.3, 0] },
    shadow: {
      scale: [1, 1.1, 0.7, 0.25, 0.2, 0.4, 1.25, 1],
      opacity: [0.5, 0.6, 0.35, 0.1, 0.08, 0.2, 0.65, 0.5],
    },
    dust: { opacity: [0, 0, 0.6, 0, 0, 0, 0.8, 0], scale: [0.4, 0.4, 1.3, 1.8, 0.4, 0.4, 1, 1.8] },
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

export const TRAVEL_STUNTS = ["backflip", "cartwheel", "jetpack", "headstand"];
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

/** Framer Motion props for one part of a stunt, or the rest pose. */
export function partMotion(stunt, part, rest) {
  const def = stunt && STUNTS[stunt];
  const frames = def?.[part];
  if (!frames) return { animate: rest, transition: { duration: 0.25 } };
  return {
    animate: frames,
    transition: { duration: def.duration, times: def.times, ease: "easeInOut" },
  };
}
