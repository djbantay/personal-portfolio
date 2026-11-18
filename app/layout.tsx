import type { Metadata, Viewport } from "next";
import "@fontsource/vt323";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";
import { PROFILE, SITE_URL } from "@/lib/profile";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PROFILE.name} — CS @ Berkeley`,
  description: `${PROFILE.name} — ${PROFILE.title}. A retro terminal portfolio: ssh in, read the git log, sign the guestbook.`,
  openGraph: {
    title: `${PROFILE.name} — CS @ Berkeley`,
    description: "Boot up DANIEL_OS: projects, experience, and a terminal you can actually type into.",
    url: SITE_URL,
    siteName: "DANIEL_OS",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#001428" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
