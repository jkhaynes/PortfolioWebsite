import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jessica Haynes | Software Engineer",
  description: "Personal engineering portfolio and project site.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
