import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asljkkniu.org"),

  title: {
    default: "ASL-JKKNIU — Advanced System Lab",
    template: "%s | ASL-JKKNIU",
  },

  description:
    "Advanced System Lab (ASL-JKKNIU) at Jatiya Kabi Kazi Nazrul Islam University — research in intelligent systems, robotics, computer vision, AI, navigation, IoT, and industrial automation.",

  applicationName: "ASL-JKKNIU",

  icons: {
    icon: "/icon.svg",
  },

  openGraph: {
    title: "ASL-JKKNIU — Advanced System Lab",
    description:
      "Research in intelligent systems, robotics, computer vision, AI, navigation, and emerging technologies.",
    type: "website",
    siteName: "ASL-JKKNIU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}