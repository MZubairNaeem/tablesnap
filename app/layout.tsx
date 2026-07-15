import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display face — used only for question text, page titles, and the wordmark.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vouch — Video testimonials for local businesses",
  description: "Collect and showcase video testimonials from your customers.",
};

// Applied before paint so a saved light/dark choice never flashes the wrong
// theme. Absence of both classes falls back to the OS preference (handled in
// globals.css), which is why "system" is simply the no-class state.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("vouch-theme");if(t==="light"||t==="dark"){document.documentElement.classList.add(t)}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
