// src/app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FormSense - Transform Form Images into Structured Data",
  description:
    "Batch convert form images to structured data with high accuracy. Extract specific fields or entire forms and export to various formats.",
  keywords:
    "form extraction, OCR, document processing, data extraction, receipt scanner, invoice processing",
  openGraph: {
    title: "FormSense - Transform Form Images into Structured Data",
    description:
      "Batch convert form images to structured data with high accuracy. Extract specific fields or entire forms and export to various formats.",
    url: "https://formsense.app",
    siteName: "FormSense",
    images: [
      {
        url: "https://formsense.app/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Additional meta tags for SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="FormSense" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://formsense.app/" />
        <meta
          property="og:title"
          content="FormSense - Transform Form Images into Structured Data"
        />
        <meta
          property="og:description"
          content="Batch convert form images to structured data with high accuracy. Extract specific fields or entire forms and export to various formats."
        />
        <meta
          property="og:image"
          content="https://formsense.app/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@YOUR_TWITTER_HANDLE" />
        <meta
          name="twitter:title"
          content="FormSense - Transform Form Images into Structured Data"
        />
        <meta
          name="twitter:description"
          content="Batch convert form images to structured data with high accuracy. Extract specific fields or entire forms and export to various formats."
        />
        <meta
          name="twitter:image"
          content="https://formsense.app/og-image.jpg"
        />
        {/* Structured data for rich snippets */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "FormSense",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "operatingSystem": "Web",
            "description": "Batch convert form images to structured data with high accuracy. Extract specific fields or entire forms and export to various formats."
          }
        `}</script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
