import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PlayfulPet } from "@/components/pet/PlayfulPet";
import { ProjectPreviewPanel } from "@/components/projects/ProjectPreviewPanel";

const jetbrains = JetBrains_Mono({
  variable: "--font-jb",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manushwi Raj Bhardwaj",
  description:
    "Full-stack developer building web apps, mobile apps, TUI tools and dev tooling.",
  metadataBase: new URL("https://manushwi.vercel.app"),
  openGraph: {
    title: "Manushwi Raj Bhardwaj",
    description:
      "Full-stack developer building web apps, mobile apps, TUI tools and dev tooling.",
    url: "https://manushwi.vercel.app/",
    siteName: "Manushwi Raj Bhardwaj",
    images: [{ url: "/ss.png", width: 1200, height: 630, alt: "Portfolio" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manushwi Raj Bhardwaj",
    description:
      "Full-stack developer building web apps, mobile apps, TUI tools and dev tooling.",
    images: ["/ss.png"],
    creator: "@Manushwi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrains.variable} antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          themes={["green", "amber", "blue", "rose", "mono"]}
          defaultTheme="green"
          enableSystem={false}
        >
          <Nav />
          {children}
          <Footer />
          <PlayfulPet />
          <ProjectPreviewPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
