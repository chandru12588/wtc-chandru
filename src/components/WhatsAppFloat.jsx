import { useState } from "react";
import { X } from "lucide-react";

export default function WhatsAppFloat() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed z-[9999] bottom-20 right-4 md:bottom-6 md:right-6">
      
      {/* Close button */}
      <button
        onClick={() => setShow(false)}
        className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow"
        aria-label="Close WhatsApp"
      >
        <X size={12} />
      </button>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping" />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/918248579662?text=Hi%20WrongTurnClub%20Team"
        target="_blank"
        rel="noopener noreferrer"
        className="
          relative z-10
          flex items-center justify-center
          w-14 h-14 md:w-16 md:h-16
          rounded-full bg-[#25D366]
          shadow-xl hover:scale-105 transition
        "
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp chat"
          className="w-8 h-8 md:w-9 md:h-9"
        />
      </a>
    </div>
  );
}
