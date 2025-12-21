import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqList = [
  {
    q: "Is it safe for solo travellers?",
    a: "Yes! Our camps are carefully vetted and ideal for solo travellers with secure environment and verified hosts.",
  },
  {
    q: "Are washrooms available?",
    a: "Most camps provide clean Western-style washrooms. A few forest locations may have eco-toilets.",
  },
  {
    q: "Do you provide transportation?",
    a: "Transportation is not included unless mentioned. We do assist with ride-sharing groups.",
  },
  {
    q: "What should I pack?",
    a: "Carry warm clothes, torchlight, power bank, shoes, toiletries & your ID proof.",
  }
];

export default function FAQ() {

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>

      <div className="space-y-4">
        {faqList.map((item, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-4 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{item.q}</h3>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {openIndex === i && (
              <p className="mt-2 text-sm text-gray-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
