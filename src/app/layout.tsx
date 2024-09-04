import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./global.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "AccSaver",
  description: "Store and manage all your accounts in one place.",
  icons: {
    icon: [
      {
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png"
      },
      {
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
