import React from 'react';
import FullscreenLoader from '@/components/FullscreenLoader';

export default function PlanLoading() {
  return (
    <FullscreenLoader 
      title="Loading your environment..." 
      subtitle="Please wait" 
    />
  );
}
