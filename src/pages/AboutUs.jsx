import React, { useMemo, useState } from "react";
import { ExternalLink, Rocket, Route, Users } from "lucide-react";
import bg22 from "../assets/bg22.jpg";
import munnar from "../assets/munnar.jpeg";
import bg3 from "../assets/bg3.jpg";

export default function AboutUs() {
  const [imageMissing, setImageMissing] = useState(false);

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

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {imageMissing ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 px-6 text-center">
              <p className="text-lg font-semibold text-slate-700">Add your founder photo</p>
              <p className="mt-2 text-sm text-slate-600">
                Upload image as <code className="rounded bg-white/70 px-1 py-0.5">public/founder-photo.png</code>
              </p>
            </div>
          ) : (
            <img
              src="/founder-photo.png"
              alt="Founder of Trippolama"
              className="h-full min-h-[360px] w-full object-cover"
              onError={() => setImageMissing(true)}
            />
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
          <img src={munnar} alt="Travel journey" className="h-64 w-full rounded-2xl object-cover md:h-full" />
          <div className="rounded-2xl p-2 md:p-4">
            <h2 className="text-2xl font-semibold">What I am building next</h2>
            <p className="mt-3 leading-8 text-slate-700">
              I am currently shaping Trippolama as a user-friendly travel startup with better discovery, safer booking,
              and a strong travel community. This is only the beginning.
            </p>
            <div
              className="mt-5 h-40 rounded-2xl"
              style={{
                backgroundImage: `linear-gradient(130deg, rgba(15,23,42,0.1), rgba(15,23,42,0.02)), url(${bg3})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
