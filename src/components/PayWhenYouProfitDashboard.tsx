import React, { useState, useEffect } from 'react';
import { Lock, Unlock, DollarSign, TrendingUp, CheckCircle, XCircle, Zap, Award, Target, Rocket } from 'lucide-react';

/**
 * 🔐 PAY WHEN YOU PROFIT DASHBOARD
 * لوحة تحكم نظام "ادفع عند الربح"
 * 
 * Shows all paid features locked until $5M profit
 * Then auto-unlocks and shows payment instructions
 * 
 * يعرض جميع المميزات المقفلة حتى 5 مليون دولار
 * ثم يفتح تلقائيًا ويعرض تعليمات الدفع
 */

interface FeatureStatus {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  monthlyCost: number;
  yearlyDiscount: number;
  benefits: string[];
  benefitsAr: string[];
  provider: string;
  setupInstructions: string;
  status: {
    available: boolean;
    locked: boolean;
    reason: string;
    reasonAr: string;
    unlockAt: number;
  };
  isActivated: boolean;
}

interface FeatureLockStatus {
  unlocked: boolean;
  unlockedAt: string | null;
  currentProfit: number;
  currentProfitFormatted: string;
  threshold: number;
  thresholdFormatted: string;
  remaining: number;
  remainingFormatted: string;
  progress: string;
  features: FeatureStatus[];
  categories: Record<string, any>;
}

export const PayWhenYouProfitDashboard: React.FC = () => {
  const [status, setStatus] = useState<FeatureLockStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/feature-lock/status');
      const data = await response.json();
      if (data.success) {
        setStatus(data);
      }
    } catch (error) {
      console.error('Error fetching feature lock status:', error);
    } finally {
      setLoading(false);
    }
  };

  const activateFeature = async (featureId: string) => {
    try {
      const response = await fetch(`/api/feature-lock/activate/${featureId}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        alert(language === 'ar' ? data.messageAr : data.message);
        fetchStatus(); // Refresh
      } else {
        alert(language === 'ar' ? data.messageAr : data.message);
      }
    } catch (error) {
      console.error('Error activating feature:', error);
      alert('Failed to activate feature');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-8 my-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-cyan-400">
          {language === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 my-8">
        <p className="text-red-400 text-center">
          {language === 'ar' 
            ? 'فشل تحميل البيانات. تأكد من تشغيل السيرفر.' 
            : 'Failed to load data. Make sure backend is running.'}
        </p>
      </div>
    );
  }

  const categories = Object.keys(status.categories);
  const filteredFeatures = selectedCategory === 'all' 
    ? status.features 
    : status.features.filter(f => f.category === selectedCategory);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-4 md:p-8">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg transition-all"
        >
          {language === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {status.unlocked ? (
            <Unlock className="w-16 h-16 text-green-400 animate-pulse" />
          ) : (
            <Lock className="w-16 h-16 text-yellow-400 animate-bounce" />
          )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
          {language === 'ar' ? '🔐 ادفع عند الربح' : '🔐 Pay When You Profit'}
        </h1>
        
        <p className="text-xl text-gray-300 mb-6">
          {language === 'ar' 
            ? 'جميع المميزات المدفوعة مقفلة حتى تحقيق أرباح 5 مليون دولار'
            : 'All paid features locked until you make $5M profit'}
        </p>
      </div>

      {/* Progress Section */}
      <div className={`border-4 rounded-2xl p-8 mb-8 ${
        status.unlocked 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500'
          : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500'
      }`}>
        {!status.unlocked ? (
          <>
            {/* Locked State */}
            <div className="text-center mb-6">
              <Lock className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {language === 'ar' ? '🔒 مقفل' : '🔒 LOCKED'}
              </h2>
              <p className="text-gray-300">
                {language === 'ar' 
                  ? 'استمر في البناء! المميزات المدفوعة ستُفتح عند $5M'
                  : 'Keep building! Paid features unlock at $5M profit'}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/50 rounded-lg p-4 text-center border border-cyan-500/30">
                <DollarSign className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.currentProfitFormatted}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'الربح الحالي' : 'Current Profit'}
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 text-center border border-yellow-500/30">
                <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.thresholdFormatted}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'الهدف' : 'Target'}
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 text-center border border-orange-500/30">
                <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.remainingFormatted}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'المتبقي' : 'Remaining'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>
                  {language === 'ar' 
                    ? `التقدم: ${status.progress}%` 
                    : `Progress: ${status.progress}%`}
                </span>
                <span>
                  {language === 'ar' 
                    ? `${status.remainingFormatted} متبقي`
                    : `${status.remainingFormatted} to go`}
                </span>
              </div>
              <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-full transition-all duration-500 flex items-center justify-center text-xs font-bold"
                  style={{ width: `${status.progress}%` }}
                >
                  {parseFloat(status.progress) > 10 && `${status.progress}%`}
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500 rounded-lg p-4 text-center">
              <Rocket className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-semibold">
                {language === 'ar' 
                  ? '💪 استمر! أنت تستخدم حزمة مجانية بالكامل حتى $5M'
                  : '💪 Keep going! You\'re using 100% free stack until $5M'}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Unlocked State */}
            <div className="text-center mb-6">
              <Unlock className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {language === 'ar' ? '🎉 مفتوح!' : '🎉 UNLOCKED!'}
              </h2>
              <p className="text-gray-300">
                {language === 'ar' 
                  ? 'تهانينا! لقد حققت $5M. جميع المميزات المدفوعة متاحة الآن!'
                  : 'Congratulations! You hit $5M. All paid features now available!'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/50 rounded-lg p-4 text-center border border-green-500">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.currentProfitFormatted}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'إجمالي الربح' : 'Total Profit'}
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 text-center border border-blue-500">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.features.length}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'مميزات متاحة' : 'Features Available'}
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 text-center border border-purple-500">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {status.features.filter(f => f.isActivated).length}
                </div>
                <div className="text-sm text-gray-400">
                  {language === 'ar' ? 'مُفعَّل' : 'Activated'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedCategory === 'all'
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {language === 'ar' ? 'الكل' : 'All'} ({status.features.length})
        </button>
        {categories.map(cat => {
          const catData = status.categories[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {catData.name.split('(')[language === 'ar' ? 1 : 0].replace(')', '')} ({catData.count})
            </button>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map(feature => (
          <div
            key={feature.id}
            className={`rounded-xl p-6 border-2 transition-all ${
              feature.status.available
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500'
                : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  {language === 'ar' ? feature.nameAr : feature.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {feature.provider}
                </p>
              </div>
              <div>
                {feature.status.available ? (
                  feature.isActivated ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Unlock className="w-6 h-6 text-yellow-400" />
                  )
                ) : (
                  <Lock className="w-6 h-6 text-gray-500" />
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4">
              {language === 'ar' ? feature.descriptionAr : feature.description}
            </p>

            {/* Cost */}
            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {language === 'ar' ? 'التكلفة:' : 'Cost:'}
                </span>
                <span className="text-white font-bold">
                  ${feature.monthlyCost}/
                  {language === 'ar' ? 'شهر' : 'mo'}
                </span>
              </div>
              {feature.yearlyDiscount > 0 && (
                <div className="text-xs text-green-400 mt-1">
                  💎 {(feature.yearlyDiscount * 100)}% {language === 'ar' ? 'خصم سنوي' : 'yearly discount'}
                </div>
              )}
            </div>

            {/* Benefits Preview */}
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">
                {language === 'ar' ? 'المزايا:' : 'Benefits:'}
              </div>
              <div className="space-y-1">
                {(language === 'ar' ? feature.benefitsAr : feature.benefits).slice(0, 3).map((benefit, i) => (
                  <div key={i} className="text-sm text-gray-300 flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            {!feature.status.available ? (
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-center">
                <Lock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <p className="text-xs text-yellow-400">
                  {language === 'ar' ? feature.status.reasonAr : feature.status.reason}
                </p>
              </div>
            ) : feature.isActivated ? (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <p className="text-xs text-green-400">
                  {language === 'ar' ? 'مُفعَّل' : 'Activated'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => activateFeature(feature.id)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                {language === 'ar' ? 'تفعيل الآن' : 'Activate Now'}
              </button>
            )}

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(showDetails === feature.id ? null : feature.id)}
              className="w-full text-cyan-400 text-sm mt-2 hover:text-cyan-300 transition-all"
            >
              {showDetails === feature.id 
                ? (language === 'ar' ? 'إخفاء التفاصيل' : 'Hide Details')
                : (language === 'ar' ? 'عرض التفاصيل' : 'Show Details')}
            </button>

            {/* Expanded Details */}
            {showDetails === feature.id && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-2">
                    {language === 'ar' ? 'جميع المزايا:' : 'All Benefits:'}
                  </div>
                  <div className="space-y-1">
                    {(language === 'ar' ? feature.benefitsAr : feature.benefits).map((benefit, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-start">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
                
                {feature.status.available && (
                  <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
                    <div className="text-xs text-blue-400 font-semibold mb-1">
                      {language === 'ar' ? '📋 تعليمات الإعداد:' : '📋 Setup Instructions:'}
                    </div>
                    <div className="text-xs text-gray-300">
                      {feature.setupInstructions}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cost Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-blue-500 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">
          {language === 'ar' ? '💰 ملخص التكلفة' : '💰 Cost Summary'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(status.categories).map(([key, cat]: [string, any]) => (
            <div key={key} className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">
                {cat.name.split('(')[language === 'ar' ? 1 : 0].replace(')', '')}
              </div>
              <div className="text-xl font-bold text-white">
                {cat.monthlyCostFormatted}/
                {language === 'ar' ? 'شهر' : 'mo'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {cat.count} {language === 'ar' ? 'مميزة' : 'features'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <div className="text-sm text-gray-400 mb-2">
            {language === 'ar' ? 'إجمالي التكلفة الشهرية' : 'Total Monthly Cost'}
          </div>
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            ${status.features.reduce((sum, f) => sum + f.monthlyCost, 0).toLocaleString()}/
            {language === 'ar' ? 'شهر' : 'mo'}
          </div>
          {status.unlocked && (
            <div className="mt-4 text-green-400 font-semibold">
              ✅ {language === 'ar' 
                ? 'أنت الآن لديك الميزانية لتغطية جميع هذه المميزات!'
                : 'You now have the budget to cover all these features!'}
            </div>
          )}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchStatus}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-all"
        >
          🔄 {language === 'ar' ? 'تحديث الحالة' : 'Refresh Status'}
        </button>
      </div>
    </div>
  );
};

export default PayWhenYouProfitDashboard;
