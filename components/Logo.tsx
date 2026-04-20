export default function Logo({ className = "", size = 48, color }: { className?: string, size?: number, color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Gear Left Half Background Arch */}
      <path d="M50 15 A35 35 0 0 0 15 50 A35 35 0 0 0 50 85" stroke="#4b5563" strokeWidth="8" fill="none" strokeLinecap="round" />
      
      {/* Gear Teeth */}
      <g stroke="#4b5563" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 25 L18 18" />
        <path d="M15 50 L5 50" />
        <path d="M25 75 L18 82" />
        <path d="M38 18 L34 8" />
        <path d="M38 82 L34 92" />
      </g>
      
      {/* Outer Ring Right Side */}
      <path d="M50 15 A35 35 0 0 1 85 50 A35 35 0 0 1 50 85" stroke="#004a99" strokeWidth="2" fill="none" />

      {/* Main Water Droplet */}
      <path d="M50 5 C50 5 28 40 28 62 A22 22 0 0 0 72 62 C72 40 50 5 50 5 Z" fill="url(#waterGrad)" />
      
      {/* Wave / Swoosh at the Bottom */}
      <path d="M28 62 Q 40 74 50 55 T 72 62 Q 60 78 50 78 T 28 62 Z" fill="#002a5c" />

      {/* Circuit Traces Inside Right Side */}
      <g stroke="#ffffff" strokeWidth="1.5" fill="none">
        <path d="M52 20 L52 75" />
        <path d="M52 35 L62 35 L62 50 L67 50" />
        <circle cx="67" cy="50" r="1.5" fill="#ffffff" />
        
        <path d="M52 48 L56 48 L56 68" />
        <circle cx="56" cy="68" r="1.5" fill="#ffffff" />
        
        <path d="M52 58 L63 58 L63 65" />
        <circle cx="63" cy="65" r="1.5" fill="#ffffff" />
      </g>
      
      <defs>
        <linearGradient id="waterGrad" x1="50" y1="5" x2="50" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00a3e0" />
          <stop offset="1" stopColor="#001a33" />
        </linearGradient>
      </defs>
    </svg>
  );
}
