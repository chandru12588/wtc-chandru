import React, { useMemo, useState } from "react";
import { ExternalLink, Mail, MessageCircle, Phone, Rocket, Route, Users } from "lucide-react";
import bg22 from "../assets/bg22-opt.webp";
import munnar from "../assets/munnar.webp";
import yercaud from "../assets/yercaud.webp";
import { useSeo } from "../utils/seo";

export default function AboutUs() {
  useSeo({
    title: "About Trippolama | Founder Story & Travel Vision",
    description:
      "Meet the founder of Trippolama and learn how travel passion became a startup for adventure stays and trips.",
    canonical: "https://trippolama.com/about",
    jsonLdId: "about-org",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Trippolama",
      url: "https://trippolama.com",
      email: "admin@trippolama.com",
      telephone: "+91-8248579662",
    },
  });

  const founderCandidates = useMemo(
    () => [
      "founder-photo.png",
      "founder-photo.jpg",
      "founder-photo.jpeg",
      "founder.png",
      "founder.jpg",
      "chandru-bike.png",
      "chandru-bike.jpg",
    ],
    []
  );
  const [founderIndex, setFounderIndex] = useState(0);
  const [imageMissing, setImageMissing] = useState(false);
  const founderSrc = `/${founderCandidates[founderIndex]}`;
  const founderLoaded = !imageMissing && founderIndex < founderCandidates.length;

  const highlights = useMemo(
    () => [
      {
        icon: Route,
        title: "Travel-First Mindset",
        text: "Roads, camps, and local stories shape every product decision at Trippolama.",
      },
      {
        icon: Users,
        title: "People Over Everything",
        text: "I love meeting new people, learning from them, and building for real travel needs.",
      },
      {
        icon: Rocket,
        title: "Builder Journey",
        text: "I recently learned the MERN stack and started turning a startup idea into a live platform.",
      },
    ],
    []
  );

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(110deg, rgba(15,23,42,0.72), rgba(15,23,42,0.28)), url(${bg22})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute -left-20 top-14 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl" />

        <div className="relative mx-auto flex min-h-[46vh] w-full max-w-7xl flex-col justify-center px-5 py-16 md:px-8">
          <p className="mb-3 inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90">
            About Trippolama
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Built by a traveler, for travelers.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/85 md:text-lg">
            My name is Chandru, founder of Trippolama. This is my journey from travel passion to building a startup.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 md:grid-cols-2 md:px-8">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">My Story</h2>
          <p className="mt-4 leading-8 text-slate-700">
            I am deeply passionate about travel and exploration. Every ride taught me something new: how to adapt,
            connect, and dream bigger. I enjoy meeting new people and understanding their stories, and that human side
            of travel inspired Trippolama.
          </p>
          <p className="mt-4 leading-8 text-slate-700">
            Recently, I learned the MERN stack and started building digital products around my startup idea. Trippolama
            is where my travel life and builder life meet in one platform.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://myblog-frontend-roan.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              View Portfolio <ExternalLink size={16} />
            </a>
            <a
              href="/blog"
              className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Read Blog
            </a>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-4 right-4 top-4 z-20 rounded-2xl border border-amber-200/50 bg-gradient-to-r from-black/80 via-slate-900/75 to-black/80 px-4 py-2.5 text-center shadow-xl backdrop-blur">
            <div className="mx-auto mb-1 inline-flex items-center rounded-full border border-amber-200/70 bg-amber-300/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-100">
              Est. 2026
            </div>
            <p className="bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 bg-clip-text text-base font-extrabold tracking-wide text-transparent drop-shadow-[0_0_10px_rgba(251,191,36,0.65)] md:text-xl">
              FOUNDER OF TRIPPOLAMA.COM
            </p>
            <p className="mt-0.5 text-xs font-semibold tracking-[0.2em] text-white/90 md:text-sm">
              CHANDRU
            </p>
          </div>
          {founderLoaded ? (
            <img
              src={founderSrc}
              alt="Founder of Trippolama"
              className="h-full min-h-[360px] w-full object-contain bg-slate-100"
              onError={() => {
                const next = founderIndex + 1;
                if (next < founderCandidates.length) {
                  setFounderIndex(next);
                } else {
                  setImageMissing(true);
                }
              }}
            />
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 px-6 text-center">
              <p className="text-lg font-semibold text-slate-700">Add your founder photo</p>
              <p className="mt-2 text-sm text-slate-600">
                Upload to <code className="rounded bg-white/70 px-1 py-0.5">frontend/public</code> as
                <code className="ml-1 rounded bg-white/70 px-1 py-0.5">founder-photo.png</code>
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-12 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Icon size={20} className="text-orange-500" />
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <div className="grid gap-6 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <img src={bg22} alt="Nature trail" className="h-56 w-full rounded-2xl object-cover sm:h-64" />
            <img src={munnar} alt="Mountain valley" className="h-56 w-full rounded-2xl object-cover sm:h-64" />
            <div className="sm:col-span-2">
              {founderLoaded ? (
                <img src={founderSrc} alt="Founder bike journey" className="h-64 w-full rounded-2xl object-contain bg-slate-100" />
              ) : (
                <img src={yercaud} alt="Travel hills" className="h-64 w-full rounded-2xl object-cover" />
              )}
            </div>
          </div>

          <div className="rounded-2xl p-2 md:p-4">
            <h2 className="text-2xl font-semibold">What I am building next</h2>
            <p className="mt-3 leading-8 text-slate-700">
              I am currently shaping Trippolama as a user-friendly travel startup with better discovery, safer booking,
              and a strong travel community. This is only the beginning.
            </p>
            <p className="mt-3 leading-8 text-slate-700">
              I continue documenting my travel experience and converting real road stories into better features for our
              users.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <a
              href="https://wa.me/918248579662"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
            >
              <MessageCircle size={18} />
              WhatsApp: +91 82485 79662
            </a>
            <a
              href="mailto:admin@trippolama.com"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
            >
              <Mail size={18} />
              admin@trippolama.com
            </a>
            <a
              href="tel:+918248579662"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
            >
              <Phone size={18} />
              +91 82485 79662
            </a>
            <a
              href="tel:+919003998623"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800"
            >
              <Phone size={18} />
              +91 90039 98623
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
