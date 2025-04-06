// src/app/page.tsx
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbFileExport } from "react-icons/tb";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { AiOutlineApi } from "react-icons/ai";

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

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center py-4 px-8 border-b">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600">FormSense</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
            How It Works
          </a>
          <a href="#pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </a>
          <Link
            href="https://x.com/bofeng1997"
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <BsTwitterX className="mr-1" /> Follow Our Journey
          </Link>
          <a
            href="#waitlist"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Turn Form Images Into{" "}
              <span className="text-blue-600">Structured Data</span> In Seconds
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              FormSense uses advanced AI to extract data from forms, receipts,
              and invoices accurately. Create extraction templates once and
              apply them to batch process hundreds of similar documents at once.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="#waitlist"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg font-medium transition text-center"
              >
                Join Waitlist
              </a>
              <a
                href="#how-it-works"
                className="bg-white hover:bg-gray-50 text-blue-600 py-3 px-8 rounded-md text-lg font-medium border border-blue-200 transition text-center"
              >
                See How It Works
              </a>
            </div>
            <div className="mt-6 text-gray-500">
              <p>🚀 MVP Launch: April 20, 2025</p>
              <p>📣 Building in public - follow our journey!</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Transform Your Document Processing
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Process hundreds of documents at once
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Extract specific fields or entire forms
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Create reusable extraction templates
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Export to CSV, Excel, or JSON
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">
                  Integrate with your existing systems
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <IoDocumentTextOutline size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Smart Data Extraction
              </h3>
              <p className="text-gray-600">
                Extract entire forms or just specific fields like total amount,
                date, or vendor name with configurable templates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <HiOutlineDocumentDuplicate
                  size={24}
                  className="text-blue-600"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Batch Processing
              </h3>
              <p className="text-gray-600">
                Process hundreds of documents at once, saving hours of manual
                data entry. Our system efficiently handles large volumes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <TbFileExport size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Flexible Exports
              </h3>
              <p className="text-gray-600">
                Export extracted data to CSV, Excel, JSON or integrate directly
                with accounting software and ERP systems.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <FaRegLightbulb size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                AI-Powered Accuracy
              </h3>
              <p className="text-gray-600">
                Our intelligent system learns from corrections, continuously
                improving accuracy for your specific document types.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <AiOutlineApi size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Powerful Extraction Templates
              </h3>
              <p className="text-gray-600">
                Create and save detailed extraction templates once, then apply
                them to hundreds of similar documents for consistent, accurate
                data extraction.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4">
                <AiOutlineApi size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                API Access{" "}
              </h3>
              <p className="text-gray-600">
                Integrate FormSense directly into your workflow with our
                developer-friendly API for seamless automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            FormSense transforms your document images into structured, usable
            data in just a few simple steps.
          </p>

          <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Upload Your Documents
                </h3>
              </div>
              <p className="text-gray-600 ml-14">
                Upload your forms, receipts, or invoices through our intuitive
                drag-and-drop interface. Batch upload is supported, saving you
                time when processing multiple documents.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Create Extraction Templates
                </h3>
              </div>
              <p className="text-gray-600 ml-14">
                Design extraction templates with our intuitive template builder.
                Specify exactly what data to extract - whether it&apos;s
                specific fields like totals and dates, or the entire form
                structure. Templates are saved for reuse.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Apply Templates to Extract Data
                </h3>
              </div>
              <p className="text-gray-600 ml-14">
                Apply your saved templates to individual documents or entire
                batches. FormSense quickly processes your forms and extracts the
                specified data according to your template rules.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Review and Edit Results
                </h3>
              </div>
              <p className="text-gray-600 ml-14">
                Review the extracted data in our user-friendly interface. Make
                any necessary corrections or adjustments - we understand that
                even advanced AI needs human verification for 100% accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Export to Your Preferred Format
                </h3>
              </div>
              <p className="text-gray-600 ml-14">
                Export your validated structured data in CSV, Excel, or JSON
                format, or send it directly to your accounting software. Your
                data is ready to use without manual retyping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Building in Public */}
      <section className="py-20 px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            We&apos;re Building in Public
          </h2>
          <p className="text-xl mb-8">
            Follow our journey as we develop FormSense from concept to launch.
            Get early access, influence feature development, and see behind the
            scenes of building a SaaS product.
          </p>
          <div className="bg-white/10 rounded-lg p-8 backdrop-blur-sm">
            <p className="text-2xl font-bold mb-2">
              MVP Launch: April 20, 2025
            </p>
            <p className="mb-6">
              Be among the first to try FormSense and shape its future
            </p>
            <Link
              href="https://x.com/bofeng1997"
              className="inline-flex items-center bg-white text-blue-600 py-3 px-6 rounded-md text-lg font-medium hover:bg-blue-50 transition"
            >
              <BsTwitterX className="mr-2" /> Follow Our Progress on Twitter
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section Placeholder */}
      <section id="pricing" className="py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing</h2>
          <p className="text-gray-600 mb-16 max-w-3xl mx-auto">
            Flexible plans to meet your document processing needs. Early
            adopters will receive special pricing.
          </p>
          <p className="text-amber-600 font-medium italic mb-10 max-w-3xl mx-auto">
            NOTE: These prices are not final and may change before our official
            launch. Join our waitlist to be notified of our final pricing
            structure.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-gray-500 mb-4">
                For individuals and small businesses
              </p>
              <p className="text-4xl font-bold mb-6">
                $19.9<span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Process up to 100 documents/month
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Full field extraction capabilities
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">All export formats</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Standard support</span>
                </li>
              </ul>
              <a
                href="#waitlist"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Join Waitlist
              </a>
            </div>

            <div className="border-2 border-blue-600 rounded-lg p-8 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-gray-500 mb-4">For growing teams</p>
              <p className="text-4xl font-bold mb-6">
                $49.9<span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Process up to 500 documents/month
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Custom configuration options
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Batch processing tools</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              <a
                href="#waitlist"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Join Waitlist
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-500 mb-4">For large organizations</p>
              <p className="text-4xl font-bold mb-6">Custom</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Unlimited documents</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Custom tailored solutions
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">API access</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">Dedicated support</span>
                </li>
              </ul>
              <a
                href="#waitlist"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="waitlist"
        className="py-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your document processing?
          </h2>
          <p className="text-xl mb-8">
            Join our waitlist to be first in line when we launch. Early adopters
            receive exclusive benefits.
          </p>
          <div className="max-w-md mx-auto">
            <iframe
              src="https://tally.so/embed/wkzqW6?alignLeft=1&hideTitle=1&transparentBackground=1"
              width="100%"
              height="300"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="FormSense Waitlist Form"
              className="rounded-md"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-white mb-4">FormSense</div>
            <p className="mb-4">
              Transforming document processing with intelligent data extraction.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://x.com/bofeng1997"
                className="hover:text-white"
              >
                <BsTwitterX size={20} />
              </Link>
              {/* Add other social media icons as needed */}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-800 text-center">
          <p>
            &copy; {new Date().getFullYear()} FormSense. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
