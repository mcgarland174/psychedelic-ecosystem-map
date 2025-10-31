import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Psychedelic Ecosystem Map | Organizations & Projects",
  description: "Explore organizations, projects, and programs in the psychedelic research and therapy space. Interactive visualizations of ecosystem roles, geographic distribution, and more.",
  keywords: ["psychedelic", "ecosystem", "organizations", "research", "therapy", "projects"],
  openGraph: {
    title: "Psychedelic Ecosystem Map",
    description: "Interactive map of the psychedelic ecosystem",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/afm3ozw.css" />
        <script defer src="https://cdn.commented.io/latest.js"></script>
      </head>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
