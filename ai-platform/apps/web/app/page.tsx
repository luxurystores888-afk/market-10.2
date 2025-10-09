import { Suspense } from 'react';
import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { AIShowcase } from '@/components/sections/ai-showcase';
import { CryptoSection } from '@/components/sections/crypto-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { CTASection } from '@/components/sections/cta-section';
import { Footer } from '@/components/layout/footer';
import { Navigation } from '@/components/layout/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FloatingChat } from '@/components/chat/floating-chat';
import { VoiceAssistant } from '@/components/ai/voice-assistant';
import { CryptoTicker } from '@/components/crypto/crypto-ticker';
import { BackToTop } from '@/components/ui/back-to-top';

export const metadata: Metadata = {
  title: 'AI-Powered Platform | Future-Ready Full-Stack Solution',
  description: 'Experience the ultimate AI-powered platform with real-time collaboration, cryptocurrency payments, voice recognition, and advanced automation.',
  keywords: [
    'AI platform',
    'full-stack solution',
    'cryptocurrency payments',
    'real-time collaboration',
    'voice recognition',
    'machine learning',
    'blockchain technology',
    'progressive web app'
  ],
  openGraph: {
    title: 'AI-Powered Platform | Future-Ready Full-Stack Solution',
    description: 'Experience the ultimate AI-powered platform with advanced features',
    url: '/',
    siteName: 'AI Platform',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Platform Homepage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Platform | Future-Ready Full-Stack Solution',
    description: 'Experience the ultimate AI-powered platform with advanced features',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

// Structured data for homepage
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "/#website",
      "url": process.env.NEXT_PUBLIC_SITE_URL,
      "name": "AI-Powered Platform",
      "description": "Complete full-stack AI-powered platform with advanced features",
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "Organization",
      "@id": "/#organization",
      "name": "AI Platform",
      "url": process.env.NEXT_PUBLIC_SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "inLanguage": "en-US",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        "contentUrl": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        "width": 512,
        "height": 512,
        "caption": "AI Platform"
      },
      "sameAs": [
        "https://twitter.com/aiplatform",
        "https://linkedin.com/company/aiplatform",
        "https://github.com/aiplatform"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "/#webpage",
      "url": process.env.NEXT_PUBLIC_SITE_URL,
      "name": "AI-Powered Platform | Future-Ready Full-Stack Solution",
      "isPartOf": {
        "@id": "/#website"
      },
      "about": {
        "@id": "/#organization"
      },
      "description": "Experience the ultimate AI-powered platform with real-time collaboration, cryptocurrency payments, voice recognition, and advanced automation.",
      "breadcrumb": {
        "@id": "/#breadcrumb"
      },
      "inLanguage": "en-US",
      "potentialAction": [
        {
          "@type": "ReadAction",
          "target": [process.env.NEXT_PUBLIC_SITE_URL]
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": process.env.NEXT_PUBLIC_SITE_URL
        }
      ]
    }
  ]
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Main Layout */}
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation />

        {/* Crypto Ticker */}
        <CryptoTicker />

        {/* Main Content */}
        <main className="relative">
          {/* Hero Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <HeroSection />
          </Suspense>

          {/* Features Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturesSection />
          </Suspense>

          {/* AI Showcase */}
          <Suspense fallback={<LoadingSpinner />}>
            <AIShowcase />
          </Suspense>

          {/* Cryptocurrency Section */}
          <Suspense fallback={<LoadingSpinner />}>
            <CryptoSection />
          </Suspense>

          {/* Testimonials */}
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsSection />
          </Suspense>

          {/* Pricing */}
          <Suspense fallback={<LoadingSpinner />}>
            <PricingSection />
          </Suspense>

          {/* Call to Action */}
          <Suspense fallback={<LoadingSpinner />}>
            <CTASection />
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating Elements */}
        <FloatingChat />
        <VoiceAssistant />
        <BackToTop />
      </div>
    </>
  );
}
