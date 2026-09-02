import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://collegecompass.ayuslabs.com"),
  title: "Campus Compass — Maharashtra Engineering Colleges Map",
  description:
    "Interactive multi-city map of Maharashtra engineering colleges with tiers, branches, MHT-CET cutoffs, placements and transit distances.",
  keywords: [
    "MHT-CET",
    "engineering colleges",
    "Maharashtra",
    "Pune",
    "Mumbai",
    "Nagpur",
    "Amravati",
    "college map",
    "Leaflet",
    "Campus Compass",
  ],
  authors: [{ name: "Campus Compass" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Campus Compass — Maharashtra Engineering Colleges Map",
    description:
      "Interactive multi-city map of Maharashtra engineering colleges with tiers, branches, MHT-CET cutoffs, placements and transit distances.",
    url: "https://collegecompass.ayuslabs.com",
    siteName: "Campus Compass",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Compass — Maharashtra Engineering Colleges Map",
    description:
      "Interactive multi-city map of Maharashtra engineering colleges with tiers, branches, MHT-CET cutoffs, placements and transit distances.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
