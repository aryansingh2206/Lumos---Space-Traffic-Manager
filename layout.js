import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar"; // ✅ Import Navbar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lumos Space Traffic Management",
  description: "Blockchain-powered orbital safety platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="stars" /> {/* 🌌 Global star background */}
        <Navbar />
        <div style={{ paddingTop: '80px', position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
