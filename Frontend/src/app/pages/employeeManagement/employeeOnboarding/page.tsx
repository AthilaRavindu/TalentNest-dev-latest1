"use client";

import React, { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings, UserPlus, Workflow, ListChecks } from "lucide-react";

// Card Component matching admin style
const OnboardingCard = React.memo(({ 
  title, 
  description, 
  features, 
  icon: Icon, 
  iconBg, 
  onClick,
  className = "" 
}: {
  title: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  iconBg: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-8 transition-all duration-200 border border-gray-200/50 transform hover:-translate-y-1 shadow-2xl hover:shadow-black/25 hover:shadow-2xl cursor-pointer group min-h-[420px] flex flex-col ${className}`}
    >
      {/* Title pill */}
      <div className="absolute -top-3 left-6">
        <div
          className="px-4 py-1.5 rounded-full border border-white/20 text-xs text-white font-medium shadow-2xl shadow-black/40"
          style={{
            background: "linear-gradient(135deg, #009688 0%, #00796b 100%)",
            filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
          }}
        >
          {title}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between pt-4">
        {/* Icon Section */}
        <div className="flex justify-center mb-8">
          <div className={`p-6 rounded-2xl ${iconBg} transition-transform duration-200 group-hover:scale-110 shadow-lg`}>
            <Icon className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4 flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>

          <ul className="space-y-3 text-gray-600 text-sm mt-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center justify-center gap-3">
                <span className="w-2 h-2 rounded-full bg-teal-500 shadow-sm"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* View Button */}
      <div className="absolute -bottom-3 right-6">
        <button
          className="px-6 py-2 rounded-full border text-sm inline-flex items-center gap-1.5 transition-all duration-200 transform hover:scale-105 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-xl hover:from-gray-200 hover:to-gray-300 hover:shadow-2xl"
        >
          Configure <span style={{ color: "#009688" }}>›</span>
        </button>
      </div>
    </div>
  );
});

OnboardingCard.displayName = "OnboardingCard";

export default function EmployeeOnboarding() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStepperSetupClick = useCallback(() => {
    startTransition(() => {
      router.push("/pages/employeeManagement/employeeOnboarding/stepper-setup");
    });
  }, [router]);

  const handleDefaultOnboardingClick = useCallback(() => {
    startTransition(() => {
      router.push("/pages/employeeManagement/employeeOnboarding/personal-details");
    });
  }, [router]);

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-background/80 backdrop-blur-sm p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full mb-4">
              <span className="text-sm font-semibold text-teal-700">TalentNest HR</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Employee Onboarding
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Configure your onboarding workflow or start the default employee onboarding process. 
              Customize steppers and stages to match your company s hiring process.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
            {/* Stepper Configuration Card */}
            <OnboardingCard
              title="Configure Onboarding Steps"
              description="Customize the onboarding workflow by adding, removing, or modifying steps in the onboarding process."
              features={[
                "Add/Remove Stepper Stages",
                "Customize Required Fields", 
                "Set Approval Workflows",
                "Configure Document Templates"
              ]}
              icon={Workflow}
              iconBg="bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-600/25"
              onClick={handleStepperSetupClick}
            />

            {/* Default Onboarding Card */}
            <OnboardingCard
              title="Start Employee Onboarding"
              description="Begin the standard onboarding process with pre-configured steps for new hires."
              features={[
                "Personal Information Collection",
                "Employment Details", 
                "Document Submission",
                "System Access Setup"
              ]}
              icon={UserPlus}
              iconBg="bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25"
              onClick={handleDefaultOnboardingClick}
            />
          </div>

          {/* Current Stepper Configuration */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">Current Onboarding Steps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm font-medium text-blue-700">Step 1</div>
                  <div className="text-xs text-blue-600">Personal Details</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="text-sm font-medium text-green-700">Step 2</div>
                  <div className="text-xs text-green-600">Employment Info</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="text-sm font-medium text-purple-700">Step 3</div>
                  <div className="text-xs text-purple-600">Documents</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="text-sm font-medium text-orange-700">Step 4</div>
                  <div className="text-xs text-orange-600">Final Review</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">6 steps configured • 2 approval stages</span>
              </div>
            </div>
          </div>

          {/* Bottom Status */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">
                Onboarding system ready • Default workflow active
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}