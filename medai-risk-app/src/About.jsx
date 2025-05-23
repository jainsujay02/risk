// src/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="px-6 py-12 max-w-4xl mx-auto space-y-8">
      {/* ─────────────  PROJECT  ───────────── */}
      <section>
        <h1 className="text-3xl font-semibold mb-2">
          MIDRAPR
        </h1>
        <p className="text-lg font-medium text-indigo-600 mb-4">
          Medical Imaging Dataset&nbsp;Risk Assessment&nbsp;&amp; Profile Registry
        </p>

        <p className="text-gray-700 leading-relaxed">
          MIDRAPR was created by <strong>Sujay Jain</strong>, a Computer Engineering
          student at UCLA who is passionate about trustworthy machine learning for
          medical imaging. The goal is to make it far simpler for clinicians,
          data scientists, and regulators to speak the same language about
          dataset quality and risk&nbsp;— long before an algorithm reaches
          patients.
        </p>
      </section>

      {/* ─────────────  PARTNERS  ───────────── */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">UCLA Connection Lab</h2>
        <p className="text-gray-700 leading-relaxed">
          Connection Lab explores the social impacts of networked technologies
          and stewards open-source tools that empower communities. Their support
          provided guidance on ethical technology design and user-centered
          workflows for this registry.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Internet Research Initiative</h2>
        <p className="text-gray-700 leading-relaxed">
          Funded through UCLA’s Internet Research Initiative (IRI), this project
          advances the IRI’s mission to promote an open, inclusive, and safe
          internet. The grant covered development time and cloud resources
          needed for the real-time risk dashboard you’re using.
        </p>
      </section>

      {/* ─────────────  CONTRIBUTE  ───────────── */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Contribute</h2>
        <p className="text-gray-700 leading-relaxed">
          MIDRAPR is <strong>fully open-source</strong> because we believe transparency and
          collaboration are essential for trustworthy medical AI. If you’d like
          to help improve the framework, add new risk-profile templates, or
          report an issue, head over to our GitHub repository and open an issue
          or pull request.
        </p>
        <a
          href="https://github.com/your-org/midrapr"
          target="_blank"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
        >
          Contribute on&nbsp;GitHub
        </a>
      </section>

      {/* ─────────────  CONTACT  ───────────── */}
      <section>
        <h2 className="text-xl font-semibold mb-1">Contact</h2>
        <p className="text-gray-700">
          Questions or feedback? Reach out on&nbsp;
          <a
            href="https://linkedin.com/in/jainsujay/"
            target="_blank"
            className="text-indigo-600 underline"
          >
            LinkedIn
          </a>{" "}
          or open an issue on the project repository.
        </p>
      </section>
    </div>
  );
}
