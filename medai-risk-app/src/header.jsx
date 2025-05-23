// src/Header.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

/* ────────── tiny helper ────────── */
const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "px-3 py-2 rounded-md transition-colors duration-150",
        "hover:bg-indigo-50 hover:text-indigo-700",          // prettier hover
        isActive
          ? "text-indigo-700 font-semibold bg-indigo-50"     // active style
          : "text-gray-600"
      ].join(" ")
    }
  >
    {children}
  </NavLink>
);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ─────── Logo / Brand ─────── */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent"
        >
          MIDRAPR
        </Link>

        {/* ─────── desktop nav ─────── */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/datasets">Datasets</NavItem>
          <NavItem to="/add">Add&nbsp;Dataset</NavItem>
          <NavItem to="/framework">Framework</NavItem>
          <NavItem to="/about">About</NavItem>
        </nav>

        {/* ─────── mobile hamburger ─────── */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {/* heroicons outline/menu & x-mark */}
          {mobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ─────── mobile dropdown ─────── */}
      {mobileOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-1 text-sm font-medium">
          <NavItem to="/"          onClick={() => setMobileOpen(false)}>Home</NavItem>
          <NavItem to="/datasets"  onClick={() => setMobileOpen(false)}>Datasets</NavItem>
          <NavItem to="/add"       onClick={() => setMobileOpen(false)}>Add&nbsp;Dataset</NavItem>
          <NavItem to="/framework" onClick={() => setMobileOpen(false)}>Framework</NavItem>
          <NavItem to="/about"     onClick={() => setMobileOpen(false)}>About</NavItem>
        </nav>
      )}
    </header>
  );
}
