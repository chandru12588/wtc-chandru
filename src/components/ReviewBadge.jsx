import React from "react";
import "./ReviewBadge.css";
import google from "../assets/google.png";
import insta from "../assets/insta (1).png";

export default function ReviewBadge() {
  return (
    <div className="review-badge-container">
      
      {/* ROTATING SVG TEXT */}
      <svg className="rotate-svg" viewBox="0 0 200 200">
        <defs>
          <path
            id="circlePath"
            d="
              M 100, 100
              m -80, 0
              a 80,80 0 1,1 160,0
              a 80,80 0 1,1 -160,0
            "
          />
        </defs>

        <text className="circle-text">
          <textPath href="#circlePath" startOffset="0%">
            2000+ REVIEWS • 2000+ REVIEWS • 2000+ REVIEWS • 
          </textPath>
        </text>
      </svg>

      {/* CENTER WHITE CIRCLE */}
      <div className="review-center">
        <div className="rating">4.9 ⭐</div>
        <div className="icons">
          <img src={google} alt="Google" />
          <img src={insta} alt="insta" />
        </div>
      </div>
    </div>
  );
}
