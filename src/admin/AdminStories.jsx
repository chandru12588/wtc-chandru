import React, { useEffect, useState } from "react";
import { api } from "../api.js";

const MEDIA_ACCEPT =
  "image/*,video/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.bmp,.tiff,.tif,.svg,.heic,.heif,.raw,.mp4,.mov,.avi,.mkv,.webm,.m4v,.3gp,.mpeg,.mpg,.wmv";

function MediaPreview({ item }) {
  if (!item?.url) return null;
  if (item.mediaType === "video") {
    return (
      <video controls className="h-48 w-full rounded-xl object-cover">
        <source src={item.url} />
      </video>
    );
  }
  return <img src={item.url} alt="Story media" className="h-48 w-full rounded-xl object-cover" />;
}

export default function AdminStories() {
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
      const res = await api.get("/api/admin/stories");
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("ADMIN STORIES LOAD ERROR:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      Array.from(files || []).forEach((file) => formData.append("media", file));

      await api.post("/api/admin/stories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setLocation("");
      setFiles([]);
      await loadStories();
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to post story");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story?")) return;
    try {
      await api.delete(`/api/admin/stories/${id}`);
      setStories((prev) => prev.filter((story) => story._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to delete story");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Travel Experience Stories</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border bg-white p-4 md:p-5">
        <h3 className="text-lg font-semibold">Post New Story</h3>
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
            placeholder="Location"
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
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
          className="mt-3 block w-full text-sm"
        />

        <button
          type="submit"
          disabled={posting}
          className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {posting ? "Posting..." : "Post Story"}
        </button>
      </form>

      {loading ? <p className="text-sm text-gray-500">Loading stories...</p> : null}

      {!loading && !stories.length ? <p className="text-sm text-gray-500">No stories yet.</p> : null}

      <div className="grid gap-5 md:grid-cols-2">
        {stories.map((story) => (
          <article key={story._id} className="rounded-2xl border bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{story.title}</h3>
                <p className="text-xs text-gray-500">
                  {story.location ? `${story.location} • ` : ""}
                  {new Date(story.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(story._id)}
                className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
              >
                Delete
              </button>
            </div>

            {story.content ? <p className="mb-3 text-sm text-gray-700">{story.content}</p> : null}

            {Array.isArray(story.media) && story.media.length > 0 ? (
              <div className="grid gap-3">
                {story.media.map((item, idx) => (
                  <MediaPreview key={`${story._id}-${idx}`} item={item} />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
