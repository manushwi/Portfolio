import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manushwi Raj Bhardwaj",
  description: "Manushwi Raj Bhardwaj Portfolio",
  openGraph: {
    title: "Manushwi Raj Bhardwaj",
    description: "Showcasing my projects and skills.",
    url: "https://manushwi.vercel.app/", // replace with your domain once ready
    siteName: "Manushwi Raj Bhardwaj",
    images: [
      {
        url: "https://your-vercel-url.vercel.app/preview.png", // put your preview image in /public
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manushwi Raj Bhardwaj",
    description: "Showcasing my projects and skills.",
    images: ["/ss.png"],
    creator: "@manushwi", // optional
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
        <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem>
          {children}
        </ThemeProvider>
        
      </body>
    </html>
  );
}
