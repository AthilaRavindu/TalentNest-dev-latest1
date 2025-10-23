"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ChevronLeft, Loader } from "lucide-react";
import toast from 'react-hot-toast';
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";
import { useAppDispatch } from "@/app/store";
import { submitOnboardingData, resetOnboarding } from "@/app/store/slices/onboardingSlice";
import { State, Country } from "country-state-city";

type StepName =
  | "Personal Details"
  | "Contact Details"
  | "Work Details"
  | "Access Credentials"
  | "Biometric Enrollment";

// Define interfaces for data display
interface DataDisplayValue {
  [key: string]: string | number | boolean | null | undefined | DataDisplayValue;
}

export default function ATSReviewPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const steps: StepName[] = [
    "Personal Details",
    "Contact Details",
    "Work Details",
    "Access Credentials",
    "Biometric Enrollment",
  ];

  const {
    personalDetails,
    contactDetails,
    workDetails,
    accessCredentials,
    biometrics,
    currentStep,
    completedSteps,
    isLoading,
    error,
    isSubmitted,
    markStepCompleted
  } = useOnboardingForm();

  const [reviewNotes, setReviewNotes] = useState("");
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [onboardingApproved, setOnboardingApproved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to check if a country has states
  const countryHasStates = (countryName: string): boolean => {
    if (!countryName) return false;
    
    try {
      const country = Country.getAllCountries().find(
        (c) => c.name === countryName
      );
      
      if (!country) return false;
      
      const states = State.getStatesOfCountry(country.isoCode);
      
      // List of countries that typically don't have states
      const countriesWithoutStates = [
        'SG', 'MC', 'VA', 'SM', 'LI', 'AD', 'MT', 'SC', 'MV', 'BH', 'QA', 'CY',
        'LU', 'IS', 'MT', 'FO', 'GL', 'GI', 'BM', 'KY', 'VG', 'FK', 'PN', 'TC',
        'WF', 'NR', 'TV', 'KI', 'CK', 'NU', 'TO', 'WS', 'FM', 'MH', 'PW', 'AQ'
      ];
      
      if (countriesWithoutStates.includes(country.isoCode)) {
        return false;
      }
      
      return states.length > 0;
    } catch (error) {
      console.error('Error checking states for country:', error);
      return false;
    }
  };

  // Validation function to check if each step is complete
  const validateStep = (stepName: StepName): boolean => {
    switch (stepName) {
      case "Personal Details":
        return !!(
          personalDetails.firstName &&
          personalDetails.lastName &&
          personalDetails.fullName &&
          personalDetails.dateOfBirth &&
          personalDetails.gender &&
          personalDetails.maritalStatus &&
          personalDetails.nationality &&
          personalDetails.NIC &&
          personalDetails.bloodGroup &&
          personalDetails.religion
        );
      
      case "Contact Details":
        const currentCountry = contactDetails.currentAddress.country || personalDetails.nationality;
        const permanentCountry = contactDetails.permanentAddress.country || personalDetails.nationality;
        
        const currentHasStates = countryHasStates(currentCountry);
        const permanentHasStates = countryHasStates(permanentCountry);
        
        // Base required fields
        const baseFieldsValid = !!(
          contactDetails.workEmail &&
          contactDetails.personalPhoneNumber &&
          contactDetails.currentAddress.addressLine &&
          contactDetails.currentAddress.city &&
          contactDetails.currentAddress.postalCode &&
          contactDetails.currentAddress.country &&
          contactDetails.permanentAddress.addressLine &&
          contactDetails.permanentAddress.city &&
          contactDetails.permanentAddress.postalCode &&
          contactDetails.permanentAddress.country &&
          contactDetails.emergencyContact.name &&
          contactDetails.emergencyContact.phoneNumber &&
          contactDetails.emergencyContact.relationship
        );

        // Only require province if the country has states
        const currentProvinceValid = !currentHasStates || !!contactDetails.currentAddress.province;
        const permanentProvinceValid = !permanentHasStates || !!contactDetails.permanentAddress.province;

        return baseFieldsValid && currentProvinceValid && permanentProvinceValid;
      
      case "Work Details":
        return !!(
          workDetails.userId &&
          workDetails.department &&
          workDetails.position &&
          workDetails.workLocation &&
          workDetails.hireDate &&
          workDetails.employmentType &&
          workDetails.workingHours &&
          workDetails.basicSalary > 0
        );
      
      case "Access Credentials":
        return !!(
          accessCredentials.username &&
          accessCredentials.password &&
          accessCredentials.username.length >= 3 &&
          accessCredentials.password.length >= 8
        );
      
      case "Biometric Enrollment":
        // Biometric is optional, so always return true
        return true;
      
      default:
        return false;
    }
  };

  // Create completion summary
  const completedStepsData: Record<StepName, boolean> = {
    "Personal Details": validateStep("Personal Details"),
    "Contact Details": validateStep("Contact Details"),
    "Work Details": validateStep("Work Details"),
    "Access Credentials": validateStep("Access Credentials"),
    "Biometric Enrollment": validateStep("Biometric Enrollment"),
  };

  const allStepsComplete = Object.values(completedStepsData).every(Boolean);

  // Auto-mark completed steps in Redux when component mounts
  useEffect(() => {
    Object.entries(completedStepsData).forEach(([stepName, isComplete], index) => {
      const stepNumber = index + 1;
      if (isComplete && !completedSteps.includes(stepNumber)) {
        markStepCompleted(stepNumber);
      }
    });
  }, [completedStepsData, completedSteps, markStepCompleted]);

  const handleSubmit = async () => {
    if (!documentsVerified || !onboardingApproved) {
      toast.error("Please verify all checkboxes before submitting.", {
        icon: '⚠️',
        duration: 4000,
      });
      return;
    }

    if (!allStepsComplete) {
      toast.error("Please complete all required steps before submitting.", {
        icon: '📋',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
    const submitToast = toast.loading('Submitting onboarding data...');

    try {
      // Mark the ATS step as completed before submitting
      markStepCompleted(6);
      
      // Submit to backend via Redux thunk
      const result = await dispatch(submitOnboardingData()).unwrap();
      
      toast.dismiss(submitToast);
      toast.success(`Onboarding completed successfully! 🎉\nUser ID: ${result.user?._id || 'Generated'}`, {
        duration: 5000,
        style: {
          background: '#10b981',
          color: 'white',
        },
      });
      
      // Clear form data and redirect
      setTimeout(() => {
        // Reset the form state
        dispatch(resetOnboarding());
        
        // Clear any localStorage/sessionStorage if used
        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboardingForm');
          localStorage.removeItem('persist:onboarding');
          sessionStorage.removeItem('onboardingData');
        }
        
        // Force a hard redirect to dashboard
        window.location.href = "/pages/dashboard";
      }, 1500);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast.dismiss(submitToast);
      toast.error(`Failed to submit onboarding: ${error}`, {
        icon: '❌',
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    router.push("/pages/employeeManagement/employeeOnboarding/biometry");
  };

  // Helper function to safely render values
  const renderValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not provided';
    }
    return String(value);
  };

  // Helper function to format field names
  const formatFieldName = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Helper function to filter out empty values
  const filterValidData = (data: DataDisplayValue): DataDisplayValue => {
    const filtered: DataDisplayValue = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const nestedFiltered = filterValidData(value as DataDisplayValue);
        if (Object.keys(nestedFiltered).length > 0) {
          filtered[key] = nestedFiltered;
        }
      } else if (value !== null && value !== undefined && value !== '') {
        filtered[key] = value;
      }
    });
    
    return filtered;
  };

  // Data summary component
  const DataSummarySection = ({ title, data, isValid }: { 
    title: string; 
    data: DataDisplayValue; 
    isValid: boolean;
  }) => {
    const renderDataEntries = (obj: DataDisplayValue, prefix = ''): React.ReactElement[] => {
      const entries: React.ReactElement[] = [];
      
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          // Handle nested objects
          const nestedEntries = renderDataEntries(value as DataDisplayValue, fullKey);
          entries.push(...nestedEntries);
        } else {
          // Handle primitive values - only show if they have actual values
          if (value !== null && value !== undefined && value !== '') {
            entries.push(
              <div key={fullKey} className="flex justify-between">
                <span className="text-gray-600 capitalize">
                  {formatFieldName(key)}:
                </span>
                <span className="text-gray-900">
                  {renderValue(value)}
                </span>
              </div>
            );
          }
        }
      });
      
      return entries;
    };

    return (
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? 'Complete' : 'Incomplete'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {renderDataEntries(data)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col max-w-6xl gap-2 py-10 pl-16 mx-auto">
      <Breadcrumb />
      
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        ATS & Final Review
      </h1>

      <div className="mb-12">
        <Stepper 
          steps={[...steps, "ATS & Review"]} 
          currentStep={6} 
        />
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          Error: {error}
        </div>
      )}

      {isSubmitted && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 border border-green-300 rounded-lg">
          Onboarding submitted successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Step Completion Summary */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Step Completion Status
          </h2>
          <p className="text-gray-600 mb-6">
            Review all information and complete the onboarding process
          </p>

          <div className="space-y-4 mb-6">
            {Object.entries(completedStepsData).map(([step, completed]) => (
              <div
                key={step}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-gray-900 font-medium">{step}</span>
                </div>
                <span
                  className={`font-medium ${
                    completed ? "text-teal-500" : "text-red-500"
                  }`}
                >
                  {completed ? "Completed" : "Incomplete"}
                </span>
              </div>
            ))}
          </div>

          <div className={`p-4 rounded-lg ${
            allStepsComplete 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-orange-50 border border-orange-200 text-orange-800'
          }`}>
            <div className="flex items-center gap-2">
              {allStepsComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">
                {allStepsComplete 
                  ? "All required steps completed" 
                  : "Some required steps are incomplete"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Data Review Section */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Review</h2>
          
          <DataSummarySection
            title="Personal Details"
            data={filterValidData(personalDetails as DataDisplayValue)}
            isValid={completedStepsData["Personal Details"]}
          />
          
          <DataSummarySection
            title="Contact Details"
            data={filterValidData(contactDetails as DataDisplayValue)}
            isValid={completedStepsData["Contact Details"]}
          />
          
          <DataSummarySection
            title="Work Details"
            data={filterValidData(workDetails as DataDisplayValue)}
            isValid={completedStepsData["Work Details"]}
          />
          
          <DataSummarySection
            title="Access Credentials"
            data={filterValidData({ 
              username: accessCredentials.username, 
              password: accessCredentials.password ? "••••••••" : ""
            } as DataDisplayValue)}
            isValid={completedStepsData["Access Credentials"]}
          />
          
          <DataSummarySection
            title="Biometric Data"
            data={filterValidData({
              fingerprint: biometrics.fingerprint ? "Enrolled" : "Not enrolled",
              faceId: biometrics.faceId ? "Enrolled" : "Not enrolled"
            } as DataDisplayValue)}
            isValid={completedStepsData["Biometric Enrollment"]}
          />
        </div>

        {/* Review Notes */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Review Notes (Optional)
          </h2>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add any additional notes or comments..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Confirmation Checkboxes */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Final Confirmation
          </h2>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={documentsVerified}
                onChange={() => {
                  setDocumentsVerified(prev => !prev);
                  if (!documentsVerified) {
                    toast.success("Documents verified!", { icon: '📄' });
                  }
                }}
                className="mt-1 w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-gray-900 font-medium">
                I confirm that all documents have been verified and are accurate
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={onboardingApproved}
                onChange={() => {
                  setOnboardingApproved(prev => !prev);
                  if (!onboardingApproved) {
                    toast.success("Onboarding approved!", { icon: '✅' });
                  }
                }}
                className="mt-1 w-5 h-5 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-gray-900 font-medium">
                I approve the completion of this employee onboarding process
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handlePrevious}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-8 py-4 h-10 text-lg font-semibold text-gray-700 bg-gray-100 rounded-full w-36 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={handleSubmit}
          disabled={!documentsVerified || !onboardingApproved || !allStepsComplete || isSubmitting}
          className={`flex items-center justify-center gap-2 px-8 py-4 h-10 text-lg font-semibold rounded-full shadow-sm w-64 transition-colors ${
            documentsVerified && onboardingApproved && allStepsComplete && !isSubmitting
              ? "bg-teal-500 text-white hover:bg-teal-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Complete Onboarding"
          )}
        </button>
      </div>
    </div>
  );
}