import Image from "next/image";
import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { FaRegLightbulb } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { TbFileExport } from "react-icons/tb";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { AiOutlineApi } from "react-icons/ai";
import { createClient } from "@/utils/supabase/server";

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
          <span className="ml-2 text-sm text-gray-500">
            Form Field Extraction Software
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">
            How It Works
          </a>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
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
              Try Free
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section - SEO Optimized */}
      <section className="py-16 px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-600">Free Yourself</span> From Manual
              Form Entry Hell
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Simply upload invoices or web forms to intelligently recognize
              customer information, amounts, dates, and export to Excel with one
              click! The ultimate automatic form field extraction tool.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition"
              >
                Use Now
              </Link>
              <a
                href="#how-it-works"
                className="bg-white hover:bg-gray-50 text-blue-600 py-3 px-6 rounded-md font-medium border border-blue-200 transition"
              >
                See How It Works
              </a>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/form-to-excel.jpg"
              alt="FormSense - Automatic form field extraction tool"
              width={600}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Product Showcase with Key Benefits - SEO Optimized */}
      <section className="py-12 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Automatic Form Field Extraction Tool for Every Business Need
          </h2>
          <div className="mb-10 text-center">
            <Image
              src="/app-dashboard.jpg"
              alt="FormSense - Invoice parsing tool dashboard"
              width={1000}
              height={600}
              className="mx-auto rounded-lg shadow-xl border border-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Comprehensive Document Support
              </h3>
              <p className="text-gray-700">
                Process invoices, contracts, onboarding forms, PDFs and other
                structured documents
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Intelligent Field Extraction
              </h3>
              <p className="text-gray-700">
                Automatically extract company names, amounts, customer addresses
                and other fields
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                One-Click Export
              </h3>
              <p className="text-gray-700">
                Download your data in Excel, CSV and other formats with a single
                click
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                No Installation Required
              </h3>
              <p className="text-gray-700">
                Use directly in your browser without downloading or installing
                software
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Multi-Department Usage
              </h3>
              <p className="text-gray-700">
                Perfect for bookkeeping, finance, HR, customer management and
                more
              </p>
            </div>

            <div className="bg-blue-50 p-5 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Time-Saving Automation
              </h3>
              <p className="text-gray-700">
                Cut hours of manual data entry with our intelligent AI
                extraction system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - NEW */}
      <section id="how-it-works" className="py-16 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-blue-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Create an Extraction Template
                </h3>
                <p className="text-gray-600">
                  Select fields you want to extract from your document. Define
                  the layout once, and FormSense will recognize similar
                  documents automatically. Our AI helps identify field types for
                  better accuracy.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Image
                  src="/step1-create-template.jpg"
                  alt="Creating an extraction template"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md border border-gray-200"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Image
                  src="/step2-upload-images.jpg"
                  alt="Upload images and select template"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md border border-gray-200"
                />
              </div>
              <div>
                <div className="bg-blue-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Upload Images & Select Template
                </h3>
                <p className="text-gray-600">
                  Upload a single document or batch process hundreds at once.
                  Select your previously created template, or let our system
                  auto-detect the appropriate template for mixed document types.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="bg-blue-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4">Extract Data</h3>
                <p className="text-gray-600">
                  Our AI processes your documents and extracts the requested
                  data with high accuracy. Review the extraction results
                  directly in the app and make any necessary adjustments before
                  finalizing.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <Image
                  src="/step3-extract.jpg"
                  alt="Extract data from images"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md border border-gray-200"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <Image
                  src="/step4-export-excel.jpg"
                  alt="Export to Excel"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-md border border-gray-200"
                />
              </div>
              <div>
                <div className="bg-blue-600 text-white text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  Export to Excel & Other Formats
                </h3>
                <p className="text-gray-600">
                  Download your structured data in Excel, CSV, or JSON format.
                  All your data is organized exactly how you need it, ready for
                  analysis or import into your business systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* FAQ Section - NEW */}
      <section id="faq" className="py-16 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Question 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Do you store my uploaded form images?
              </h3>
              <p className="text-gray-600">
                No, we do not store your uploaded images. All processing is done
                in real-time, and the images are not saved on our servers after
                extraction is complete. Your data privacy and security are our
                top priorities.
              </p>
            </div>

            {/* Question 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                How can I provide feedback or report issues?
              </h3>
              <p className="text-gray-600">
                We welcome your feedback! You can email us at
                <a
                  href="mailto:bofeng1997@gmail.com"
                  className="text-blue-600 ml-1"
                >
                  bofeng1997@gmail.com
                </a>{" "}
                or leave a message on{" "}
                <a href="https://x.com/bofeng1997" className="text-blue-600">
                  X
                </a>
                . We respond to all feedback promptly and are constantly
                improving based on user suggestions.
              </p>
            </div>

            {/* Question 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Can I get a refund if I'm not satisfied?
              </h3>
              <p className="text-gray-600">
                Yes! You get 50 free extractions per month to test our service.
                If you subscribe and aren't satisfied with the service, we offer
                a full refund. Just contact our support team within 14 days of
                your purchase.
              </p>
            </div>

            {/* Question 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                What types of documents can FormSense process?
              </h3>
              <p className="text-gray-600">
                FormSense can process a wide variety of documents including
                invoices, receipts, forms, applications, and any document with
                structured data. Our system works best with documents that have
                a consistent format.
              </p>
            </div>

            {/* Question 5 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                How accurate is the data extraction?
              </h3>
              <p className="text-gray-600">
                Our AI-powered extraction typically achieves 90-95% accuracy on
                clear, well-formatted documents. The accuracy improves over time
                as our system learns from corrections and adjustments made to
                templates.
              </p>
            </div>

            {/* Question 6 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Can I integrate FormSense with my existing systems?
              </h3>
              <p className="text-gray-600">
                Yes, FormSense offers API access that allows you to integrate
                our data extraction capabilities directly into your existing
                workflows and business systems. Check out our developer
                documentation for more details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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

      {/* Footer */}
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
                <Link href="/pricing" className="hover:text-white">
                  Pricing
                </Link>
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
              <li>
                <a href="#faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/terms#refund" className="hover:text-white">
                  Refund Policy
                </Link>
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
