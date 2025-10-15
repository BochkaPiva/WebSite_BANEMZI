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
  title: "BANEMZI - Ивент агентство в Омске | Организация мероприятий",
  description: "Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации, промо-акции. Создаем мероприятия, которые запоминаются навсегда.",
  keywords: "ивент агентство, мероприятия Омск, организация мероприятий, корпоративы Омск, тимбилдинги, презентации, промо-акции, event агентство, BANEMZI",
  authors: [{ name: "BANEMZI" }],
  creator: "BANEMZI",
  publisher: "BANEMZI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'BANEMZI — ивент‑агентство в Омске',
    description: 'Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации. Создаем мероприятия, которые запоминаются.',
    type: 'website',
    url: 'https://banemzi.ru',
    siteName: 'BANEMZI',
    locale: 'ru_RU',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'BANEMZI - Ивент агентство в Омске',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BANEMZI — ивент‑агентство в Омске',
    description: 'Профессиональная организация мероприятий в Омске. Создаем мероприятия, которые запоминаются.',
    images: ['/Logo.png'],
  },
  alternates: {
    canonical: 'https://banemzi.ru',
  },
  metadataBase: new URL('https://banemzi.ru'),
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/Logo.png', type: 'image/png' },
    ],
    shortcut: [{ url: '/Logo.png', type: 'image/png' }],
    apple: [{ url: '/Logo.png', type: 'image/png' }],
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
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/Logo.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo.png" />
        <meta name="yandex-verification" content="a59490e9b6aa01b0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BANEMZI",
              "description": "Профессиональная организация мероприятий в Омске. Корпоративы, тимбилдинги, презентации, промо-акции.",
              "url": "https://banemzi.ru",
              "logo": "https://banemzi.ru/Logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Омск",
                "addressCountry": "RU"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "Russian"
              },
              "sameAs": [],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": 54.9885,
                  "longitude": 73.3242
                },
                "geoRadius": "500000"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Услуги по организации мероприятий",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Корпоративные праздники",
                      "description": "Дни рождения компаний, юбилеи, корпоративы"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Тимбилдинги и квесты",
                      "description": "Сплочение команды через интерактивные активности"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Презентации и запуски",
                      "description": "Презентации товаров, услуг, новых локаций"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Промо-мероприятия",
                      "description": "Знакомство с брендом, рекламные акции"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Деловые события",
                      "description": "Конференции, семинары, бизнес-встречи"
                    }
                  }
                ]
              }
            })
          }}
        />
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
