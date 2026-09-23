"use client";

import SplitChapter from "./SplitChapter";
import AutomationWorkflow from "./AutomationWorkflow";

const Technologies = () => {
  return (
    <section id="technologies" className="relative pb-24">
      <SplitChapter
        eyebrow="Partners & stack"
        line1="TOOLS"
        line2="I SHIP WITH"
        subtitle="Frameworks, AI providers, and infrastructure behind the agents and products on this site."
        className="py-12 sm:py-16"
      />

      <AutomationWorkflow />
    </section>
  );
};

export default Technologies;
