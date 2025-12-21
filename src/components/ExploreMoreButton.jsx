import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExploreMoreButton() {
  return (
    <div className="flex justify-center mt-8">
      <Link
        to="/trips"
        className="
          bg-orange-500 hover:bg-orange-600 
          text-white px-8 py-3 rounded-full font-semibold 
          flex items-center gap-2 shadow-md hover:shadow-lg 
          transition-all duration-300 group
        "
      >
        Explore More
        <ArrowRight
          size={18}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
      </Link>
    </div>
  );
}
