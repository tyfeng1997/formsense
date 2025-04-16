"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-blue-600 font-bold text-xl">
              FormSense
            </Link>
            <h1 className="text-3xl font-bold mt-4 text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-gray-500 mt-2">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="prose max-w-none text-gray-700">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                1. Introduction
              </h2>
              <p>
                At FormSense ("we", "our", or "us"), we are committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our form extraction and data processing service (the
                "Service").
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using
                our Service, you acknowledge that you have read, understood, and
                agree to be bound by this Privacy Policy. If you do not agree
                with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                2.1 Account Information
              </h3>
              <p>
                When you create an account, we may collect personal information
                such as your name, email address, and billing information if you
                subscribe to a paid plan.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                2.2 Usage Data
              </h3>
              <p>
                We collect information about how you use our Service, including:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Number of documents processed</li>
                <li>Features used</li>
                <li>Time and date of access</li>
                <li>Pages visited</li>
                <li>Errors encountered</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                2.3 User-Uploaded Content
              </h3>
              <p>
                <strong>Important:</strong> We do NOT store any images you
                upload to our Service. Your form images are processed in memory
                and are permanently deleted once the extraction process is
                complete. We design our systems to process your documents
                without retaining copies of the original images.
              </p>
              <p>
                The extracted data from your documents is temporarily stored to
                provide you with the Service functionality (such as viewing,
                editing, and exporting the extracted data). You have full
                control over this extracted data and can delete it at any time.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                2.4 Templates
              </h3>
              <p>
                We store the extraction templates you create in order to provide
                the Service. These templates contain the field names and
                extraction rules you define, but do not contain actual document
                data.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                2.5 Cookies and Similar Technologies
              </h3>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our Service and hold certain information. Cookies
                are files with small amounts of data which may include an
                anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. How We Use Your Information
              </h2>
              <p>
                We use the information we collect for various purposes,
                including to:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process your transactions and manage your account</li>
                <li>
                  Send you technical notices, updates, security alerts, and
                  support messages
                </li>
                <li>
                  Respond to your comments, questions, and customer service
                  requests
                </li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our Service
                </li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <p>We may share your information in the following situations:</p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.1 Third-Party Service Providers
              </h3>
              <p>
                We may share your information with third-party vendors, service
                providers, contractors, or agents who perform services for us or
                on our behalf and require access to such information to do that
                work. These may include payment processing, data analysis, email
                delivery, hosting services, customer service, and marketing
                assistance.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.2 Business Transfers
              </h3>
              <p>
                If we are involved in a merger, acquisition, or sale of all or a
                portion of our assets, your information may be transferred as
                part of that transaction. We will notify you via email and/or a
                prominent notice on our Service of any change in ownership or
                uses of your information.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.3 Legal Requirements
              </h3>
              <p>
                We may disclose your information where required to do so by law
                or in response to valid requests by public authorities (e.g., a
                court or a government agency).
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.4 With Your Consent
              </h3>
              <p>
                We may share your information with your consent or at your
                direction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures
                to protect the security of your personal information. However,
                please be aware that no method of transmission over the Internet
                or method of electronic storage is 100% secure. While we strive
                to use commercially acceptable means to protect your
                information, we cannot guarantee its absolute security.
              </p>
              <p>
                As a reminder, we do not store any images you upload to our
                Service. Your form images are processed in memory and
                permanently deleted once the extraction process is complete,
                which significantly reduces data security risks related to your
                document content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. Your Data Rights
              </h2>
              <p>
                Depending on your location, you may have certain rights
                regarding your personal information, such as:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>
                  The right to access personal information we hold about you
                </li>
                <li>
                  The right to request correction of inaccurate personal
                  information
                </li>
                <li>
                  The right to request deletion of your personal information
                </li>
                <li>The right to request restriction of processing</li>
                <li>The right to data portability</li>
                <li>The right to object to processing</li>
              </ul>
              <p>
                If you wish to exercise any of these rights, please contact us
                using the information provided at the end of this Privacy
                Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                7. Children's Privacy
              </h2>
              <p>
                Our Service is not directed to anyone under the age of 18. We do
                not knowingly collect personal information from anyone under 18
                years of age. If you are a parent or guardian and you are aware
                that your child has provided us with personal information,
                please contact us so that we can take necessary actions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                8. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date at the top of
                this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for
                any changes. Changes to this Privacy Policy are effective when
                they are posted on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                9. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="mt-2">
                <a
                  href="mailto:privacy@formsense.app"
                  className="text-blue-600 hover:underline"
                >
                  privacy@formsense.app
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-blue-600 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
