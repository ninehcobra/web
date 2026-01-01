import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a premium default
import "./globals.css";
import { Providers } from "@/presentation/providers";
import FontAwesomeConfig from "@/ui/FontAwesomeConfig";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto Affiliate | TikTok Automation",
  description: "Automate your TikTok Affiliate workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FontAwesomeConfig />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
