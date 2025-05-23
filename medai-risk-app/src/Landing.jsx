// src/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Landing / hero section
 *  – **Content is IDENTICAL** to the original (same heading, paragraph & CTA labels)
 *  – Polished layout, subtle background gradient, responsive two-column on lg screens
 *  – Pure Tailwind, no extra dependencies
 */
export default function Landing() {
  return (
    <main className="relative isolate overflow-hidden bg-white">
      {/* ── decorative blurred blob ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-sky-300 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />
      </div>

      {/* ───────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-3xl gap-16 lg:max-w-none lg:grid-cols-2 lg:items-center">
          {/* ── TEXT COLUMN ── */}
          <section className="space-y-10 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Assess Medical Imaging Datasets &mdash; Before You Publish
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed">
              The Medical Imaging Dataset Risk Assessment &amp; Profile Registry helps researchers, companies and institutions
              releasing medical imaging datasets comprehensively assess and
              report risks <em>early</em>. Answer a quick checklist tailored to
              each imaging modality and region, see an instant risk score with
              recommendations for mitigation where possible.
            </p>

            {/* ── CTA BUTTONS ── */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/datasets"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Explore&nbsp;Datasets
              </Link>

              <Link
                to="/add"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-blue-600 px-6 py-3 text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Add&nbsp;Your&nbsp;Dataset
              </Link>

              <Link
                to="/framework"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-400 px-6 py-3 text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                Read&nbsp;the&nbsp;Framework
              </Link>
            </div>
          </section>

          {/* ── HERO IMAGE ── */}
          <figure className="mx-auto w-full max-w-lg lg:max-w-none">
            <img
              src="/landinghero.png"
              alt="Medical imaging, dataset and AI risk hero"
              className="w-full rounded-xl shadow-lg ring-1 ring-gray-200"
            />
          </figure>
        </div>
      </div>
    </main>
  );
}
