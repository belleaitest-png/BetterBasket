import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetterBasket — Smarter Grocery Shopping",
  description: "AI-powered grocery shopping tailored to your taste, budget, and goals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
