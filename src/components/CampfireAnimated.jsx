import React from "react";
import "./campfire-anim.css";

export default function CampfireAnimated({ size = 55 }) {
  return (
    <div
      className="campfire-wrapper"
      style={{
        width: size,
        height: size,
      }}
    >
      <div className="heat-wave"></div>

      <svg
        viewBox="0 0 200 200"
        className="campfire-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Flame */}
        <path
          className="flame flame-1"
          d="M100 20C140 50 150 120 100 150C50 120 60 50 100 20Z"
          fill="#E34230"
          stroke="#7A1F15"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Middle Flame */}
        <path
          className="flame flame-2"
          d="M100 70C125 90 130 130 100 145C70 130 75 90 100 70Z"
          fill="#F28C28"
          stroke="#7A1F15"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Inner Flame */}
        <path
          className="flame flame-3"
          d="M100 105C112 115 114 135 100 142C86 135 88 115 100 105Z"
          fill="#FFD23F"
          stroke="#7A1F15"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Logs */}
        <line
          x1="60"
          y1="170"
          x2="140"
          y2="190"
          stroke="#5A2A1A"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <line
          x1="140"
          y1="170"
          x2="60"
          y2="190"
          stroke="#5A2A1A"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>

      {/* Smoke */}
      <div className="smoke smoke-1"></div>
      <div className="smoke smoke-2"></div>

      {/* Sparks */}
      <div className="spark spark-1"></div>
      <div className="spark spark-2"></div>
      <div className="spark spark-3"></div>
    </div>
  );
}
