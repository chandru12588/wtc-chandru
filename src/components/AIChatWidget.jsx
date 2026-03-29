import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { api } from "../api";

const WELCOME =
  "Hi! I am Trippolama AI Assistant. Ask me about packages, acting driver, bike rider service, guide service, or bookings.";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME },
  ]);

  const historyForApi = useMemo(
    () =>
      messages
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }))
        .filter((m) => m.content),
    [messages]
  );

  const sendMessage = async () => {
    const trimmed = String(input || "").trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai/chat", {
        message: trimmed,
        history: historyForApi,
      });
      const reply = String(res?.data?.reply || "").trim();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "I could not answer that right now. Please try again.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err?.response?.data?.message ||
            "Chat is temporarily unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl transition hover:scale-105 md:bottom-6 md:left-6"
        aria-label="Open AI chat assistant"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-[9999] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border bg-white shadow-2xl md:bottom-6 md:left-6">
      <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
        <h3 className="text-sm font-semibold">AI Travel Assistant</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded p-1 hover:bg-indigo-500"
          aria-label="Close AI chat assistant"
        >
          <X size={18} />
        </button>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto p-3">
        {messages.map((m, idx) => (
          <div
            key={`${m.role}-${idx}`}
            className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[90%] rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-600">
            Typing...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about services..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          disabled={loading}
          onClick={sendMessage}
          className="rounded-lg bg-indigo-600 p-2 text-white disabled:opacity-50"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
