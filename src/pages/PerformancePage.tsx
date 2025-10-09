import React from 'react';
import { PerformanceDashboard } from '../components/PerformanceDashboard';

export function PerformancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 py-8 px-4">
      <div className="container mx-auto">
        <PerformanceDashboard />
      </div>
    </div>
  );
}