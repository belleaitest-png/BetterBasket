import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brand Image Discovery | Craft Your Personal Brand",
  description:
    "A luxe personal brand discovery experience. Uncover your colours, typography, voice, and visual identity — then export a complete brand guidelines document.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-brand-bg text-brand-text min-h-screen">
        {children}
      </body>
    </html>
  );
}
