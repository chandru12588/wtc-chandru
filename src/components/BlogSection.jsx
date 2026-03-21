import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";

function StoryCover({ story }) {
  const media = Array.isArray(story.media) ? story.media[0] : null;
  if (!media?.url) {
    return <div className="h-40 w-full bg-gradient-to-br from-emerald-100 to-slate-100" />;
  }

  if (media.mediaType === "video") {
    return (
      <video className="h-40 w-full object-cover" muted playsInline>
        <source src={media.url} />
      </video>
    );
  }

  return <img src={media.url} alt={story.title} className="h-40 w-full object-cover" />;
}

export default function BlogSection() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/stories?limit=3");
        setStories(Array.isArray(res.data) ? res.data : []);
      } catch {
        setStories([]);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Travel Stories & Blogs</h2>
        <Link to="/blog" className="text-sm font-medium text-emerald-700 hover:underline">
          View All
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {stories.length ? (
          stories.map((story) => (
            <Link
              to="/blog"
              key={story._id}
              className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <StoryCover story={story} />

              <div className="p-4">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
                  Story by {story.userName || "Traveler"}
                </span>

                <h3 className="mt-3 line-clamp-2 text-base font-semibold">{story.title}</h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{story.content || "Shared from Trippolama community"}</p>

                <div className="group mt-3 flex items-center text-sm font-medium text-emerald-600">
                  Read More
                  <ArrowRight
                    size={16}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-600">No stories yet. Be the first traveler to share your journey.</p>
        )}
      </div>
    </div>
  );
}
