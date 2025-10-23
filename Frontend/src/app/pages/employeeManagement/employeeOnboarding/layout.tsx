"use client";

import { OnboardingProvider, useOnboardingData } from "@/app/contexts/OnboardingContext";

function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useOnboardingData();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading onboarding data...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <LoadingWrapper>{children}</LoadingWrapper>
    </OnboardingProvider>
  );
}