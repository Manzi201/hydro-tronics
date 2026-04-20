"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, LogIn } from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "hyrdotronicseng@gmail.com" && password === "hydro2024") {
      localStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      {/* Background Decorative Logo */}
      <div className="bg-logo-wrapper">
        <Logo size={600} />
      </div>

      <div className="login-card glass">
        <div className="login-header">
          <Logo size={64} />
          <h2>Hydro-Tronics <span className="text-primary">Admin</span></h2>
          <p>Login to manage your business portal</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-alert">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="user"><User size={18} /> Username</label>
            <input 
              id="user"
              type="text" 
              placeholder="Enter username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="pass"><Lock size={18} /> Password</label>
            <input 
              id="pass"
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            <LogIn size={18} className="mr-2" /> Sign In
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000c1a;
          position: relative;
          overflow: hidden;
        }
        .bg-logo-wrapper {
          position: absolute;
          right: -150px;
          bottom: -150px;
          z-index: 0;
          pointer-events: none;
          filter: grayscale(1) opacity(0.06);
        }
        .login-card {
          width: 100%;
          max-width: 450px;
          padding: 3.5rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 1;
        }
        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .login-header h2 {
          margin-top: 1.5rem;
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: white;
        }
        .login-header p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 600;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .form-group label {
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        input {
          padding: 1.1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          font-size: 1rem;
          transition: all 0.3s;
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        input:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(0, 115, 230, 0.1);
        }
        .w-full { width: 100%; }
        .mr-2 { margin-right: 0.5rem; }
      `}</style>
    </div>
  );
}

