import React, { useState, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/ultraEffects.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';

// 📊 Initialize frontend performance monitoring
import './utils/performanceMonitoring';

// Import viral swarm
import { swarmLoop } from './services/viralSwarm';

// Ultra loading components
const UltraLoadingScreen = lazy(() => import('./components/UltraLoadingScreen').then(m => ({ default: m.UltraLoadingScreen })));

// 🚀 LAZY LOADING: Split routes into separate chunks
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('./pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));
const GamingPage = lazy(() => import('./pages/GamingPage').then(m => ({ default: m.GamingPage })));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage').then(m => ({ default: m.ShowcasePage })));
const PerformancePage = lazy(() => import('./pages/PerformancePage').then(m => ({ default: m.PerformancePage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AutomationDashboard = lazy(() => import('./pages/AutomationDashboard'));
const InfinityPage = lazy(() => import('./pages/InfinityPage').then(m => ({ default: m.InfinityPage })));
const CodeEditorPage = lazy(() => import('./pages/CodeEditorPage').then(m => ({ default: m.CodeEditorPage })));
const SecurityDashboard = lazy(() => import('./components/SecurityDashboard').then(m => ({ default: m.SecurityDashboard })));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));

// 🆕 NEW FEATURE COMPONENTS
const CommunityForum = lazy(() => import('./components/CommunityForum').then(m => ({ default: m.CommunityForum })));
const BlogCMS = lazy(() => import('./components/BlogCMS').then(m => ({ default: m.BlogCMS })));
const EmailMarketing = lazy(() => import('./components/EmailMarketing').then(m => ({ default: m.EmailMarketing })));
const SEOAnalytics = lazy(() => import('./components/SEOAnalytics').then(m => ({ default: m.SEOAnalytics })));
const SocialFeatures = lazy(() => import('./components/SocialFeatures').then(m => ({ default: m.SocialFeatures })));
const AdvancedSearch = lazy(() => import('./components/AdvancedSearch').then(m => ({ default: m.AdvancedSearch })));
const LoyaltySystem = lazy(() => import('./components/LoyaltySystem').then(m => ({ default: m.LoyaltySystem })));
const LiveChat = lazy(() => import('./components/LiveChat').then(m => ({ default: m.LiveChat })));

// 🆕🆕 NEWLY ADDED REVENUE-BOOSTING FEATURES
const LiveChatWidget = lazy(() => import('./components/LiveChatWidget').then(m => ({ default: m.LiveChatWidget })));
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup').then(m => ({ default: m.ExitIntentPopup })));
const SocialProofPopups = lazy(() => import('./components/SocialProofPopups').then(m => ({ default: m.SocialProofPopups })));
const AllAnalytics = lazy(() => import('./components/MicrosoftClarity').then(m => ({ default: m.AllAnalytics })));
const ReferralLeaderboard = lazy(() => import('./components/ReferralLeaderboard').then(m => ({ default: m.ReferralLeaderboard })));
const ScratchCard = lazy(() => import('./components/ScratchCard').then(m => ({ default: m.ScratchCard })));
const FeatureUnlockDashboard = lazy(() => import('./components/FeatureUnlockDashboard').then(m => ({ default: m.FeatureUnlockDashboard })));
const HyperClientAcquisition = lazy(() => import('./components/HyperClientAcquisition').then(m => ({ default: m.HyperClientAcquisition })));
const AutoDigitalProductMarketplace = lazy(() => import('./components/AutoDigitalProductMarketplace').then(m => ({ default: m.AutoDigitalProductMarketplace })));

// 🚀 LAZY LOADING: Heavy AI components split into separate chunks
const AIShoppingAssistant = lazy(() => import('./components/AIShoppingAssistant').then(m => ({ default: m.AIShoppingAssistant })));
const FloatingChatButton = lazy(() => import('./components/AIShoppingAssistant').then(m => ({ default: m.FloatingChatButton })));
const VoiceShoppingAssistant = lazy(() => import('./components/VoiceShoppingAssistant'));

// Add to lazy imports:
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PersonalMicrosite = lazy(() => import('./pages/PersonalMicrosite'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const AffiliatePage = lazy(() => import('./components/AffiliateMarketing').then(m => ({ default: m.AffiliateMarketing })));
const MaximumProfitDashboard = lazy(() => import('./components/MaximumProfitDashboard').then(m => ({ default: m.MaximumProfitDashboard })));
const RealRevenueDashboard = lazy(() => import('./components/RealRevenueDashboard').then(m => ({ default: m.RealRevenueDashboard })));
const InfiniteProfitDashboard = lazy(() => import('./components/InfiniteProfitDashboard').then(m => ({ default: m.InfiniteProfitDashboard })));
const RealWorkingDashboard = lazy(() => import('./components/RealWorkingDashboard').then(m => ({ default: m.RealWorkingDashboard })));
const FirstDayProfitDashboard = lazy(() => import('./components/FirstDayProfitDashboard').then(m => ({ default: m.FirstDayProfitDashboard })));
const PayWhenYouProfitDashboard = lazy(() => import('./components/PayWhenYouProfitDashboard').then(m => ({ default: m.PayWhenYouProfitDashboard })));

// Legal Pages
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then(m => ({ default: m.RefundPolicy })));

// Checkout Pages
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://your-sentry-dsn@your-self-hosted-sentry/instance', // Set up free self-hosted Sentry
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen bg-black">
            <Header />
            <Suspense fallback={<UltraLoadingScreen message="Loading Pulse Interface..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/gaming" element={<GamingPage />} />
                <Route path="/showcase" element={<ShowcasePage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/automation" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AutomationDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/infinity" element={<InfinityPage />} />
                <Route path="/code-editor" element={<CodeEditorPage />} />
                <Route path="/security" element={
                  <ProtectedRoute requireAdmin={true}>
                    <SecurityDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={<CommunityForum />} />
                <Route path="/blog" element={<BlogCMS />} />
                <Route path="/email-marketing" element={
                  <ProtectedRoute requireAdmin={true}>
                    <EmailMarketing />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requireAdmin={true}>
                    <SEOAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="/social" element={<SocialFeatures />} />
                <Route path="/search" element={<AdvancedSearch />} />
                <Route path="/loyalty" element={<LoyaltySystem />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/blog-page" element={<BlogPage />} />
                <Route path="/microsite/:userId" element={<PersonalMicrosite />} />
                <Route path="/product/:productId" element={<ProductDetails />} />
                <Route path="/affiliate" element={<AffiliatePage />} />
              <Route path="/maximum-profit" element={<MaximumProfitDashboard />} />
              <Route path="/real-revenue" element={<RealRevenueDashboard />} />
              <Route path="/infinite-profit" element={<InfiniteProfitDashboard />} />
              <Route path="/real-working" element={<RealWorkingDashboard />} />
              <Route path="/first-day-profit" element={<FirstDayProfitDashboard />} />
              <Route path="/pay-when-profit" element={<PayWhenYouProfitDashboard />} />
              
              {/* Legal Pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              
              {/* Checkout Pages */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              
              {/* 🆕 Feature Unlock Dashboard - See your progress to $5M! */}
              <Route path="/features-unlock" element={<FeatureUnlockDashboard />} />
              <Route path="/features-dashboard" element={<FeatureUnlockDashboard />} />
              
              {/* 🤖 Automated Digital Product Marketplace - Ultimate Profit Machine! */}
              <Route path="/digital-marketplace" element={<AutoDigitalProductMarketplace />} />
              <Route path="/auto-profit" element={<AutoDigitalProductMarketplace />} />
              </Routes>
            </Suspense>
            
            {/* Advanced Shopping Experience - Lazy Loaded */}
            <Suspense fallback={null}>
              <FloatingChatButton 
                onClick={toggleChat}
                isOpen={isChatOpen}
              />
              {isChatOpen && (
                <AIShoppingAssistant 
                  isOpen={isChatOpen}
                  onToggle={toggleChat}
                />
              )}
            </Suspense>
            
            {/* Voice Shopping Assistant - Lazy Loaded */}
            <Suspense fallback={null}>
              <div className="fixed bottom-20 right-4 z-40">
                <VoiceShoppingAssistant />
              </div>
            </Suspense>
            
            {/* Live Chat Support - Always Available */}
            <Suspense fallback={null}>
              <LiveChat />
            </Suspense>

            {/* 🆕 NEW HIGH-IMPACT FEATURES (ALL FREE!) */}
            <Suspense fallback={null}>
              {/* ⚡ HYPER-SPEED CLIENT ACQUISITION - THE MOST POWERFUL! */}
              {/* 70% capture rate, 3-5 second conversion, multi-channel follow-up */}
              <HyperClientAcquisition />
              
              {/* Live Chat Widget (Tawk.to/Crisp) - +40% conversion */}
              <LiveChatWidget />
              
              {/* Exit Intent Popup - Recover 10-15% of leaving visitors */}
              <ExitIntentPopup discountCode="SAVE15" discountPercent={15} />
              
              {/* Social Proof - Recent purchases, live stats - +15-25% conversion */}
              <SocialProofPopups enabled={true} />
              
              {/* Analytics - Microsoft Clarity + GA4 + FB Pixel - 100% FREE */}
              <AllAnalytics />
            </Suspense>
              </div>
            </WishlistProvider>
          </CartProvider>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);