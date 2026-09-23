/* eslint-disable react/prop-types */
"use client";

import AgentRobot from "./AgentRobot";

export default function RobotMascot({ walking = false, stunt = null, sitting = false }) {
  return (
    <AgentRobot
      walking={walking}
      stunt={stunt}
      sitting={sitting}
      className="relative w-full h-full"
    />
  );
}
