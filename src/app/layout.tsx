import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/typography.css";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { defaultLocale } from "@/locales";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Project ECHO",
  description: "An intimate narrative between you and a learning AI named ECHO.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} className="scroll-smooth">
      <body
        className={`${plexSans.variable} ${jetBrainsMono.variable} min-h-screen bg-echo-background font-sans text-echo-glow transition-colors duration-500`}
      >
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(166,208,255,0.12),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(17,19,37,0.9),_rgba(5,6,15,1))]" />
        <div className="fixed inset-0 -z-10 opacity-40 mix-blend-screen" style={{ background: "radial-gradient(circle at 50% 0%, rgba(255, 226, 159, 0.18), transparent 55%)" }} />
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(166,208,255,0.12)_0%,rgba(17,19,37,0.2)_45%,rgba(255,77,141,0.14)_100%)] opacity-30 blur-3xl" />
          <main className="relative z-10 w-full max-w-5xl">
            <LocaleProvider>{children}</LocaleProvider>
          </main>
        </div>
      </body>
    </html>
  );
}

