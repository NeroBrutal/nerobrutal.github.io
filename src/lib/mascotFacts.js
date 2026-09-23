import data from "../data/data.json";

const FIRST = data.name.split(" ")[0];
const MAX_LEN = 120;

function clip(text) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_LEN) return clean;
  const cut = clean.slice(0, MAX_LEN);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

// A sentence ends at . ! ? followed by a capitalised word — so "B.Sc." and
// "ai.thekadee.com" don't cut it short.
function firstSentence(text) {
  const match = text.match(/^.*?[.!?](?=\s+[A-Z]|$)/);
  return (match ? match[0] : text).trim();
}

const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

function listOf(items, n = 4) {
  const names = items.slice(0, n);
  return names.length > 1
    ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`
    : names[0];
}

const jobs = data.sections.work_experience.items;
const current = jobs.filter((j) => /present/i.test(j.year));
const past = jobs.filter((j) => !/present/i.test(j.year));
const education = data.sections.education.items;

const FACTS = {
  main: [
    `Hi! I'm ${FIRST}'s AI sidekick. Click me and ask me anything about him.`,
    `${FIRST} is based in ${data.location}.`,
    `He's an ${listOf(data.roles, 3)}.`,
    `When he's not building AI, he's into ${listOf(data.hobbies.map((h) => h.toLowerCase()))}.`,
  ],
  work: [
    ...current.map((j) => `Right now: ${j.title} at ${j.company}.`),
    ...past.map((j) => `He worked as ${j.title} at ${j.company} (${j.year}).`),
    ...education
      .slice(-1)
      .map((e) => `At ${e.title}, he ${lcFirst(firstSentence(e.summary))}`),
  ],
  technologies: [
    `His go-to languages: ${listOf(data.programming_languages.map((l) => l.name), 5)}.`,
    ...data.technologies.map(
      (cat) => `${cat.category}: ${listOf(cat.technologies.map((t) => t.name))}.`,
    ),
  ],
  projects: data.projects.map((p) => `${p.title} — ${firstSentence(p.description)}`),
  contact: [
    `Want to work with ${FIRST}? The form's right here.`,
    `He's taking on freelance and contract work right now.`,
    `Not sure what to ask? Click me first — I know his whole profile.`,
  ],
};

const cursors = {};

/** Next fact for a section, cycling so he doesn't repeat himself. */
export function nextFact(sectionId) {
  const list = FACTS[sectionId] ?? FACTS.main;
  const i = cursors[sectionId] ?? 0;
  cursors[sectionId] = (i + 1) % list.length;
  return clip(list[i]);
}

export const SPACESHIP_LINES = [
  "Whoa — did you see that ship?!",
  "That's my ride home. Not today though.",
  "Mothership says hi.",
];
