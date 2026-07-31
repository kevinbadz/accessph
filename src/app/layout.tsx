import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/components/SettingsProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import VoiceCommandBar from "@/components/VoiceCommandBar";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AccessPH",
  description:
    "AccessPH is an open-source accessibility companion for PWDs and seniors in the Philippines — camera text reading, voice commands, and emergency alerts in English and Filipino.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AccessPH",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <SettingsProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-slate-900"
          >
            Skip to content
          </a>
          <ErrorBoundary>
            {/* Content scrolls in its own box so the mic bar below — a normal
                flex sibling, not a floating overlay — can never sit on top of it. */}
            <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
            <VoiceCommandBar />
          </ErrorBoundary>
          <ServiceWorkerRegister />
        </SettingsProvider>
      </body>
    </html>
  );
}
