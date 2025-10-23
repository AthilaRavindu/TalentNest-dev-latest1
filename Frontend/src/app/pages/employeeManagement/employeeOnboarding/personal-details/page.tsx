"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import Input from "@/app/components/Input/page";
import Select from "@/app/components/select/page";
import DateInput from "@/app/components/DateInput/page";
import CountrySelector from "@/app/components/ContrySelector/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";
import { useEffect } from "react";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const steps = [
    "Personal Details",
    "Contact Details",
    "Work Details",
    "Access Credentials",
    "Biometric Enrollment",
    "ATS & Review",
  ];

  const {
    personalDetails,
    currentStep,
    updatePersonalDetails,
    goToNextStep,
    goToPreviousStep,
    error,
  } = useOnboardingForm();

  // Auto-update full name when first name or last name changes
  useEffect(() => {
    if (personalDetails.firstName && personalDetails.lastName) {
      const autoFullName = `${personalDetails.firstName} ${personalDetails.lastName}`;
      if (personalDetails.fullName !== autoFullName) {
        updatePersonalDetails({ fullName: autoFullName });
      }
    }
  }, [
    personalDetails.firstName,
    personalDetails.lastName,
    personalDetails.fullName,
    updatePersonalDetails,
  ]);

  // Passport requirement based on nationality
  const isPassportRequired =
    personalDetails.nationality &&
    personalDetails.nationality.trim().toLowerCase() !== "sri lanka";

  const handleChange = (field: string, value: string) => {
    updatePersonalDetails({ [field]: value });

    // Clear passport if nationality changes to Sri Lanka
    if (field === "nationality" && value.trim().toLowerCase() === "sri lanka") {
      updatePersonalDetails({ passportNumber: "" });
    }
  };

  const handleNext = () => {
    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "fullName",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "nationality",
      "NIC",
      "bloodGroup",
      "religion",
    ];

    // Add passport if required
    if (isPassportRequired) {
      requiredFields.push("passportNumber");
    }

    const missingFields = requiredFields.filter(
      (field) =>
        !personalDetails[field as keyof typeof personalDetails]
          ?.toString()
          .trim()
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    toast.success("Personal details saved successfully!");
    goToNextStep();
    router.push("/pages/employeeManagement/employeeOnboarding/contact-details");
  };

  const handlePrevious = () => {
    if (currentStep === 1) return;
    goToPreviousStep();
  };

  return (
    <div className="flex flex-col max-w-6xl gap-2 py-10 pl-16 mx-auto">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Personal Details
      </h1>
      <Stepper steps={steps} currentStep={currentStep} />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Row 1 */}
          <Input
            label="First Name*"
            placeholder="Enter first name"
            helperText="As per official documents"
            value={personalDetails.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <Input
            label="Last Name*"
            placeholder="Enter last name"
            helperText="As per official documents"
            value={personalDetails.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />

          {/* Row 2 */}
          <Input
            label="Full Name*"
            placeholder="Auto-generated from First Name + Last Name"
            helperText="Automatically generated"
            value={personalDetails.fullName}
            readOnly
            disabled
          />
          <DateInput
            label="Date of Birth*"
            helperText="Select birth date"
            value={personalDetails.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />

          {/* Row 3 */}
          <Select
            label="Gender*"
            helperText="Select gender"
            value={personalDetails.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </Select>

          <Select
            label="Marital Status*"
            helperText="Select marital status"
            value={personalDetails.maritalStatus}
            onChange={(e) => handleChange("maritalStatus", e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
            <option value="civil-partnership">Civil Partnership</option>
          </Select>

          {/* Row 4 - Nationality spans full width */}
          <CountrySelector
            label="Nationality*"
            helperText="Select your nationality"
            value={personalDetails.nationality}
            onChange={(value) => handleChange("nationality", value)}
            required
          />

          {/* Row 5 */}
          <Input
            label="NIC Number*"
            placeholder="Enter NIC number"
            helperText="National Identity Card number"
            value={personalDetails.NIC}
            onChange={(e) => handleChange("NIC", e.target.value)}
          />

          <Input
            label={`Passport Number${isPassportRequired ? "*" : ""}`}
            placeholder="Enter passport number"
            helperText={
              isPassportRequired
                ? "Required for non-Sri Lankan nationals"
                : "If available"
            }
            value={personalDetails.passportNumber}
            onChange={(e) => handleChange("passportNumber", e.target.value)}
          />

          {/* Row 6 */}
          <Select
            label="Blood Group*"
            helperText="Select blood group"
            value={personalDetails.bloodGroup}
            onChange={(e) => handleChange("bloodGroup", e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Select>

          <Select
            label="Religion*"
            helperText="Select religion"
            value={personalDetails.religion}
            onChange={(e) => handleChange("religion", e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="buddhism">Buddhism</option>
            <option value="christianity">Christianity</option>
            <option value="hinduism">Hinduism</option>
            <option value="islam">Islam</option>
            <option value="judaism">Judaism</option>
            <option value="sikhism">Sikhism</option>
            <option value="none">None</option>
            <option value="other">Other</option>
          </Select>
        </div>

        {/* Passport Warning */}
        {personalDetails.nationality && isPassportRequired && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700 flex items-center gap-2">
              <span className="text-base">⚠️</span>
              Non-Sri Lankan nationals must provide a valid passport number.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 
                     rounded-full font-semibold text-lg w-25 h-8 
                     hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white 
                     rounded-full font-semibold text-lg w-25 h-8 
                     hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}