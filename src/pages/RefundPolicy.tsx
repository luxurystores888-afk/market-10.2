import React from 'react';
import { RefreshCw, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

/**
 * 💰 REFUND POLICY PAGE
 * Clear refund and return policy
 */

export function RefundPolicy() {
  return (
    <div className="bg-black min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <RefreshCw className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund & Return Policy
          </h1>
          <p className="text-gray-400">
            Last Updated: January 6, 2025
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Summary</h2>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-semibold text-white">30 Days</p>
              <p className="text-sm text-gray-300">Return Window</p>
            </div>
            <div>
              <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="font-semibold text-white">Full Refund</p>
              <p className="text-sm text-gray-300">If Eligible</p>
            </div>
            <div>
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="font-semibold text-white">Easy Process</p>
              <p className="text-sm text-gray-300">Simple Returns</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-8 text-gray-300">
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Return Eligibility</h2>
            
            <div className="mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Eligible for Return
                </h3>
                <ul className="space-y-2 ml-4">
                  <li>• Unopened products in original packaging</li>
                  <li>• Defective or damaged items</li>
                  <li>• Wrong item received</li>
                  <li>• Items not as described</li>
                  <li>• Within 30 days of delivery</li>
                </ul>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Not Eligible for Return
                </h3>
                <ul className="space-y-2 ml-4">
                  <li>• Opened or used products</li>
                  <li>• Custom or personalized items</li>
                  <li>• Digital products or services</li>
                  <li>• Clearance or final sale items</li>
                  <li>• Items without original packaging</li>
                  <li>• Items damaged by customer</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How to Return</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Contact Us</h3>
                  <p>Email support@pulse.com with your order number and reason for return</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Get Authorization</h3>
                  <p>Wait for Return Authorization (RA) number via email</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Pack Item</h3>
                  <p>Pack the item securely in original packaging with RA number</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Ship It</h3>
                  <p>Ship to the address provided in your RA email</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Get Refund</h3>
                  <p>Receive refund within 5-10 business days after inspection</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Refund Methods</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-purple-400 mb-2">Credit Card Refunds</h3>
                <p className="text-sm">
                  Refunded to original payment method within 5-10 business days
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-cyan-400 mb-2">Cryptocurrency Refunds</h3>
                <p className="text-sm">
                  Refunded to same wallet address within 1-3 business days
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">Store Credit</h3>
                <p className="text-sm">
                  Optional store credit available immediately (110% value)
                </p>
              </div>

              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-pink-400 mb-2">Exchange</h3>
                <p className="text-sm">
                  Free exchange for different size/color if available
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Shipping Costs</h2>
            
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-400 mb-2">✅ We Pay Return Shipping:</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Defective or damaged items</li>
                  <li>• Wrong item shipped</li>
                  <li>• Our error</li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-400 mb-2">⚠️ You Pay Return Shipping:</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Change of mind</li>
                  <li>• Item no longer needed</li>
                  <li>• Wrong size/color ordered</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Defective Items</h2>
            <p className="mb-4">
              If you receive a defective item:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide photos/videos of the defect</li>
              <li>We'll send a replacement immediately (free shipping)</li>
              <li>Or provide full refund including original shipping</li>
            </ul>
            
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="font-semibold text-red-400 mb-2">Emergency Contact</p>
              <p className="text-sm">For urgent defective item issues: emergency@pulse.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Crypto Payment Special Terms</h2>
            <p className="mb-4">
              Due to the nature of cryptocurrency transactions:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Refunds are processed to the original wallet address</li>
              <li>Refund amount is based on USD value at time of purchase</li>
              <li>Processing time: 1-3 business days</li>
              <li>Network fees may apply (deducted from refund)</li>
              <li>Ensure wallet address remains accessible</li>
            </ul>
            
            <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-cyan-400 font-semibold">💡 Pro Tip:</p>
              <p className="text-sm mt-1">
                Opt for store credit to avoid crypto volatility and get 110% value!
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Partial Refunds</h2>
            <p className="mb-4">
              Partial refunds may be issued for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Items with obvious signs of use</li>
              <li>Items missing accessories or parts</li>
              <li>Items returned after 30 days (at our discretion)</li>
              <li>Items with minor damage not reported initially</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Exchanges</h2>
            <p className="mb-4">
              We offer free exchanges for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Different size of same product</li>
              <li>Different color of same product</li>
              <li>Same price range item</li>
            </ul>
            <p>
              Exchanges are processed faster than refunds (usually 3-5 business days).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Late or Missing Refunds</h2>
            <p className="mb-4">
              If you haven't received your refund:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-cyan-400 font-bold">1.</div>
                <p>Check your bank account (processing takes 5-10 days)</p>
              </div>
              <div className="flex gap-3">
                <div className="text-cyan-400 font-bold">2.</div>
                <p>Contact your bank or crypto wallet provider</p>
              </div>
              <div className="flex gap-3">
                <div className="text-cyan-400 font-bold">3.</div>
                <p>If still not received, contact us: refunds@pulse.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Damaged in Transit</h2>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="mb-2">
                <span className="font-semibold text-orange-400">Important:</span> If your package arrives damaged:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>1. Do NOT refuse delivery</li>
                <li>2. Accept the package and note damage</li>
                <li>3. Take photos immediately</li>
                <li>4. Contact us within 24 hours</li>
                <li>5. We'll send replacement or full refund</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. International Returns</h2>
            <p className="mb-4">
              International returns have additional considerations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Customer responsible for return shipping costs</li>
              <li>Customs duties/taxes are non-refundable</li>
              <li>Allow 10-15 business days for processing</li>
              <li>Currency conversion at time of refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <p className="mb-4">
              For returns and refunds:
            </p>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 space-y-2">
              <p><span className="font-semibold text-green-400">General:</span> support@pulse.com</p>
              <p><span className="font-semibold text-green-400">Refunds:</span> refunds@pulse.com</p>
              <p><span className="font-semibold text-green-400">Emergency:</span> emergency@pulse.com</p>
              <p><span className="font-semibold text-green-400">Phone:</span> +1 (555) 123-4567</p>
              <p><span className="font-semibold text-green-400">Hours:</span> Mon-Fri 9AM-6PM EST</p>
            </div>
          </section>

          <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Our Promise</h2>
            <p className="text-lg mb-4">
              We want you to be completely satisfied with your purchase. If something isn't right, we'll make it right.
            </p>
            <p className="font-semibold text-cyan-400">
              Your satisfaction is our priority! 💙
            </p>
          </section>

        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default RefundPolicy;
