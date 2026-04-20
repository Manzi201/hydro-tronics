import type { Metadata } from "next";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export const metadata: Metadata = {
  title: "Hydro-Tronics Eng. | Smart Electronic Plumbing",
  description: "Modern electronic plumbing solutions, smart water systems, and quality plumbing materials for homes in Kigali. Reliable, efficient, and professional service.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}

