'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Web3Provider } from './providers/web3-provider';
import { SocketProvider } from './providers/socket-provider';
import { AIProvider } from './providers/ai-provider';
import { AnalyticsProvider } from './providers/analytics-provider';
import { FeatureFlagsProvider } from './providers/feature-flags-provider';
import { GeolocationProvider } from './providers/geolocation-provider';
import { NotificationProvider } from './providers/notification-provider';
import { PerformanceProvider } from './providers/performance-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
        onError: (error: any) => {
          console.error('Mutation error:', error);
        },
      },
    },
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={5 * 60} // 5 minutes
        refetchOnWindowFocus={true}
      >
        <PerformanceProvider>
          <AnalyticsProvider>
            <FeatureFlagsProvider>
              <GeolocationProvider>
                <NotificationProvider>
                  <SocketProvider>
                    <Web3Provider>
                      <AIProvider>
                        {children}
                        <Toaster
                          position="top-right"
                          toastOptions={{
                            duration: 4000,
                            style: {
                              background: 'hsl(var(--card))',
                              color: 'hsl(var(--card-foreground))',
                              border: '1px solid hsl(var(--border))',
                            },
                            success: {
                              duration: 3000,
                              iconTheme: {
                                primary: 'hsl(var(--primary))',
                                secondary: 'hsl(var(--primary-foreground))',
                              },
                            },
                            error: {
                              duration: 5000,
                              iconTheme: {
                                primary: 'hsl(var(--destructive))',
                                secondary: 'hsl(var(--destructive-foreground))',
                              },
                            },
                            loading: {
                              duration: Infinity,
                            },
                          }}
                        />
                      </AIProvider>
                    </Web3Provider>
                  </SocketProvider>
                </NotificationProvider>
              </GeolocationProvider>
            </FeatureFlagsProvider>
          </AnalyticsProvider>
        </PerformanceProvider>
      </SessionProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
