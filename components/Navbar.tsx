"use client";

import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "glass shadow-md py-4" : "bg-transparent py-6"}`}>
      <div className="container flex justify-between items-center">
        <div className={`flex items-center gap-2 transition-colors ${isScrolled ? "text-dark" : "text-white"}`}>
          <Logo size={40} color={isScrolled ? "#000" : "#fff"} />
          <span className="text-2xl font-bold tracking-tight">Rwanda Water Resources Eng.</span>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center gap-8 font-semibold transition-colors ${isScrolled ? "text-dark" : "text-white"}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="#about" className="nav-link">About</a>
          <a href="/admin/login" className="btn btn-primary">Get Started</a>
        </div>


        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 text-black">
          <a href="#home" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#services" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#about" className="nav-link-mobile" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="/admin/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Get Started</a>
        </div>
      )}

      <style jsx>{`
        nav {
          transition: all 0.3s ease;
        }
        .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hidden { display: none; }
        @media (min-width: 768px) {
          .hidden { display: flex; }
          .md\:hidden { display: none; }
        }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .fixed { position: fixed; }
        .w-full { width: 100%; }
        .z-50 { z-index: 50; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .bg-transparent { background: transparent; }
        .bg-primary { background: var(--primary); }
        .text-white { color: white; }
        .text-primary { color: var(--primary); }
        .text-2xl { font-size: 1.5rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .rounded-lg { border-radius: 0.5rem; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
        .nav-link {
          color: inherit;
          text-decoration: none;
          position: relative;
        }
        .nav-link:hover {
          opacity: 0.8;
        }
        .nav-link-mobile {
          color: black;
          font-weight: 600;
          text-decoration: none;
        }
        .text-dark { color: #000; }
        .text-white { color: #fff; }
        .transition-colors { transition: color 0.3s ease; }
      `}</style>
    </nav>
  );
}
