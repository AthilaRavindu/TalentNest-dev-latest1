"use client";

import { useRouter } from "next/navigation";
import { Lock, Shield } from "lucide-react";
import toast from 'react-hot-toast';
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";

export default function BiometricEnrollmentPage() {
  const steps = [
    "Personal Details",
    "Contact Details",
    "Work Details",
    "Access Credentials",
    "Biometric Enrollment",
    "ATS & Review",
  ];

  const {
    biometrics,
    currentStep,
    updateBiometrics,
    goToNextStep,
    goToPreviousStep,
    error
  } = useOnboardingForm();

  const router = useRouter();

  const handleDisabledClick = (type: string) => {
    toast.error(`${type} enrollment is not available on admin panel`, {
      icon: '🔒',
      duration: 3000,
    });
  };

  const handleNext = () => {
    toast.success("Proceeding to final review", {
      icon: '✅',
      duration: 2000,
    });
    goToNextStep();
    router.push("/pages/employeeManagement/employeeOnboarding/ATS-Review");
  };

  const handlePrevious = () => {
    goToPreviousStep();
    router.push("/pages/employeeManagement/employeeOnboarding/access");
  };

  return (
    <div className="flex flex-col max-w-6xl gap-2 py-10 pl-16 mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Title */}
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Biometric Enrollment
      </h1>

      {/* Stepper */}
      <div className="mb-12">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Admin Restriction Notice */}
      <div className="p-6 mb-6 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Admin Panel Restriction</h3>
            <p className="text-amber-800 text-sm">
              Biometric enrollment is disabled on the admin panel for security reasons. 
              Employees can set up biometrics through their employee portal.
            </p>
          </div>
        </div>
      </div>

      {/* Biometric Container - Disabled State */}
      <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <h2 className="pb-3 mb-8 text-xl font-semibold text-gray-800 border-b border-gray-100">
          Biometric Authentication
        </h2>

        <div className="flex flex-col items-center justify-center gap-16 md:flex-row">
          {/* Fingerprint - Disabled */}
          <div className="flex flex-col justify-between w-80 h-[32rem] p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
            <div>
              <h3 className="mb-6 text-lg font-bold text-gray-400 border-b border-gray-200 pb-2 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Fingerprint
              </h3>
              <div
                className="flex items-center justify-center w-56 h-72 mb-6 bg-gray-200 border-2 border-dashed border-gray-300 relative mx-auto"
                style={{ borderRadius: "50% / 35%" }}
              >
                <div className="text-center">
                  <Lock className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">Disabled</p>
                </div>
              </div>
              <div className="mb-4 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm">
                Not available in admin panel
              </div>
            </div>
            <button
              onClick={() => handleDisabledClick("Fingerprint")}
              disabled
              className="w-full py-3 font-medium text-gray-400 bg-gray-200 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Disabled
            </button>
          </div>

          {/* Face Recognition - Disabled */}
          <div className="flex flex-col justify-between w-80 h-[32rem] p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
            <div>
              <h3 className="mb-6 text-lg font-bold text-gray-400 border-b border-gray-200 pb-2 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                Face Recognition
              </h3>
              <div
                className="flex items-center justify-center w-56 h-72 mb-6 bg-gray-200 border-2 border-dashed border-gray-300 relative mx-auto"
                style={{ borderRadius: "50% / 35%" }}
              >
                <div className="text-center">
                  <Lock className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm font-medium">Disabled</p>
                </div>
              </div>
              <div className="mb-4 px-3 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm">
                Not available in admin panel
              </div>
            </div>
            <button
              onClick={() => handleDisabledClick("Face Recognition")}
              disabled
              className="w-full py-3 font-medium text-gray-400 bg-gray-200 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Disabled
            </button>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Enrollment Status:</h4>
          <div className="flex gap-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-600 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Fingerprint: Disabled
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-600 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Face ID: Disabled
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Biometric setup will be available to the employee through their portal account.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handlePrevious}
          className="flex items-center justify-center h-8 gap-1 px-8 py-4 text-lg font-semibold text-gray-700 transition-colors bg-gray-100 rounded-full w-25 hover:bg-gray-200"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center justify-center h-8 gap-2 px-8 py-4 text-lg font-semibold text-white transition-colors bg-teal-500 rounded-full shadow-sm w-25 hover:bg-teal-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}