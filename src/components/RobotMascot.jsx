/* eslint-disable react/prop-types */
"use client";

import AgentRobot from "./AgentRobot";

export default function RobotMascot({ walking = false, stunt = null }) {
  return (
    <AgentRobot
      walking={walking}
      stunt={stunt}
      className="relative w-full h-full drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
    />
  );
}
