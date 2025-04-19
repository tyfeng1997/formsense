import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FormSense - Automatic Form Field Extraction Tool | Invoice Parser",
  description:
    "Free yourself from manual data entry. Extract form fields automatically from invoices, contracts & PDFs. One-click export to Excel. Try FormSense now!",
  keywords:
    "automatic form field extraction tool, form field extraction software, invoice parsing tool, FormSense, data extraction, document processing, invoice scanner, PDF form extractor, excel export",
  openGraph: {
    title: "FormSense - Automatic Form Field Extraction Tool | Invoice Parser",
    description:
      "Free yourself from manual data entry. Extract form fields automatically from invoices, contracts & PDFs. One-click export to Excel. Try FormSense now!",
    url: "https://formsense.app",
    siteName: "FormSense - Form Field Extraction Software",
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
          content="FormSense - Automatic Form Field Extraction Tool | Invoice Parser"
        />
        <meta
          property="og:description"
          content="Free yourself from manual data entry. Extract form fields automatically from invoices, contracts & PDFs. One-click export to Excel. Try FormSense now!"
        />
        <meta
          property="og:image"
          content="https://formsense.app/og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@bofeng1997" />
        <meta
          name="twitter:title"
          content="FormSense - Automatic Form Field Extraction Tool | Invoice Parser"
        />
        <meta
          name="twitter:description"
          content="Free yourself from manual data entry. Extract form fields automatically from invoices, contracts & PDFs. One-click export to Excel. Try FormSense now!"
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
            "operatingSystem": "Web",
            "description": "Automatic form field extraction tool. Extract data from invoices, contracts & PDFs without manual entry.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free tier with 50 extractions per month"
            },
            "applicationSubCategory": "DocumentManagement",
            "screenshot": "https://formsense.app/og-image.jpg",
            "featureList": "Invoice parsing, Form field extraction, PDF data extraction, Excel export",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "42"
            }
          }
        `}</script>
        {/* Canonical URL for SEO */}
        <link rel="canonical" href="https://formsense.app/" />
      </head>
      <Toaster position="top-right" />

      <body className={inter.className}>{children}</body>
    </html>
  );
}
