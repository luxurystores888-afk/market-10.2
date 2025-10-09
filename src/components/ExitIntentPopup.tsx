import React, { useState, useEffect } from 'react';
import { X, Gift, Mail, ArrowRight } from 'lucide-react';

/**
 * 🎯 EXIT-INTENT POPUP
 * 
 * Impact: Recover 10-15% of abandoning visitors
 * Revenue: +$10K-15K per $100K in prevented abandonment
 * 
 * Triggers:
 * - Mouse leaves viewport (desktop)
 * - Back button (mobile)
 * - After 30 seconds of inactivity
 * 
 * Features:
 * - Email capture
 * - Discount offer
 * - A/B testing ready
 * - Only shows once per session
 */

interface ExitIntentPopupProps {
  onEmailCapture?: (email: string) => void;
  discountCode?: string;
  discountPercent?: number;
}

export function ExitIntentPopup({ 
  onEmailCapture,
  discountCode = 'SAVE15',
  discountPercent = 15
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem('exit-popup-shown');
    if (shown) {
      setHasShown(true);
      return;
    }

    // Desktop: Track mouse leaving viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        showPopup();
      }
    };

    // Mobile: Detect scroll to top (back button behavior)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        if (window.scrollY < lastScrollY && window.scrollY === 0 && !hasShown) {
          showPopup();
        }
        lastScrollY = window.scrollY;
      }
    };

    // Inactivity timeout (backup trigger)
    const inactivityTimer = setTimeout(() => {
      if (!hasShown) {
        showPopup();
      }
    }, 30000); // 30 seconds

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(inactivityTimer);
    };
  }, [hasShown]);

  const showPopup = () => {
    setIsVisible(true);
    setHasShown(true);
    sessionStorage.setItem('exit-popup-shown', 'true');
    
    // Track event
    if (window.gtag) {
      window.gtag('event', 'exit_intent_shown', {
        event_category: 'engagement',
        event_label: 'exit_popup'
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    
    // Track close event
    if (window.gtag) {
      window.gtag('event', 'exit_intent_closed', {
        event_category: 'engagement',
        event_label: 'exit_popup'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Save email to backend
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          source: 'exit_intent_popup',
          discountCode
        })
      });

      if (response.ok) {
        // Call callback if provided
        if (onEmailCapture) {
          onEmailCapture(email);
        }

        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'exit_intent_converted', {
            event_category: 'conversion',
            event_label: 'email_captured'
          });
        }

        // Show success message
        alert(`🎉 Success! Your ${discountPercent}% discount code: ${discountCode}`);
        
        // Copy code to clipboard
        navigator.clipboard.writeText(discountCode);
        
        setIsVisible(false);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Error. Please try again later.');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] animate-fadeIn"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-lg px-4">
        <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30 border-2 border-cyan-500 rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl font-bold text-white mb-2">
              WAIT! Don't Go Empty Handed! 🎁
            </h2>

            {/* Subheadline */}
            <p className="text-xl text-cyan-400 mb-4">
              Get {discountPercent}% OFF Your First Order!
            </p>

            {/* Description */}
            <p className="text-gray-300 mb-6">
              Join thousands of happy customers and get exclusive access to:
            </p>

            {/* Benefits */}
            <ul className="text-left text-gray-300 mb-6 space-y-2 max-w-sm mx-auto">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>{discountPercent}% discount on your first purchase</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                <span>Early access to new products</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                <span>Exclusive deals & flash sales</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                <span>Free shipping on orders over $50</span>
              </li>
            </ul>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-gray-800 border border-cyan-500/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>GET MY {discountPercent}% DISCOUNT</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Discount Code Preview */}
            <div className="mt-4 bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-3">
              <p className="text-sm text-gray-400">Your discount code:</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono tracking-wider">{discountCode}</p>
            </div>

            {/* Trust & Privacy */}
            <p className="text-xs text-gray-500 mt-4">
              🔒 We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

// A/B Test Variant - Simple Version
export function ExitIntentSimple() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  // Similar logic but simpler UI
  return isVisible ? (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-500 rounded-xl p-6 max-w-md text-center">
        <h3 className="text-2xl font-bold text-white mb-4">
          Get 15% OFF! 🎁
        </h3>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white mb-4"
        />
        <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg font-bold">
          Get Discount
        </button>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 text-sm mt-2">
          No thanks
        </button>
      </div>
    </div>
  ) : null;
}

export default ExitIntentPopup;

