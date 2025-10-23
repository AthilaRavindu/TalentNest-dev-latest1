import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-based
  className?: string;
}

export default function Stepper({
  steps = [],
  currentStep = 1,
  className = "",
}: StepperProps) {
  if (!steps.length) return null;

  const total = steps.length;
  const active = Math.min(Math.max(currentStep, 1), total);

  // Width from first step center to active step center.
  const progressPct =
    total === 1 ? 100 : ((active - 1) / (total - 1)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {/* Line + Circles layer */}
      <div className="relative w-full h-14 flex items-center">
        {/* Background line */}
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200"
          aria-hidden="true"
        />
        {/* Progress line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-teal-500 transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
          aria-hidden="true"
        />

        {/* Circles */}
        <div className="relative flex w-full justify-between z-10">
          {steps.map((_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < active;
            const isActive = stepNumber === active;

            let circleContent: React.ReactNode;

            if (isActive) {
              circleContent = (
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-teal-500 flex items-center justify-center bg-white">
                    <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-medium">
                      {stepNumber}
                    </div>
                  </div>
                </div>
              );
            } else if (isCompleted) {
              circleContent = (
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-medium">
                  <Check className="w-5 h-5" />
                </div>
              );
            } else {
              circleContent = (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                  {stepNumber}
                </div>
              );
            }

            return (
              <div
                key={i}
                className="flex flex-col items-center"
                aria-current={isActive ? "step" : undefined}
              >
                {circleContent}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-3 flex w-full justify-between">
        {steps.map((label, i) => (
          <div
            key={i}
            className="flex justify-center text-center"
            style={{ width: "2.5rem" }} // slightly larger to match bigger circles
          >
            <span className="text-[12px] leading-tight text-gray-600">
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="sr-only">
        Step {active} of {total}: {steps[active - 1]}
      </p>
    </div>
  );
}