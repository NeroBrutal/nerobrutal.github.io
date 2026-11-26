# PLAN.md — Lead / Government-Track Positioning Pass

## Why

The content rewrite (done) already carries most of the weight a senior/lead reviewer looks for: production
ownership (architected the multi-LLM layer, designed and deployed two government AI agents, integrated Odoo
as a platform's operational backbone), scale (3 stores on one admin, 10+ ERP addons, 4+ LLM providers behind
one API), and a government-entity track record. That's the real signal — a government or lead-track reviewer
is reading for ownership and judgement, not for a formal black-and-white layout.

The open question was tone: the site has a roaming AI mascot and a spaceship flyby as personality touches.
Removing them entirely would be over-correcting — a confident senior engineer doesn't need to hide that they
have taste and can build something playful well. The actual risk is **frequency**, not existence: right now
the mascot does something every 6–12 seconds and the ship flies by every 45–80 seconds after a 12s delay —
fine for a portfolio you're showing off, distracting for someone trying to read your experience section in
the first 30 seconds. The fix is to make both rarer (an easter egg for someone who lingers), not to delete
them.

## Scope of this pass

1. **Leadership language in content** — tighten `about_me` and the Purone work-experience summary so the
   verbs read as ownership/architecture, not task execution. Minor wording edits only, nothing invented beyond
   what's already true from the CV.
2. **Quiet the motion layer** — `src/components/AgentBot.jsx`'s idle loop (currently fires every 6–12s) and
   `src/components/SpaceshipFlyby.jsx`'s schedule (first pass at 12s, repeat every 45–80s) both get longer
   intervals. Same features, same code paths, just less eager to interrupt a focused read.
3. **One credibility line up top** — a small trust signal near the hero's location badge referencing the
   government-entity delivery track record, so it's visible in the first viewport rather than buried in the
   timeline.

## Files touched

- `src/data/data.json` — `about_me` and the Purone `work_experience` summary, light wording pass.
- `src/components/Main.jsx` — add a second small badge next to the location pill.
- `src/components/AgentBot.jsx` — idle-loop interval constant.
- `src/components/SpaceshipFlyby.jsx` — `FIRST_PASS_MS` and the repeat-schedule range.

No structural or visual-system changes — same design language, same components, just paced for a reviewer
who's skimming for substance first.

## Verification

- `npm run dev`, read the hero + about copy cold, as if screening a candidate — it should read "owns and ships
  production AI systems," not "built a webpage."
- Leave the tab open for 2+ minutes and confirm the mascot/ship still show up, just noticeably less often.
- `npm run build` passes.
