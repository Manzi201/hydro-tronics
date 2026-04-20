"use client";

import { Wrench, Zap, Waves, Building2, ShieldCheck, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container relative z-10">
        <div className="hero-content">
          <h1 className="hero-title animate-in fade-in slide-in-from-bottom-8 duration-700">
            Engineering the <span className="text-gradient">Flow</span> of the Future
          </h1>
          <p className="hero-subtitle animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            We provide modern electronic plumbing solutions, smart water systems, and quality plumbing materials for homes in Kigali. Reliable, efficient, and professional service guaranteed.
          </p>
          <div className="hero-actions animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a href="#contact" className="btn btn-primary btn-lg">Schedule Consultation</a>
            <a href="#services" className="btn btn-outline btn-lg ml-4">Our Expertise</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: center;
          position: relative;
          background: url('/hero-bg.png') center/cover no-repeat;
          color: white;
          overflow: hidden;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 74, 153, 0.85) 0%, rgba(0, 163, 224, 0.4) 100%);
        }
        .hero-content {
          max-width: 800px;
        }
        .hero-title {
          font-size: 4.5rem;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          color: white;
        }
        .text-gradient {
          background: linear-gradient(to right, #ffffff, #88d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .relative { position: relative; }
        .z-10 { z-index: 10; }
        .btn-lg {
          padding: 0.9rem 2.2rem;
          font-size: 1rem;
        }
        .ml-4 { margin-left: 1rem; }
        .btn-outline {
          border-color: white;
          color: white;
        }
        .btn-outline:hover {
          background: white;
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 1.1rem; }
          .hero-actions { display: flex; flex-direction: column; gap: 1rem; }
          .ml-4 { margin-left: 0; }
        }
      `}</style>
    </section>
  );
}
