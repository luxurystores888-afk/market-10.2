import React from 'react';
import { Lock, Eye, Database, Shield } from 'lucide-react';

/**
 * 🔒 PRIVACY POLICY PAGE
 * GDPR-compliant privacy policy
 */

export function PrivacyPolicy() {
  return (
    <div className="bg-black min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Lock className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last Updated: January 6, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-8 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Pulse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  2.1 Information You Provide
                </h3>
                <p className="mb-2">We collect information that you voluntarily provide:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Account information (name, email, password)</li>
                  <li>Profile information (avatar, bio, preferences)</li>
                  <li>Payment information (crypto wallet addresses)</li>
                  <li>Shipping information (address, phone number)</li>
                  <li>Communication data (support tickets, reviews)</li>
                  <li>User-generated content (reviews, comments)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  2.2 Information Collected Automatically
                </h3>
                <p className="mb-2">We automatically collect certain information:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device information (browser, OS, device type)</li>
                  <li>Usage data (pages visited, time spent, clicks)</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and analytics data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">2.3 Information from Third Parties</h3>
                <p className="mb-2">We may receive information from:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Social media platforms (if you link your account)</li>
                  <li>Payment processors</li>
                  <li>Analytics providers</li>
                  <li>Marketing partners</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information for:</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-purple-400 mb-2">Service Delivery</h4>
                <ul className="text-sm space-y-1">
                  <li>• Process orders and payments</li>
                  <li>• Manage your account</li>
                  <li>• Provide customer support</li>
                  <li>• Send order updates</li>
                </ul>
              </div>
              
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-cyan-400 mb-2">Improvement</h4>
                <ul className="text-sm space-y-1">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve user experience</li>
                  <li>• Develop new features</li>
                  <li>• Fix bugs and issues</li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-2">Communication</h4>
                <ul className="text-sm space-y-1">
                  <li>• Send newsletters (opt-in)</li>
                  <li>• Marketing communications</li>
                  <li>• Important service updates</li>
                  <li>• Respond to inquiries</li>
                </ul>
              </div>
              
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-pink-400 mb-2">Security</h4>
                <ul className="text-sm space-y-1">
                  <li>• Prevent fraud</li>
                  <li>• Protect against abuse</li>
                  <li>• Enforce terms of service</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
            <p className="mb-4">We may share your information with:</p>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Service Providers</p>
                  <p className="text-sm">Payment processors, shipping carriers, cloud hosting providers</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Business Transfers</p>
                  <p className="text-sm">In case of merger, acquisition, or sale of assets</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">Legal Requirements</p>
                  <p className="text-sm">When required by law, court order, or legal process</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-white">With Your Consent</p>
                  <p className="text-sm">When you explicitly authorize information sharing</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="font-semibold text-green-400 mb-2">✅ We NEVER:</p>
              <ul className="text-sm space-y-1">
                <li>• Sell your personal information</li>
                <li>• Share your data without purpose</li>
                <li>• Use your information for unrelated purposes</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>SSL/TLS encryption for data in transit</li>
              <li>Encrypted storage for sensitive data</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing (PCI-DSS compliant)</li>
              <li>Regular backups and disaster recovery plans</li>
            </ul>
            <p className="mt-4 text-yellow-400 text-sm">
              ⚠️ However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
            <p className="mb-4">You have the right to:</p>
            
            <div className="space-y-3">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <p className="font-semibold text-cyan-400">Access</p>
                <p className="text-sm">Request a copy of your personal information</p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="font-semibold text-purple-400">Correction</p>
                <p className="text-sm">Request correction of inaccurate information</p>
              </div>
              
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                <p className="font-semibold text-pink-400">Deletion</p>
                <p className="text-sm">Request deletion of your personal information</p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="font-semibold text-green-400">Portability</p>
                <p className="text-sm">Request your data in a portable format</p>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="font-semibold text-yellow-400">Opt-Out</p>
                <p className="text-sm">Unsubscribe from marketing communications</p>
              </div>
            </div>
            
            <p className="mt-4">
              To exercise your rights, contact us at <span className="text-cyan-400 font-semibold">privacy@pulse.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Essential cookies (required for Service functionality)</li>
              <li>Performance cookies (analyze usage and improve Service)</li>
              <li>Functionality cookies (remember your preferences)</li>
              <li>Marketing cookies (personalized advertising)</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide the Service</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="mt-4">
              After this period, we will delete or anonymize your information unless required by law to retain it longer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our Service is not intended for children under 18. We do not knowingly collect information from children.
            </p>
            <p>
              If you believe we have collected information from a child, please contact us immediately, and we will delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Updating the "Last Updated" date</li>
              <li>Posting a prominent notice on the Service</li>
              <li>Sending an email notification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
            <p className="mb-4">
              For privacy-related questions or concerns:
            </p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="font-semibold text-purple-400">Privacy Team</p>
              <p>Email: privacy@pulse.com</p>
              <p>Data Protection Officer: dpo@pulse.com</p>
              <p>Address: [Your Company Address]</p>
            </div>
          </section>

        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
