import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const title = "Jessica Haynes | Software Engineer";
const description =
  "Senior Software Engineer with 9+ years building full-stack enterprise applications — C#/.NET, backend performance, scalable architecture.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jessbuilds.dev"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://www.jessbuilds.dev",
    siteName: "Jessica Haynes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
