import React from 'react';
import { Shield, FileText, AlertCircle } from 'lucide-react';

/**
 * 📄 TERMS OF SERVICE PAGE
 * Professional legal page
 */

export function TermsOfService() {
  return (
    <div className="bg-black min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400">
            Last Updated: January 6, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-8 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing and using Pulse ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <p>
              If you do not agree to these Terms of Service, you should not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.1 Eligibility</h3>
            <p className="mb-4">
              You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you meet this requirement.
            </p>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">2.2 Account Registration</h3>
            <p className="mb-4">
              To access certain features, you may need to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Products and Orders</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">3.1 Product Information</h3>
            <p className="mb-4">
              We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">3.2 Pricing</h3>
            <p className="mb-4">
              All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.
            </p>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">3.3 Order Acceptance</h3>
            <p>
              We reserve the right to refuse or cancel any order for any reason, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>Product or service availability</li>
              <li>Errors in product or pricing information</li>
              <li>Fraudulent or unauthorized transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Payments</h2>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">4.1 Payment Methods</h3>
            <p className="mb-4">
              We accept various payment methods including cryptocurrency payments via BTCPay Server. All payments are processed securely.
            </p>
            
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">4.2 Cryptocurrency Payments</h3>
            <p className="mb-4">
              Cryptocurrency transactions are final and non-refundable due to the nature of blockchain technology. Please ensure all payment details are correct before confirming.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Shipping and Delivery</h2>
            <p className="mb-4">
              Shipping times and costs vary by location and product. We are not responsible for delays caused by shipping carriers or customs.
            </p>
            <p>
              Risk of loss and title for products pass to you upon delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by Pulse and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Prohibited Activities</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in any automated use of the system</li>
              <li>Use the Service to transmit viruses or malicious code</li>
              <li>Collect information about other users</li>
              <li>Engage in any activity that could harm minors</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. User Content</h2>
            <p className="mb-4">
              You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content.
            </p>
            <p>
              You represent and warrant that you own or have the necessary rights to submit the content and that such content does not violate any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="mb-2">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
                  </p>
                  <p>
                    WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PULSE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
            </p>
            <p>
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO LIABILITY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Pulse and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Pulse operates, without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved in the courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Updating the "Last Updated" date</li>
              <li>Posting a notice on the Service</li>
              <li>Sending an email to registered users</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="font-semibold text-cyan-400">Pulse Support</p>
              <p>Email: legal@pulse.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </section>

        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
