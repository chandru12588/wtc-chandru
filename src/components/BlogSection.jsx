import React from "react";
import { ArrowRight } from "lucide-react";
import blog1 from "../assets/blog1.jpg"
import blog2 from "../assets/blog2.png"
import blog3 from "../assets/blog3.webp"

const blogs = [
  {
    id: 1,
    title: "Top 5 Hidden Camping Spots in Tamil Nadu",
    desc: "Discover less-explored serene camping locations perfect for weekends.",
    category: "Travel Guide",
    image: blog1,
  },
  {
    id: 2,
    title: "Beginner’s Guide to First-Time Camping",
    desc: "Everything you need to know before planning your first camping trip.",
    category: "Camping Tips",
    image: blog2,
  },
  {
    id: 3,
    title: "Why Road Trips Heal the Soul",
    desc: "A deep dive into how nature + travel can change your mindset.",
    category: "Lifestyle",
    image: blog3,
  },
];

export default function BlogSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-lg font-semibold mb-6">Travel Stories & Blogs</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <div className="h-40 overflow-hidden">
              <img
                src={b.image}
                alt={b.title}
                className="w-full h-full object-cover hover:scale-110 transition duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {b.category}
              </span>

              <h3 className="text-base font-semibold mt-3 line-clamp-2">
                {b.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {b.desc}
              </p>

              <div className="mt-3 flex items-center text-sm text-emerald-600 group font-medium">
                Read More
                <ArrowRight
                  size={16}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
