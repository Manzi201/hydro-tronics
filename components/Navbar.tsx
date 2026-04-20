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

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "glass shadow-md py-4" : "bg-transparent py-6"}`}>
      <div className="container flex justify-between items-center">
        <div className={`flex items-center gap-2 transition-colors ${isScrolled ? "text-dark" : "text-white"}`}>
          <Logo size={40} color={isScrolled ? "#000" : "#fff"} />
          <span className="text-2xl font-bold tracking-tight">Hydro-Tronics Eng.</span>
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
        <button className="mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isMenuOpen ? "active" : ""}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Logo size={36} color="#fff" />
          <span className="sidebar-brand">Hydro-Tronics Eng.</span>
          <button className="sidebar-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div className="sidebar-links">
          <a href="#home" onClick={() => setIsMenuOpen(false)}>
            <span className="link-dot"></span> Home
          </a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>
            <span className="link-dot"></span> Services
          </a>
          <a href="#portfolio" onClick={() => setIsMenuOpen(false)}>
            <span className="link-dot"></span> Portfolio
          </a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>
            <span className="link-dot"></span> About
          </a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>
            <span className="link-dot"></span> Contact
          </a>
        </div>
        <div className="sidebar-bottom">
          <a href="/admin/login" className="btn btn-primary sidebar-cta" onClick={() => setIsMenuOpen(false)}>
            Get Started
          </a>
          <p className="sidebar-copy">&copy; 2024 Hydro-Tronics Eng.</p>
        </div>
      </div>

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
          .mobile-toggle { display: none !important; }
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
        .text-white { color: white; }
        .text-2xl { font-size: 1.5rem; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .nav-link {
          color: inherit;
          text-decoration: none;
          position: relative;
        }
        .nav-link:hover {
          opacity: 0.8;
        }
        .text-dark { color: #000; }
        .transition-colors { transition: color 0.3s ease; }

        /* Mobile Toggle Button */
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: inherit;
          padding: 0.5rem;
          z-index: 200;
        }
        @media (max-width: 767px) {
          .mobile-toggle { display: flex; align-items: center; }
        }

        /* ===== SIDEBAR OVERLAY ===== */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 90;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* ===== MOBILE SIDEBAR ===== */
        .mobile-sidebar {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          height: 100vh;
          background: linear-gradient(180deg, #0a1628 0%, #0d2137 40%, #0a1628 100%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          transition: right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3);
        }
        .mobile-sidebar.open {
          right: 0;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-brand {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          flex: 1;
        }
        .sidebar-close {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .sidebar-close:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .sidebar-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
        }
        .sidebar-links a {
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-weight: 600;
          font-size: 1.05rem;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .sidebar-links a:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
          border-left-color: var(--primary);
        }
        .link-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          opacity: 0.6;
        }
        .sidebar-links a:hover .link-dot {
          opacity: 1;
          box-shadow: 0 0 8px var(--primary);
        }

        .sidebar-bottom {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-cta {
          width: 100%;
          text-align: center;
          padding: 0.85rem 1.5rem;
          font-size: 0.95rem;
        }
        .sidebar-copy {
          text-align: center;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .mobile-sidebar { display: none; }
          .sidebar-overlay { display: none; }
        }
        @media (max-width: 768px) {
          .text-2xl { font-size: 1.2rem; }
          nav .container { padding: 0 1rem; }
        }
        @media (max-width: 480px) {
          .text-2xl { font-size: 1rem; }
          .mobile-sidebar { width: 260px; }
        }
      `}</style>
    </nav>
  );
}
