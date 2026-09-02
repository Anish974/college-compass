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
  ],
  authors: [{ name: "Campus Compass" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Campus Compass",
    description: "Interactive Maharashtra engineering college map",
    url: "https://chat.z.ai",
    siteName: "Campus Compass",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campus Compass",
    description: "Interactive Maharashtra engineering college map",
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
