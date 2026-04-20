"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/250780592673?text=${encodedMessage}`, "_blank");
    setMessage("");
  };

  return (
    <>
      <div className="wa-widget-container">
        {isOpen && (
          <div className="wa-chat-window">
            <div className="wa-header">
              <div className="wa-header-info">
                <div className="wa-avatar">H</div>
                <div>
                  <h4 className="wa-title">Hydro-Tronics Eng.</h4>
                  <p className="wa-subtitle">Typically replies instantly</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="wa-close-btn" 
                aria-label="Close chat" 
                title="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="wa-chat-body">
              <div className="wa-message-bubble">
                <p>
                  Hello 👋, thank you for contacting Hydro-Tronics Eng.
                  We specialize in smart plumbing solutions and product supply.
                  How can we assist you today?
                </p>
                <span className="wa-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <form onSubmit={handleSend} className="wa-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                className="wa-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="wa-send-btn" 
                aria-label="Send message" 
                title="Send message"
              >
                <Send size={18} style={{ transform: 'translate(-1px, 1px)' }} />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="wa-toggle-btn"
          aria-label="Toggle WhatsApp chat"
          title="Toggle WhatsApp chat"
        >
          <WhatsAppIcon size={32} />
        </button>
      </div>

      <style jsx>{`
        .wa-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .wa-chat-window {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          margin-bottom: 16px;
          width: 320px;
          overflow: hidden;
          border: 1px solid #eaeaea;
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .wa-header {
          background: #075e54;
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .wa-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wa-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          color: #075e54;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .wa-title {
          font-weight: bold;
          margin: 0;
          font-size: 15px;
        }

        .wa-subtitle {
          margin: 0;
          font-size: 12px;
          color: #d1f4cc;
        }

        .wa-close-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        
        .wa-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .wa-chat-body {
          background-color: #efeae2;
          background-image: url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png');
          background-size: cover;
          padding: 16px;
          height: 250px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .wa-message-bubble {
          background: white;
          padding: 12px;
          border-radius: 8px;
          border-top-left-radius: 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          max-width: 85%;
          position: relative;
          padding-bottom: 20px;
        }

        .wa-message-bubble p {
          margin: 0;
          font-size: 14px;
          color: #303030;
          line-height: 1.4;
        }

        .wa-time {
          font-size: 10px;
          color: #999;
          position: absolute;
          bottom: 4px;
          right: 8px;
        }

        .wa-input-area {
          padding: 12px;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wa-input {
          flex: 1;
          border-radius: 20px;
          padding: 10px 16px;
          border: none;
          font-size: 14px;
          outline: none;
        }
        
        .wa-input:focus {
          box-shadow: 0 0 0 2px #075e54;
        }

        .wa-send-btn {
          background: #075e54;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }

        .wa-send-btn:hover {
          background: #128C7E;
        }

        .wa-toggle-btn {
          width: 60px;
          height: 60px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .wa-toggle-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
        }
      `}</style>
    </>
  );
}
