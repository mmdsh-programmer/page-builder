import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

const iranYekan = localFont({
  src: [
    {
      path: "./fonts/IRANYekanRegular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "./fonts/IRANYekanMedium.ttf",
      style: "normal",
      weight: "500",
    },
    {
      path: "./fonts/IRANYekanBold.ttf",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-iran-yekan",
  display: "swap",
});

const iranSans = localFont({
  src: [
    {
      path: "./fonts/IRANSansWeb.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${iranSans.variable} ${iranYekan.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
