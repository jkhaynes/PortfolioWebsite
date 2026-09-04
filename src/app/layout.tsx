import type { Metadata, Viewport } from "next";
import { Lora, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { themeInitScript } from "@/lib/theme";

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

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#fdf6f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="bfb82519-8584-4a9b-a2f3-5c63b10f423f"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
