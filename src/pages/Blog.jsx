import React, { useEffect, useState } from "react";
import { api } from "../api";
import PenguinLoader from "../components/PenguinLoader";
import { useSeo } from "../utils/seo";

const MEDIA_ACCEPT =
  "image/*,video/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif,.svg,.heic,.heif,.raw,.mp4,.mov,.avi,.mkv,.webm,.m4v,.3gp,.mpeg,.mpg,.wmv";

function MediaView({ item }) {
  if (!item?.url) return null;

  if (item.mediaType === "video") {
    return (
      <>
        <video controls className="h-56 w-full rounded-xl object-cover">
          <source src={item.url} />
        </video>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-emerald-700 hover:underline"
        >
          Open video in new tab
        </a>
      </>
    );
  }

  return (
    <>
      <img
        src={item.url}
        alt="Story"
        loading="lazy"
        decoding="async"
        className="h-56 w-full rounded-xl object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-xs text-emerald-700 hover:underline"
      >
        Open image file
      </a>
    </>
  );
}

export default function Blog() {
  useSeo({
    title: "Travel Stories Blog | Trippolama",
    description:
      "Read and share travel stories, photos, and short videos from real travelers on Trippolama.",
    canonical: "https://trippolama.com/blog",
    jsonLdId: "blog-page",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Trippolama Travel Stories",
      url: "https://trippolama.com/blog",
    },
  });

  const MAX_VIDEO_SECONDS = 60;
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/stories?limit=40");
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const getVideoDuration = (file) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Number(video.duration || 0);
        URL.revokeObjectURL(url);
        resolve(duration);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Invalid video"));
      };
      video.src = url;
    });

  const validateFiles = async (selectedFiles) => {
    const valid = [];
    for (const file of selectedFiles) {
      if (file.type.startsWith("video/")) {
        const duration = await getVideoDuration(file);
        if (duration > MAX_VIDEO_SECONDS) {
          alert(`Video "${file.name}" is longer than ${MAX_VIDEO_SECONDS} seconds`);
          continue;
        }
      }
      valid.push(file);
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLoggedIn = Boolean(localStorage.getItem("wtc_token"));
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    if (!title.trim()) {
      alert("Please enter story title");
      return;
    }

    try {
      setPosting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("location", location);
      Array.from(files || []).forEach((file) => {
        formData.append("media", file);
      });

      await api.post("/api/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setLocation("");
      setFiles([]);
      await loadStories();
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to post now");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Travel Stories & Blog</h1>
      <p className="mb-6 text-sm text-gray-600">
        Share your travel experience with text, photos, and videos.
      </p>

      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border bg-white p-4 md:p-5">
        <h2 className="text-lg font-semibold">Share Your Story</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title"
            className="rounded-xl border p-3 text-sm outline-none focus:border-emerald-500"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (optional)"
            className="rounded-xl border p-3 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Write your travel experience"
          className="mt-3 w-full rounded-xl border p-3 text-sm outline-none focus:border-emerald-500"
        />

        <input
          type="file"
          multiple
          accept={MEDIA_ACCEPT}
          onChange={async (e) => {
            const selected = Array.from(e.target.files || []);
            const checked = await validateFiles(selected);
            setFiles(checked);
          }}
          className="mt-3 block w-full text-sm"
        />
        <p className="mt-1 text-xs text-gray-500">Video max duration: 60 seconds per file.</p>

        <button
          type="submit"
          disabled={posting}
          className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post Story"}
        </button>
      </form>

      {loading ? <PenguinLoader compact message="Loading stories..." /> : null}

      {!loading && !stories.length ? (
        <p className="text-sm text-gray-600">No stories yet.</p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((story) => (
          <article key={story._id} className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{story.title}</h3>
                <p className="text-xs text-gray-500">
                  by {story.userName || "Traveler"}
                  {story.location ? ` - ${story.location}` : ""}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(story.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            {story.content ? <p className="mb-3 text-sm text-gray-700">{story.content}</p> : null}

            {Array.isArray(story.media) && story.media.length ? (
              <div className="grid gap-3">
                {story.media.map((item, idx) => (
                  <MediaView key={`${story._id}-${idx}`} item={item} />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}


