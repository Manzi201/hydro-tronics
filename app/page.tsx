"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Logo from "@/components/Logo";
import { Droplets, Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [formState, setFormState] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: ""
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    
    const { error } = await supabase
      .from('consultations')
      .insert([
        { 
          client_name: formData.name, 
          email: formData.email, 
          project_type: formData.type, 
          message: formData.message 
        }
      ]);

    if (error) {
      alert("Error: " + error.message);
      setFormState("idle");
    } else {
      setFormState("success");
      setFormData({ name: "", email: "", type: "", message: "" });
    }
  };
  return (
    <main>
      <Navbar />
      <Hero />
      
      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>25+</h3>
              <p>Years of Excellence</p>
            </div>
            <div className="stat-item">
              <h3>1500+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Expert Engineers</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .stats-section {
            padding: 4rem 0;
            background: var(--primary);
            color: white;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            text-align: center;
          }
          .stat-item h3 {
            font-size: 3rem;
            margin-bottom: 0.5rem;
          }
          .stat-item p {
            color: rgba(255, 255, 255, 0.8);
            font-weight: 600;
          }
        `}</style>
      </section>

      <Services />
      <Portfolio />

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-wrapper">
             <div className="founder-card glass">
                <div className="founder-image">
                   <img src="/ceo.png" alt="Jean Aime BIKORIMANA - Founder & CEO" />
                </div>
                <div className="founder-badge">Founder & CEO</div>
             </div>
            <div className="about-content">
              <span className="subtitle">Who We Are</span>
              <h2>Hydro-Tronics <span className="text-primary">Eng.</span></h2>
              <p>
                Founded on the principles of innovation and reliability, Hydro-Tronics Eng. is at the forefront of modern plumbing engineering and water management systems in Kigali.
              </p>
              <div className="founder-brief">
                 <h4>Jean Aime BIKORIMANA</h4>
                 <p className="font-bold text-primary mb-2">Founder & CEO</p>
                 <p>Driven by a commitment to excellence, Jean Aime BIKORIMANA pioneers sustainable water solutions that protect our environment while serving our growing community.</p>
              </div>
              <div className="about-features">
                <div className="feature flex items-center gap-3">
                  <div className="feature-icon"><Droplets size={20} /></div>
                  <span>Water Stewardship</span>
                </div>
                <div className="feature flex items-center gap-3">
                  <div className="feature-icon"><Droplets size={20} /></div>
                  <span>Engineering Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .about-wrapper {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 5rem;
            align-items: center;
          }
          .founder-card {
            padding: 1.5rem;
            border-radius: 32px;
            position: relative;
            transform: rotate(-2deg);
            transition: all 0.5s;
          }
          .founder-card:hover { transform: rotate(0deg) scale(1.02); }
          .founder-image {
            border-radius: 20px;
            overflow: hidden;
            aspect-ratio: 1/1.1;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }
          .founder-image img { width: 100%; height: 100%; object-fit: cover; }
          .founder-badge {
            position: absolute;
            bottom: 0;
            right: -20px;
            background: var(--primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          .about-content h2 {
            font-size: 4rem;
            margin-bottom: 2rem;
            font-weight: 800;
          }
          .founder-brief {
            margin: 2rem 0;
            padding-left: 1.5rem;
            border-left: 4px solid var(--primary);
          }
          .founder-brief h4 { color: #333; margin-bottom: 0.5rem; }
          .subtitle {
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
          .mt-8 { margin-top: 2rem; }
          .about-image-stack {
            position: relative;
          }
          .image-main {
            padding: 1rem;
            border-radius: 32px;
            box-shadow: var(--shadow);
            background: white;
          }
          .water-text {
            font-size: 3.5rem;
            font-weight: 900;
            line-height: 1.2;
            letter-spacing: 2px;
            background: linear-gradient(180deg, #00a3e0 20%, #004a99 80%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-transform: uppercase;
            filter: drop-shadow(0 10px 20px rgba(0, 74, 153, 0.2));
            animation: waterFlow 5s infinite alternate ease-in-out;
          }
          @keyframes waterFlow {
            from { background-position: 0% 50%; }
            to { background-position: 100% 50%; }
          }
          .social-links-enhanced {
            display: flex;
            gap: 2.5rem;
            margin-top: 2rem;
          }
          .social-icon {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: white;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(255,255,255,0.1);
          }
          .social-icon:hover {
            transform: translateY(-5px) scale(1.1);
            background: var(--primary);
            box-shadow: 0 10px 20px rgba(0, 74, 153, 0.3);
            border-color: transparent;
          }
          .social-icon.facebook:hover { background: #1877F2; }
          .social-icon.twitter:hover { background: #1DA1F2; }
          .social-icon.linkedin:hover { background: #0A66C2; }

          .image-placeholder {
            height: 400px;
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          @media (max-width: 968px) {
            .about-wrapper { grid-template-columns: 1fr; gap: 3rem; }
            .about-content h2 { font-size: 2.5rem; }
          }
        `}</style>
      </section>



      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            {/* Left Section: Brand & Links */}
            <div className="footer-main-info">
              <div className="flex items-center gap-4 mb-4">
                <Logo size={45} color="white" />
                <h3 className="text-xl font-bold text-white tracking-tight">Hydro-Tronics Eng</h3>
              </div>
              <p className="footer-tagline mb-10 opacity-70">
                Supply of durable plumbing products and modern engineering solutions in Kigali. Hydro-Tronics Eng. is dedicated to innovation and precision.
              </p>
              
              <div className="social-links-square">
                <a href="https://facebook.com/hydrotronicsrwanda" target="_blank" rel="noopener noreferrer" className="sq-social" aria-label="Facebook">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5.01 3.66 9.15 8.44 9.9v-7h-2.54V12.06h2.54V9.67c0-2.51 1.5-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
                </a>
                <a href="https://linkedin.com/company/hydrotronics-rwanda" target="_blank" rel="noopener noreferrer" className="sq-social" aria-label="LinkedIn">
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H6.5v-7H9v7zM7.75 8.75a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9.75 8.25h-2.5v-3.5c0-.83-.02-1.9-1.16-1.9-1.16 0-1.34.91-1.34 1.84v3.56h-2.5v-7h2.4v.96h.04c.33-.63 1.14-1.29 2.34-1.29 2.5 0 2.97 1.65 2.97 3.78v3.55z"/></svg>
                </a>
                <a href="https://x.com/hydrotronicsrw" target="_blank" rel="noopener noreferrer" className="sq-social" aria-label="Twitter">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Right Section: Form with Sidebar */}
            <div className="footer-form-container">
              <div className="form-with-sidebar">
                <div className="form-sidebar">
                  <div className="sidebar-logo">
                    <Logo size={50} color="var(--primary)" />
                  </div>
                  <h3>Let&apos;s Build Success</h3>
                  <p>Our engineering team delivers precision plumbing control and smart water solutions across Kigali.</p>
                  
                  <div className="sidebar-contacts mt-auto">
                    <div className="s-contact">
                      <Phone size={14} className="text-primary" />
                      <span>+250 780 592 673</span>
                    </div>
                    <div className="s-contact">
                      <Mail size={14} className="text-primary" />
                      <span>info@hydro-tronics.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-content">
                  {formState === "success" ? (
                    <div className="success-footer">
                      <h5 className="text-blue-400 font-bold mb-2 text-lg">Message Received!</h5>
                      <p className="text-sm opacity-70 mb-6">We will reach out to you within 24 hours.</p>
                      <button className="btn btn-primary btn-sm" onClick={() => setFormState("idle")}>Send Again</button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="footer-actual-form">
                      <div className="form-row">
                        <div className="form-group-sm">
                          <input 
                            type="text" 
                            placeholder="Full Name" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="form-group-sm">
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-group-sm">
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          required
                          title="Select Project Scope"
                        >
                          <option value="">Select Project Scope</option>
                          <option value="residential">Residential Installation</option>
                          <option value="commercial">Commercial System</option>
                          <option value="maintenance">Maintenance Contract</option>
                        </select>
                      </div>
                      <div className="form-group-sm">
                        <textarea 
                          placeholder="Tell us about your requirements..." 
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" disabled={formState === "submitting"} className="btn btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider">
                        {formState === "submitting" ? "Sending..." : "Request Consultation"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Hydro-Tronics Eng. All rights reserved.</p>
          </div>
        </div>
        <style jsx>{`
          .footer {
            background: #000c1a;
            color: white;
            padding: 80px 0 40px;
            position: relative;
            border-top: 1px solid rgba(255,255,255,0.05);
          }
          .footer-gradient-text {
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
            font-size: 1.1rem;
            letter-spacing: 1px;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .footer::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            opacity: 0.5;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 5rem;
            margin-bottom: 4rem;
          }
          .footer-main-info h3 {
            font-size: 1.5rem;
          }
          .footer-links-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .link-group h4 {
            font-size: 1.1rem;
            margin-bottom: 1.2rem;
            color: white;
          }
          .form-with-sidebar {
            display: grid;
            grid-template-columns: 0.8fr 1.2fr;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            overflow: hidden;
          }
          .form-sidebar {
            background: rgba(255,255,255,0.02);
            padding: 2.5rem;
            border-right: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
          }
          .sidebar-logo {
             margin-bottom: 1.5rem;
             display: flex;
             align-items: center;
             justify-content: center;
             width: 80px;
             height: 80px;
             background: rgba(255,255,255,0.03);
             border-radius: 16px;
          }
          .form-sidebar h3 {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            color: white;
          }
          .form-sidebar p {
            font-size: 0.9rem;
            opacity: 0.6;
            line-height: 1.5;
          }
          .sidebar-contacts {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .s-contact {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.8rem;
            opacity: 0.8;
          }
          .form-content {
            padding: 2.5rem;
          }
          .footer-actual-form {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
          }
          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
          .form-group-sm input, .form-group-sm select, .form-group-sm textarea {
            width: 100%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 0.85rem;
            color: white;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.3s;
          }
          .form-group-sm select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 1rem center;
            padding-right: 2.5rem;
            cursor: pointer;
          }
          .form-group-sm select option {
            background-color: #0b1120;
            color: white;
            padding: 1rem;
          }
          .form-group-sm textarea { resize: none; }
          .form-group-sm input:focus, .form-group-sm select:focus, .form-group-sm textarea:focus {
            border-color: var(--primary);
            background: rgba(255,255,255,0.08);
            box-shadow: 0 0 0 4px rgba(0, 163, 224, 0.1);
          }
          .social-links-square {
            display: flex;
            gap: 1.2rem;
          }
          .sq-social {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.6);
            transition: all 0.3s;
          }
          .sq-social:hover {
            background: var(--primary);
            color: white;
            border-color: transparent;
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 74, 153, 0.2);
          }
          .footer-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
          }
          .footer-list a {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            transition: color 0.3s;
          }
          .footer-list a:hover {
            color: white;
          }
          .mt-10 { margin-top: 2.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .success-footer {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          @media (max-width: 1024px) {
            .footer-grid { grid-template-columns: 1fr; gap: 4rem; }
            .form-with-sidebar { grid-template-columns: 1fr; }
            .form-sidebar { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          }
          @media (max-width: 640px) {
            .form-row { grid-template-columns: 1fr; }
          }

          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr; gap: 3rem; }
          }
        `}</style>
      </footer>
    </main>
  );
}
