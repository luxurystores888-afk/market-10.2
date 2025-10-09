/**
 * 💬 WHATSAPP BUSINESS SUPPORT
 * 
 * Direct customer support via WhatsApp
 * 98% open rate vs 20% email!
 * 
 * REAL WORKING FEATURE!
 */

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface WhatsAppSupportProps {
  phoneNumber?: string;
  message?: string;
}

export const WhatsAppSupport: React.FC<WhatsAppSupportProps> = ({
  phoneNumber = '1234567890', // Replace with your WhatsApp Business number
  message = 'Hi! I have a question about your products.'
}) => {
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={openWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-200 flex items-center gap-2 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Chat on WhatsApp
          </span>
        </button>
      </div>
      
      {/* Inline WhatsApp Contact Option */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-3 rounded-full">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-bold mb-1">Need Help? Chat on WhatsApp!</h4>
            <p className="text-gray-400 text-sm">Get instant answers from our support team.</p>
          </div>
          <button
            onClick={openWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition-all"
          >
            Chat Now
          </button>
        </div>
      </div>
    </>
  );
};

export default WhatsAppSupport;

