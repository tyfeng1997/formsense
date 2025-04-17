"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-blue-600 font-bold text-xl">
              FormSense
            </Link>
            <h1 className="text-3xl font-bold mt-4 text-gray-900">
              Terms of Service
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
                1. Agreement to Terms
              </h2>
              <p>
                These Terms of Service ("Terms") constitute a legally binding
                agreement between you and FormSense ("we," "our," or "us")
                governing your access to and use of the FormSense website,
                services, and applications (collectively, the "Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by
                these Terms. If you disagree with any part of the Terms, you may
                not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                2. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms at any
                time. We will provide notice of any changes by posting the new
                Terms on our website and updating the "Last Updated" date. Your
                continued use of the Service after any such changes constitutes
                your acceptance of the new Terms.
              </p>
              <p>
                It is your responsibility to review these Terms periodically for
                changes. If you do not agree to the new Terms, you must stop
                using the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                3. Account Registration and Security
              </h2>
              <p>
                To use certain features of the Service, you may need to create
                an account. When you register, you agree to provide accurate,
                current, and complete information about yourself as prompted by
                the registration form.
              </p>
              <p>
                You are responsible for safeguarding the password that you use
                to access the Service and for any activities or actions under
                your password. You agree not to disclose your password to any
                third party. You must notify us immediately upon becoming aware
                of any breach of security or unauthorized use of your account.
              </p>
              <p>
                We reserve the right to disable any user account at any time if,
                in our opinion, you have failed to comply with any provisions of
                these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                4. Service Description and Limitations
              </h2>
              <p>
                FormSense is a document processing service that allows users to
                extract structured data from form images using AI and custom
                templates.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.1 Image Processing
              </h3>
              <p>
                <strong>Important:</strong> To protect your privacy and
                security, we do NOT store any images you upload to our Service.
                Your form images are processed in memory and permanently deleted
                once the extraction process is complete. We design our systems
                to process your documents without retaining copies of the
                original images.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.2 Extracted Data
              </h3>
              <p>
                The data extracted from your documents is temporarily stored to
                provide you with the Service functionality (such as viewing,
                editing, and exporting the extracted data). You have full
                control over this extracted data and can delete it at any time.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.3 Usage Limitations
              </h3>
              <p>Our Service is subject to certain limitations, including:</p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>
                  Monthly document processing limits based on your subscription
                  plan
                </li>
                <li>Maximum file size limitations</li>
                <li>Supported file formats</li>
                <li>Rate limits to ensure fair usage</li>
              </ul>
              <p>
                We reserve the right to modify these limitations at any time.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                4.4 Service Availability
              </h3>
              <p>
                We strive to ensure that our Service is available at all times.
                However, we do not guarantee that the Service will be available
                without interruption. We may suspend or discontinue the Service
                or any feature at any time without notice or liability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                5. User Conduct and Content
              </h2>
              <p>By using our Service, you agree not to:</p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>
                  Use the Service in any manner that could damage, disable,
                  overburden, or impair it
                </li>
                <li>
                  Use automated means (bots, scripts) to access the Service
                  without our explicit permission
                </li>
                <li>
                  Use the Service for any illegal purpose or in violation of any
                  local, state, national, or international law
                </li>
                <li>
                  Upload content that infringes on intellectual property rights
                  or violates privacy rights
                </li>
                <li>
                  Upload content that contains viruses, malware, or other
                  harmful code
                </li>
                <li>
                  Attempt to gain unauthorized access to any portion of the
                  Service
                </li>
                <li>
                  Impersonate any person or entity or falsely state or
                  misrepresent your affiliation
                </li>
                <li>
                  Resell or redistribute the Service without our explicit
                  permission
                </li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                5.1 Content Responsibility
              </h3>
              <p>
                You are solely responsible for all content you upload, submit,
                or otherwise make available via the Service. While we do not
                store image content as described above, you agree to only upload
                content that you have the right and authority to share.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                6. Billing and Subscription
              </h2>
              <p>
                Some aspects of the Service may be provided for a fee. If you
                elect to use paid features of the Service, you agree to pay the
                applicable fees.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                6.1 Subscription Plans
              </h3>
              <p>
                FormSense offers various subscription plans with different
                features and limitations. You will be billed in advance on a
                recurring basis, depending on the type of subscription plan you
                select.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                6.2 Free Trial
              </h3>
              <p>
                We may, at our sole discretion, offer a free trial for a limited
                period. You may be required to provide payment information to
                start the trial. At the end of the trial period, we will
                automatically begin charging the applicable subscription fee
                unless you cancel before the trial ends.
              </p>

              <h3
                id="refund"
                className="text-lg font-medium text-gray-800 mt-4 mb-2"
              >
                6.3 Cancellation and Refund Policy
              </h3>
              <p>
                You may cancel your subscription at any time through your
                account settings or by contacting our support team at{" "}
                <a
                  href="mailto:support@formsense.app"
                  className="text-blue-600 hover:underline"
                >
                  support@formsense.app
                </a>
                . Upon cancellation, your subscription will remain active until
                the end of your current billing period.
              </p>
              <p className="mt-2">
                <strong>Standard Refund Policy:</strong> We generally do not
                provide refunds for partial subscription periods. When you
                cancel your subscription, you will continue to have access to
                the Service until the end of your current billing cycle, but you
                will not be charged for subsequent billing cycles.
              </p>
              <p className="mt-2">
                <strong>Exceptional Circumstances:</strong> In the following
                cases, you may be eligible for a full or partial refund:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>
                  <strong>Technical Issues:</strong> If you experience severe
                  technical issues that prevent you from using core features of
                  the Service, and our support team is unable to resolve these
                  issues within 7 business days of your initial report.
                </li>
                <li>
                  <strong>Billing Errors:</strong> If you have been charged
                  incorrectly or multiple times for the same subscription
                  period.
                </li>
                <li>
                  <strong>New Subscribers:</strong> If you are a new subscriber
                  and request a refund within 7 days of your initial payment,
                  provided you have processed fewer than 50 documents during
                  this period.
                </li>
              </ul>
              <p className="mt-2">
                <strong>Refund Requests:</strong> To request a refund, please
                contact our support team at{" "}
                <a
                  href="mailto:support@formsense.app"
                  className="text-blue-600 hover:underline"
                >
                  support@formsense.app
                </a>{" "}
                with your account details and reason for the refund request. All
                refund requests are evaluated on a case-by-case basis, and we
                reserve the right to deny refund requests that do not meet our
                criteria.
              </p>
              <p className="mt-2">
                <strong>Refund Processing:</strong> Approved refunds will be
                processed using the original payment method used for the
                purchase. Refunds may take 5-10 business days to appear on your
                statement, depending on your payment provider.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                6.4 Price Changes
              </h3>
              <p>
                We reserve the right to change our prices at any time. If we
                change pricing, we will provide notice of the change on our
                website or by email, at our option. If you do not agree to the
                price change, you must cancel your subscription before it renews
                under the new pricing.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                7. Intellectual Property Rights
              </h2>
              <p>
                The Service and its original content (excluding content provided
                by users), features, and functionality are and will remain the
                exclusive property of FormSense and its licensors. The Service
                is protected by copyright, trademark, and other laws of both the
                United States and foreign countries.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                7.1 Extracted Data Ownership
              </h3>
              <p>
                You retain all rights to the data extracted from your documents.
                We claim no ownership or rights over the content you upload or
                the data we extract from it.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
                7.2 Feedback
              </h3>
              <p>
                If you provide us with any feedback or suggestions, you grant us
                an unlimited, irrevocable, perpetual, sublicensable,
                transferable, royalty-free license to use such feedback or
                suggestions for any purpose without compensation to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis,
                without any warranties of any kind, either express or implied.
              </p>
              <p>
                We expressly disclaim all warranties of any kind, whether
                express or implied, including but not limited to the implied
                warranties of merchantability, fitness for a particular purpose,
                and non-infringement.
              </p>
              <p>
                We make no warranty that the Service will meet your
                requirements, be available on an uninterrupted, secure, or
                error-free basis, or that the results from using the Service
                will be accurate or reliable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                9. Limitation of Liability
              </h2>
              <p>
                In no event shall FormSense, its directors, employees, partners,
                agents, suppliers, or affiliates be liable for any indirect,
                incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use,
                goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>
                  Your access to or use of or inability to access or use the
                  Service
                </li>
                <li>
                  Any conduct or content of any third party on the Service
                </li>
                <li>Any content obtained from the Service</li>
                <li>
                  Unauthorized access, use, or alteration of your transmissions
                  or content
                </li>
              </ul>
              <p>
                In any case, our total liability to you for all claims shall not
                exceed the amount paid by you, if any, for accessing our Service
                over the 12 months prior to the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                10. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless FormSense and
                its licensees and licensors, and their employees, contractors,
                agents, officers and directors, from and against any and all
                claims, damages, obligations, losses, liabilities, costs or
                debt, and expenses (including but not limited to attorney's
                fees), resulting from or arising out of:
              </p>
              <ul className="list-disc pl-6 mt-2 mb-4">
                <li>Your use of and access to the Service</li>
                <li>Your violation of any term of these Terms</li>
                <li>
                  Your violation of any third-party right, including without
                  limitation any copyright, property, or privacy right
                </li>
                <li>
                  Any claim that your content caused damage to a third party
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                11. Governing Law
              </h2>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of [Your Jurisdiction], without regard to its conflict
                of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any
                provision of these Terms is held to be invalid or unenforceable
                by a court, the remaining provisions of these Terms will remain
                in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                12. Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. If you wish to terminate your account, you may simply
                discontinue using the Service or contact us to request account
                deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                13. Contact Us
              </h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <p className="mt-2">
                <a
                  href="mailto:legal@formsense.app"
                  className="text-blue-600 hover:underline"
                >
                  legal@formsense.app
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
