import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BearifiedCo Roadmap",
  description:
    "Scroll-driven roadmap that documents BearifiedCo’s path from $25M MC to the One-Person $1B Company vision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#020109] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
