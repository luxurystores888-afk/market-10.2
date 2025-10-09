import { useEffect } from 'react';

/**
 * 💬 LIVE CHAT WIDGET - Tawk.to Integration
 * 
 * FREE forever - unlimited agents
 * 40% conversion increase on inquiries
 * 
 * Setup: Add your Tawk.to property ID in .env
 * Get it from: https://tawk.to (free signup)
 */

export function LiveChatWidget() {
  useEffect(() => {
    // Tawk.to widget ID (replace with your own from tawk.to dashboard)
    const tawkPropertyId = import.meta.env.VITE_TAWK_PROPERTY_ID || 'YOUR_TAWK_PROPERTY_ID';
    const tawkWidgetId = import.meta.env.VITE_TAWK_WIDGET_ID || 'default';

    // Don't load if IDs not configured
    if (tawkPropertyId === 'YOUR_TAWK_PROPERTY_ID') {
      console.log('💬 Live Chat: Add VITE_TAWK_PROPERTY_ID to .env to enable');
      return;
    }

    // Load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    document.body.appendChild(script);

    // Customize widget appearance
    script.onload = () => {
      if (window.Tawk_API) {
        // Set custom properties
        window.Tawk_API.onLoad = function() {
          console.log('💬 Live Chat loaded successfully');
          
          // Hide widget on mobile if needed
          if (window.innerWidth < 768) {
            window.Tawk_API.hideWidget();
            // Show after 5 seconds on mobile
            setTimeout(() => window.Tawk_API.showWidget(), 5000);
          }
        };

        // Track chat events
        window.Tawk_API.onChatStarted = function() {
          console.log('💬 Chat started');
          // Optional: Send to analytics
          if (window.gtag) {
            window.gtag('event', 'chat_started', {
              event_category: 'engagement',
              event_label: 'live_chat'
            });
          }
        };
      }
    };

    return () => {
      // Cleanup: remove script if component unmounts
      const existingScript = document.querySelector(`script[src*="tawk.to"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // This component doesn't render anything - it just loads the script
  return null;
}

// Alternative: Crisp Chat (another FREE option)
export function CrispChatWidget() {
  useEffect(() => {
    const crispWebsiteId = import.meta.env.VITE_CRISP_WEBSITE_ID;

    if (!crispWebsiteId) {
      console.log('💬 Crisp Chat: Add VITE_CRISP_WEBSITE_ID to .env to enable');
      return;
    }

    // Load Crisp
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispWebsiteId;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="crisp.chat"]`);
      if (existingScript) existingScript.remove();
    };
  }, []);

  return null;
}

// Facebook Messenger Integration
export function FacebookMessenger() {
  useEffect(() => {
    const fbPageId = import.meta.env.VITE_FACEBOOK_PAGE_ID;

    if (!fbPageId) {
      console.log('💬 FB Messenger: Add VITE_FACEBOOK_PAGE_ID to .env to enable');
      return;
    }

    // Load Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        xfbml: true,
        version: 'v18.0'
      });
    };

    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
    document.body.appendChild(script);

    // Add messenger div
    const messengerDiv = document.createElement('div');
    messengerDiv.className = 'fb-customerchat';
    messengerDiv.setAttribute('attribution', 'biz_inbox');
    messengerDiv.setAttribute('page_id', fbPageId);
    document.body.appendChild(messengerDiv);

    return () => {
      const existingScript = document.querySelector(`script[src*="facebook.net"]`);
      if (existingScript) existingScript.remove();
      const existingDiv = document.querySelector('.fb-customerchat');
      if (existingDiv) existingDiv.remove();
    };
  }, []);

  return null;
}

export default LiveChatWidget;

