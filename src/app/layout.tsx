import type { Metadata } from "next";
import Script from "next/script";
import SmoothScroll from "./(components)/SmoothScroll";
// Hero имеет собственный фон, общий фон не нужен
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Оптимизация загрузки шрифтов
  preload: true, // Предзагрузка шрифтов
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Оптимизация загрузки шрифтов
  preload: true, // Предзагрузка шрифтов
});

export const metadata: Metadata = {
  title: "BANEMZI - Ивент агентство в Омске | Организация мероприятий | Корпоративы, Тимбилдинги",
  description: "Ивент агентство BANEMZI в Омске. Организация корпоративов, тимбилдингов, презентаций в Омске. Профессиональные мероприятия под ключ. Звоните: +7-XXX-XXX-XX-XX",
  keywords: "ивент агентство Омск, организация мероприятий Омск, корпоративы Омск, тимбилдинги Омск, презентации Омск, промо-акции Омск, event агентство Омск, BANEMZI Омск, мероприятия Омск, праздники Омск, корпоративные мероприятия Омск",
  authors: [{ name: "BANEMZI" }],
  creator: "BANEMZI",
  publisher: "BANEMZI",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon-192.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://banemzi.ru",
    title: "BANEMZI - Ивент агентство в Омске | Организация мероприятий",
    description: "Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации, промо-акции. Создаем мероприятия, которые запоминаются навсегда.",
    siteName: "BANEMZI",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "BANEMZI - Ивент агентство в Омске",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BANEMZI - Ивент агентство в Омске | Организация мероприятий",
    description: "Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации, промо-акции. Создаем мероприятия, которые запоминаются навсегда.",
    images: ["/Logo.png"],
  },
  verification: {
    google: "google188ec728e8b1fa5d",
    yandex: "a59490e9b6aa01b0",
  },
  alternates: {
    canonical: "https://banemzi.ru",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="ru">
          <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" href="/favicon.ico" sizes="16x16" />
            <link rel="icon" href="/favicon.ico" sizes="32x32" />
            <link rel="icon" href="/Logo.png" type="image/png" sizes="192x192" />
            <link rel="icon" href="/Logo.png" type="image/png" sizes="512x512" />
            <link rel="icon" href="/Logo.png" type="image/png" sizes="48x48" />
            <link rel="icon" href="/Logo.png" type="image/png" sizes="64x64" />
            <link rel="apple-touch-icon" href="/Logo.png" sizes="180x180" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <meta name="msapplication-TileImage" content="/Logo.png" />
            <meta name="msapplication-TileColor" content="#FF6B00" />
            <meta name="theme-color" content="#FF6B00" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* DNS prefetch для внешних ресурсов */}
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://api.telegram.org" />
        <link rel="dns-prefetch" href="https://sheets.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googleapis.com" />
        
        {/* Preconnect для критических ресурсов */}
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preload" href="/favicon.png" as="image" type="image/png" />
        {/* Preload критического CSS для ускорения FCP */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SmoothScroll />
        {children}
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BANEMZI",
              description: "Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации, промо-акции.",
              url: "https://banemzi.ru",
              logo: "https://banemzi.ru/Logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Омск",
                addressCountry: "RU",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+7-XXX-XXX-XX-XX",
                contactType: "customer service",
                areaServed: "RU",
                availableLanguage: "Russian",
              },
              sameAs: [
                "https://banemzi.ru",
              ],
              serviceArea: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 54.9885,
                  longitude: 73.3242,
                },
                geoRadius: "1000000",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Услуги ивент агентства",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Корпоративные мероприятия",
                      description: "Организация корпоративных праздников и мероприятий",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Тимбилдинги",
                      description: "Проведение тимбилдингов и командных мероприятий",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Презентации",
                      description: "Организация презентаций товаров и услуг",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Промо-акции",
                      description: "Проведение промо-мероприятий и рекламных акций",
                    },
                  },
                ],
              },
            }),
          }}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}