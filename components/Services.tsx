"use client";

import { Wrench, Zap, Waves, Building2, ShieldCheck, Clock } from "lucide-react";

const services = [
  {
    icon: <Wrench size={32} />,
    title: "Precision Plumbing",
    description: "Expert installation and repair of complex plumbing systems with surgical precision."
  },
  {
    icon: <Zap size={32} />,
    title: "Eco-Engineering",
    description: "Sustainable water heating and management systems designed for peak efficiency."
  },
  {
    icon: <Waves size={32} />,
    title: "Filtration Systems",
    description: "Advanced water purification and softening technology for residential and commercial use."
  },
  {
    icon: <Building2 size={32} />,
    title: "Commercial Projects",
    description: "Large-scale infrastructure engineering for multi-story buildings and industrial complexes."
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Preventative Care",
    description: "Comprehensive maintenance plans to ensure your systems remain in perfect condition."
  },
  {
    icon: <Clock size={32} />,
    title: "24/7 Response",
    description: "Emergency support for critical plumbing and engineering failures, anytime, anywhere."
  }
];

export default function Services() {
  return (
    <section id="services" className="services-section bg-accent">
      <div className="container">
        <div className="section-header">
          <span className="badge">Our Services</span>
          <h2>World-Class <span className="text-primary">Expertise</span></h2>
          <p>We provide a comprehensive range of engineering and plumbing services tailored to your specific needs.</p>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services-section {
          background-color: var(--accent);
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        .section-header h2 {
          font-size: 3rem;
          margin: 1rem 0;
        }
        .badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(0, 74, 153, 0.1);
          color: var(--primary);
          border-radius: 50px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .service-card {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: var(--shadow);
          border: 1px solid transparent;
        }
        .service-card:hover {
          transform: translateY(-10px);
          border-color: rgba(0, 74, 153, 0.2);
          box-shadow: 0 20px 40px rgba(0, 74, 153, 0.1);
        }
        .service-icon {
          color: var(--primary);
          margin-bottom: 1.5rem;
          display: inline-block;
          padding: 1rem;
          background: var(--accent);
          border-radius: 16px;
        }
        .service-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .service-card p {
          font-size: 1rem;
        }
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; }
          .section-header h2 { font-size: 2.2rem; }
          .service-card { padding: 2rem; }
        }
        @media (max-width: 480px) {
          .section-header h2 { font-size: 1.8rem; }
          .service-card { padding: 1.5rem; border-radius: 16px; }
          .service-card h3 { font-size: 1.2rem; }
          .service-card p { font-size: 0.9rem; }
        }
      `}</style>
    </section>
  );
}
