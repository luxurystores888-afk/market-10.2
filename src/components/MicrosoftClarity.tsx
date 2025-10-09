import { useEffect } from 'react';

/**
 * 📊 MICROSOFT CLARITY - Heatmap & Session Recording
 * 
 * Impact: 10-20% conversion improvement after optimization
 * Cost: 100% FREE - Unlimited sessions
 * 
 * Features:
 * - Heatmaps (where users click)
 * - Scroll maps (how far they scroll)
 * - Session recordings (watch actual users)
 * - Rage clicks (frustration points)
 * - Dead clicks (non-interactive elements)
 * - Quick backs (immediate exits)
 * 
 * Setup:
 * 1. Go to https://clarity.microsoft.com
 * 2. Create free account
 * 3. Add your website
 * 4. Get project ID
 * 5. Add to .env: VITE_CLARITY_PROJECT_ID
 * 
 * Better than:
 * - Hotjar (costs $31/month)
 * - FullStory (costs $299/month)
 * - Crazy Egg (costs $29/month)
 * 
 * Microsoft Clarity is FREE!
 */

export function MicrosoftClarity() {
  useEffect(() => {
    const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

    if (!clarityProjectId) {
      console.log('📊 Microsoft Clarity: Add VITE_CLARITY_PROJECT_ID to .env to enable');
      console.log('ℹ️  Get your project ID from https://clarity.microsoft.com');
      return;
    }

    // Load Microsoft Clarity script
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", clarityProjectId);

    console.log('✅ Microsoft Clarity tracking initialized');

    // Custom event tracking
    if (window.clarity) {
      window.clarity("set", "version", "1.0.0");
      window.clarity("set", "environment", import.meta.env.MODE);
    }
  }, []);

  // This component doesn't render anything
  return null;
}

// Google Analytics 4 Integration
export function GoogleAnalytics() {
  useEffect(() => {
    const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;

    if (!gaTrackingId) {
      console.log('📊 Google Analytics: Add VITE_GA_TRACKING_ID to .env to enable');
      return;
    }

    // Load GA4 script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`;
    document.head.appendChild(script1);

    // GA4 config
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaTrackingId}', {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);

    console.log('✅ Google Analytics 4 initialized');
  }, []);

  return null;
}

// Facebook Pixel
export function FacebookPixel() {
  useEffect(() => {
    const pixelId = import.meta.env.VITE_FACEBOOK_PIXEL_ID;

    if (!pixelId) {
      console.log('📊 Facebook Pixel: Add VITE_FACEBOOK_PIXEL_ID to .env to enable');
      return;
    }

    // Load Facebook Pixel
    (function(f: any, b, e, v, n?: any, t?: any, s?: any){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    })(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');

    console.log('✅ Facebook Pixel initialized');
  }, []);

  return null;
}

// TikTok Pixel
export function TikTokPixel() {
  useEffect(() => {
    const pixelId = import.meta.env.VITE_TIKTOK_PIXEL_ID;

    if (!pixelId) {
      console.log('📊 TikTok Pixel: Add VITE_TIKTOK_PIXEL_ID to .env to enable');
      return;
    }

    // Load TikTok Pixel
    (function() {
      const w = window as any;
      if (w.TiktokAnalyticsObject) return;
      w.TiktokAnalyticsObject = 'ttq';
      w.ttq = w.ttq || [];
      w.ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      w.ttq.setAndDefer = function(t: any, e: any) {
        t[e] = function() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < w.ttq.methods.length; i++) {
        w.ttq.setAndDefer(w.ttq, w.ttq.methods[i]);
      }
      w.ttq.instance = function(t: any) {
        const e = w.ttq._i[t] || [];
        for (let n = 0; n < w.ttq.methods.length; n++) {
          w.ttq.setAndDefer(e, w.ttq.methods[n]);
        }
        return e;
      };
      w.ttq.load = function(e: any, n: any) {
        const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        w.ttq._i = w.ttq._i || {};
        w.ttq._i[e] = [];
        w.ttq._i[e]._u = i;
        w.ttq._t = w.ttq._t || {};
        w.ttq._t[e] = +new Date();
        w.ttq._o = w.ttq._o || {};
        w.ttq._o[e] = n || {};
        const o = document.createElement('script');
        o.type = 'text/javascript';
        o.async = true;
        o.src = i + '?sdkid=' + e + '&lib=' + w.TiktokAnalyticsObject;
        const a = document.getElementsByTagName('script')[0];
        a.parentNode!.insertBefore(o, a);
      };

      w.ttq.load(pixelId);
      w.ttq.page();
    })();

    console.log('✅ TikTok Pixel initialized');
  }, []);

  return null;
}

// All Analytics Component
export function AllAnalytics() {
  return (
    <>
      <MicrosoftClarity />
      <GoogleAnalytics />
      <FacebookPixel />
      <TikTokPixel />
    </>
  );
}

export default MicrosoftClarity;

