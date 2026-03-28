import { Toaster } from "react-hot-toast";
import "./globals.css";

import { Inter, JetBrains_Mono } from "next/font/google";
import ReactQueryProvider from "../components/ReactQueryProvider";

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
        <ReactQueryProvider>
       {children}
        <Toaster position="top-right" /> 
        </ReactQueryProvider>
      </body>
    </html>
  );
}
