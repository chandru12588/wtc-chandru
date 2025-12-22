import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import user1 from "../assets/user1.png"
import user2 from "../assets/user2.png"
import user3 from "../assets/user3.png"

const testimonials = [
  {
    name: "Arun Kumar",
    review:
      "Amazing camping experience! Everything was perfectly arranged. Highly recommended!",
    rating: 5,
    img: user1,
  },
  {
    name: "Priya S",
    review:
      "The views were stunning and the campsite was very clean. A peaceful getaway.",
    rating: 4,
    img: user2,
  },
  {
    name: "Rohit Menon",
    review:
      "Lovely hosts, great food, and comfortable tents. Will book again!",
    rating: 5,
    img: user3,
  },
];

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);

  // Auto change every 4 sec
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold mb-6 text-center">
        What Our Travellers Say
      </h2>

      <div className="relative h-[200px] sm:h-[180px]">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 px-6
              ${i === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
          >
            <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-center">
              
              {/* Avatar */}
              <img
                src={t.img}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover border"
              />

              {/* Content */}
              <div>
                <p className="text-gray-700 text-sm mb-2">{t.review}</p>
                <p className="font-semibold">{t.name}</p>

                {/* Stars */}
                <div className="flex text-yellow-500 mt-1">
                  {Array(t.rating)
                    .fill()
                    .map((_, idx) => (
                      <Star key={idx} size={16} fill="gold" color="gold" />
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition 
              ${i === index ? "bg-emerald-600" : "bg-gray-300"}`}
          ></div>
        ))}
      </div>
    </div>
  );
}
