// src/app/page.tsx
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbFileExport } from "react-icons/tb";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { AiOutlineApi } from "react-icons/ai";
import { createClient } from "@/utils/supabase/server";

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

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data?.user;

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
            <BsTwitterX className="mr-1" /> Follow
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="py-16 px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              Turn Form Images Into{" "}
              <span className="text-blue-600">Structured Data</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Extract data from forms, receipts, and invoices with AI. Process
              hundreds of documents at once.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition"
              >
                Try for Free
              </Link>
              <a
                href="#how-it-works"
                className="bg-white hover:bg-gray-50 text-blue-600 py-3 px-6 rounded-md font-medium border border-blue-200 transition"
              >
                See How It Works
              </a>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Transform Your Document Processing
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                  className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                  className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section id="features" className="py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <IoDocumentTextOutline size={24} className="text-blue-600" />
                ),
                title: "Smart Data Extraction",
                description:
                  "Extract specific fields or entire forms with configurable templates.",
              },
              {
                icon: (
                  <HiOutlineDocumentDuplicate
                    size={24}
                    className="text-blue-600"
                  />
                ),
                title: "Batch Processing",
                description:
                  "Process hundreds of documents at once, saving hours of manual data entry.",
              },
              {
                icon: <TbFileExport size={24} className="text-blue-600" />,
                title: "Flexible Exports",
                description:
                  "Export to CSV, Excel, JSON or integrate with accounting software.",
              },
              {
                icon: <FaRegLightbulb size={24} className="text-blue-600" />,
                title: "AI-Powered Accuracy",
                description:
                  "Our system learns from corrections, improving accuracy over time.",
              },
              {
                icon: <AiOutlineApi size={24} className="text-blue-600" />,
                title: "Extraction Templates",
                description:
                  "Create templates once, then apply to hundreds of similar documents.",
              },
              {
                icon: <AiOutlineApi size={24} className="text-blue-600" />,
                title: "API Access",
                description:
                  "Integrate directly into your workflow with our developer-friendly API.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="bg-blue-100 p-3 rounded-lg inline-block mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simplified */}
      <section id="how-it-works" className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="flex flex-col space-y-6">
            {[
              {
                step: 1,
                title: "Upload Your Documents",
                description:
                  "Upload forms, receipts, or invoices through our drag-and-drop interface.",
              },
              {
                step: 2,
                title: "Create Extraction Templates",
                description:
                  "Specify exactly what data to extract with our intuitive template builder.",
              },
              {
                step: 3,
                title: "Apply Templates to Extract Data",
                description:
                  "Process your forms and extract data according to your template rules.",
              },
              {
                step: 4,
                title: "Review and Edit Results",
                description:
                  "Review extracted data and make any necessary corrections.",
              },
              {
                step: 5,
                title: "Export to Your Preferred Format",
                description:
                  "Export structured data in CSV, Excel, or JSON format.",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="flex items-start bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">{step.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - With Free Tier Added */}
      <section id="pricing" className="py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 mb-4">Try it out</p>
              <p className="text-3xl font-bold mb-6">
                $0<span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                    Process up to 50 documents/month
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                  <span className="text-gray-700">Basic features</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition"
              >
                Start Free
              </Link>
            </div>

            {/* Basic Tier */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-gray-500 mb-4">
                For individuals & small teams
              </p>
              <p className="text-3xl font-bold mb-6">
                $9.9<span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                  <span className="text-gray-700">All features included</span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Tier */}
            <div className="border-2 border-blue-600 rounded-lg p-6 shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-gray-500 mb-4">For growing businesses</p>
              <p className="text-3xl font-bold mb-6">
                $19.9<span className="text-lg text-gray-500">/month</span>
              </p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                    Process up to 1500 documents/month
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
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
                    Priority support & all features
                  </span>
                </li>
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simplified */}
      <footer className="py-10 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-white mb-4">FormSense</div>
            <p className="text-sm">
              Transform document processing with AI data extraction.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
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
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About
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
            <h4 className="text-white font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-6 mt-6 border-t border-gray-800 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} FormSense. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
