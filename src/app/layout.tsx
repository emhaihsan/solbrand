import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Web3AuthRootProvider from "@/lib/Web3AuthRootProvider";
import web3AuthContextConfig from "@/lib/web3authContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolBrand - AI-Powered Web3 Brand Creation",
  description:
    "Transform your startup concept into a complete brand identity with AI-powered generation on Solana blockchain. NFT-based brand ownership and autonomous brand management.",
  keywords:
    "Web3, Solana, AI, Brand Creation, NFT, Blockchain, Startup, Logo Design",
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
        <Web3AuthRootProvider>{children}</Web3AuthRootProvider>
      </body>
    </html>
  );
}
