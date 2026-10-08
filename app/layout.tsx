import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Space_Grotesk } from "next/font/google";
import FontBridge from "@/components/FontBridge";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "HyTech Racing | Georgia Tech Formula SAE Electric",
  description:
    "A premium single-page website for HyTech Racing, Georgia Tech's Formula SAE Electric racing team."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <FontBridge />
        {children}
      </body>
    </html>
  );
}
