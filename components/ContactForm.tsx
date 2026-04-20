"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [formState, setFormState] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-wrapper">
          <div className="contact-info">
            <span className="badge">Get In Touch</span>
            <h2>Let&apos;s Start Your <span className="text-primary">Project</span></h2>
            <p>Ready for a premium plumbing or engineering solution? Our team is standing by to help you engineer excellence.</p>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon"><Phone size={20} /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+250 780 592 673</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>info@hydro-tronics.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Kigali, Rwanda</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container glass">
            {formState === "success" ? (
              <div className="success-message">
                <h3>Message Received!</h3>
                <p>One of our engineering consultants will be in touch with you shortly.</p>
                <button className="btn btn-primary" onClick={() => setFormState("idle")}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    id="name" 
                    type="text" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="project-type">Project Type</label>
                  <select 
                    id="project-type" 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="residential">Residential Plumbing</option>
                    <option value="commercial">Commercial Engineering</option>
                    <option value="maintenance">Preventative Maintenance</option>
                    <option value="emergency">Emergency Repair</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    placeholder="How can we help you?" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="btn-container">
                  <button type="submit" className="btn btn-primary" disabled={formState === "submitting"}>
                    {formState === "submitting" ? "Sending..." : "Send Message"}
                    <Send size={18} className="ml-2" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          background: #f8faff;
        }
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .contact-info h2 {
          font-size: 3.5rem;
          margin: 1.5rem 0;
        }
        .info-list {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .info-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .info-icon {
          color: var(--primary);
          padding: 0.75rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .info-item h4 {
          margin-bottom: 0.25rem;
        }
        .contact-form-container {
          padding: 3.5rem;
          border-radius: 32px;
          box-shadow: 0 30px 60px rgba(0, 74, 153, 0.1);
          background: white;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }
        input, select, textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e1e8f0;
          border-radius: 12px;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--primary);
        }
        .btn-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        .ml-2 { margin-left: 0.5rem; }
        .success-message {
          text-align: center;
          padding: 2rem 0;
        }
        .success-message h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }
        .success-message p {
          margin-bottom: 2rem;
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

        @media (max-width: 968px) {
          .contact-wrapper { grid-template-columns: 1fr; gap: 3rem; }
          .contact-info h2 { font-size: 2.5rem; }
        }
      `}</style>
    </section>
  );
}
