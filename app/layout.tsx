import ClientLayout from "@/src/components/ClientLayout";
import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
