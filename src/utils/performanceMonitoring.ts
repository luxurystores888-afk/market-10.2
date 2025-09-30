// 📊 Frontend Performance Monitoring - Web Vitals & User Experience Tracking

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  [key: string]: any;
}

interface WebVitalsData {
  metric: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  timestamp: number;
  id: string;
  navigationType: string;
  url: string;
}

interface PageLoadMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  timeToFirstByte: number;
  navigationTiming: PerformanceTiming | null;
}

class FrontendPerformanceMonitor {
  private static instance: FrontendPerformanceMonitor;
  private webVitalsData: WebVitalsData[] = [];
  private pageMetrics: PageLoadMetrics | null = null;
  private observer: PerformanceObserver | null = null;

  static getInstance(): FrontendPerformanceMonitor {
    if (!FrontendPerformanceMonitor.instance) {
      FrontendPerformanceMonitor.instance = new FrontendPerformanceMonitor();
    }
    return FrontendPerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    // 📊 Initialize Web Vitals monitoring
    this.initializeWebVitals();
    
    // 📊 Track page load metrics
    this.trackPageLoadMetrics();
    
    // 📊 Monitor long tasks
    this.monitorLongTasks();
    
    // 📊 Track navigation performance
    this.trackNavigationPerformance();
  }

  private initializeWebVitals() {
    try {
      // 🎯 Core Web Vitals monitoring
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        this.observeMetric('largest-contentful-paint', (entry: any) => {
          this.recordWebVital('LCP', entry.startTime, entry.id);
        });

        // First Input Delay (FID)
        this.observeMetric('first-input', (entry: any) => {
          this.recordWebVital('FID', entry.processingStart - entry.startTime, entry.id);
        });

        // Cumulative Layout Shift (CLS)
        this.observeMetric('layout-shift', (entry: any) => {
          if (!entry.hadRecentInput) {
            this.recordWebVital('CLS', entry.value, entry.id);
          }
        });
      }

      // 🎯 First Contentful Paint (FCP) via Navigation Timing
      this.trackFCP();
      
      // 🎯 Time to First Byte (TTFB)
      this.trackTTFB();
      
    } catch (error) {
      console.warn('Web Vitals monitoring failed:', error);
    }
  }

  private observeMetric(type: string, callback: (entry: any) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          callback(entry);
        }
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private recordWebVital(metric: WebVitalsData['metric'], value: number, id: string) {
    const vital: WebVitalsData = {
      metric,
      value: Math.round(value),
      timestamp: Date.now(),
      id,
      navigationType: this.getNavigationType(),
      url: window.location.href
    };

    this.webVitalsData.push(vital);
    
    // 📊 Send to analytics (optional)
    this.sendToAnalytics('web_vital', vital);
    
    // 🚨 Log poor performance
    this.checkPerformanceThresholds(vital);
  }

  private trackFCP() {
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        this.recordWebVital('FCP', fcpEntry.startTime, 'fcp-' + Date.now());
      }
    } catch (error) {
      console.warn('FCP tracking failed:', error);
    }
  }

  private trackTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.recordWebVital('TTFB', ttfb, 'ttfb-' + Date.now());
      }
    } catch (error) {
      console.warn('TTFB tracking failed:', error);
    }
  }

  private trackPageLoadMetrics() {
    window.addEventListener('load', () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      this.pageMetrics = {
        domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
        loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
        firstPaint: firstPaint?.startTime || 0,
        firstContentfulPaint: firstContentfulPaint?.startTime || 0,
        timeToFirstByte: navigationEntry.responseStart - navigationEntry.requestStart,
        navigationTiming: performance.timing
      };

      // 📊 Send page load metrics to analytics
      this.sendToAnalytics('page_load_metrics', this.pageMetrics);
    });
  }

  private monitorLongTasks() {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn(`🐌 Long Task Detected: ${entry.duration.toFixed(2)}ms`, entry);
              
              // 📊 Track long tasks
              this.sendToAnalytics('long_task', {
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
                timestamp: Date.now()
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      }
    } catch (error) {
      console.warn('Long task monitoring failed:', error);
    }
  }

  private trackNavigationPerformance() {
    // Track route changes for SPA
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    const trackNavigation = () => {
      const startTime = performance.now();
      
      // Use RAF to measure when rendering is complete
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const navigationTime = endTime - startTime;
        
        this.sendToAnalytics('spa_navigation', {
          duration: navigationTime,
          url: window.location.href,
          timestamp: Date.now()
        });
      });
    };

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      trackNavigation();
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      trackNavigation();
    };

    window.addEventListener('popstate', trackNavigation);
  }

  private getNavigationType(): string {
    if ('navigation' in performance) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return nav.type || 'unknown';
    }
    return 'unknown';
  }

  private checkPerformanceThresholds(vital: WebVitalsData) {
    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 }
    };

    const threshold = thresholds[vital.metric];
    if (threshold) {
      if (vital.value > threshold.poor) {
        console.warn(`🚨 POOR ${vital.metric}: ${vital.value} (threshold: ${threshold.poor})`);
      } else if (vital.value > threshold.good) {
        console.warn(`⚠️ NEEDS IMPROVEMENT ${vital.metric}: ${vital.value} (threshold: ${threshold.good})`);
      } else {
        console.log(`✅ GOOD ${vital.metric}: ${vital.value}`);
      }
    }
  }

  private async sendToAnalytics(eventType: string, data: any) {
    try {
      // Send performance data to backend analytics
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType: `performance_${eventType}`,
          eventData: data,
          sessionId: this.getSessionId(),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      // Silently fail - don't break app due to analytics
      console.debug('Analytics send failed:', error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('cyberpunk-session-id');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substring(2);
      sessionStorage.setItem('cyberpunk-session-id', sessionId);
    }
    return sessionId;
  }

  // 📊 Public API for getting performance data
  getWebVitals(): WebVitalsData[] {
    return [...this.webVitalsData];
  }

  getPageMetrics(): PageLoadMetrics | null {
    return this.pageMetrics;
  }

  getCurrentPerformance() {
    return {
      webVitals: this.getWebVitals(),
      pageMetrics: this.getPageMetrics(),
      memory: (performance as any).memory ? {
        used: Math.round(((performance as any).memory.usedJSHeapSize || 0) / 1024 / 1024),
        total: Math.round(((performance as any).memory.totalJSHeapSize || 0) / 1024 / 1024),
        limit: Math.round(((performance as any).memory.jsHeapSizeLimit || 0) / 1024 / 1024)
      } : null,
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null
    };
  }
}

// 📊 Initialize performance monitoring
export const performanceMonitor = FrontendPerformanceMonitor.getInstance();

// 📊 Utility function to track custom events
export const trackPerformanceEvent = (eventName: string, data: any) => {
  performanceMonitor['sendToAnalytics'](eventName, data);
};

export default performanceMonitor;