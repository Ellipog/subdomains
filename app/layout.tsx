import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subdomain Explorer",
  description: "Discover and explore subdomains of any website",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
