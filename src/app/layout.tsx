import type { Metadata } from "next";
import Script from "next/script";
import SmoothScroll from "./(components)/SmoothScroll";
// Hero имеет собственный фон, общий фон не нужен
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BANEMZI",
  description: "Будет громко, красиво и чуть‑чуть неприлично. Как вы просили.",
  openGraph: {
    title: 'BANEMZI — ивент‑агентство',
    description: 'Мы не проводим мероприятия. Мы делаем повод хвастаться.',
    type: 'website',
    url: process.env.APP_URL || 'http://localhost:3000',
  },
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  icons: {
    icon: [
      { url: '/Logo.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/Logo.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Logo.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
          <Script
            strategy="afterInteractive"
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          />
        ) : null}
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
