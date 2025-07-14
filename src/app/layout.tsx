import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LincMeet",
  description: "Video calling app",
  icons: {
    icon: "/icons/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider
      appearance={
        {
          layout: {
            logoImageUrl: "/icons/logo.svg",
            socialButtonsVariant: "iconButton",
          },
          variables: {
            colorText: "#ffffff",
            colorPrimary: "#0e78f9",
            colorBackground: "#1c1f2e",
            colorInputBackground: "#252a41",
            colorInputText: "#ffffff",
          }
        }
      }
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-800 text-zinc-100`}
        >
          {children}
          <Toaster position="top-center" richColors closeButton/>
        </body>
      </ClerkProvider>
    </html>
  );
}
