"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import Input from "@/app/components/Input/page";
import Select from "@/app/components/select/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";
import { useOnboardingData } from "@/app/contexts/OnboardingContext";
import { State, IState, Country } from "country-state-city";

// Define interface for country data structure
interface CountryData {
  name: {
    common: string;
  };
  cca2: string;
}

export default function ContactDetailsPage() {
  const router = useRouter();
  
  // Get pre-fetched data from context
  const { countries: allCountries, dialCodes: countryDialCodes } = useOnboardingData();

  const steps = [
    "Personal Details",
    "Contact Details",
    "Work Details",
    "Access Credentials",
    "Biometric Enrollment",
    "ATS & Review",
  ];

  const {
    contactDetails,
    personalDetails,
    currentStep,
    updateContactDetails,
    goToNextStep,
    goToPreviousStep,
    error,
    markStepCompleted,
  } = useOnboardingForm();

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [countryIsoCode, setCountryIsoCode] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  // Get flag image URL from country code
  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  // Get the country from personal details
  const countryName = personalDetails.nationality || "";

  // Find selected country and set ISO code
  useEffect(() => {
    if (countryName && allCountries.length > 0) {
      const countryData = allCountries.find(
        (c) => c.name.common === countryName
      );
      if (countryData) {
        setSelectedCountry(countryData);
        
        // Find ISO code using country-state-city for states
        const countryStateData = Country.getAllCountries().find(
          (c) => c.name === countryName
        );
        
        if (countryStateData) {
          setCountryIsoCode(countryStateData.isoCode);
        } else {
          // Fallback: try to find by common name or other properties
          const alternativeMatch = Country.getAllCountries().find(
            (c) => c.name.toLowerCase().includes(countryName.toLowerCase()) ||
                   countryName.toLowerCase().includes(c.name.toLowerCase())
          );
          setCountryIsoCode(alternativeMatch?.isoCode || "");
        }
        
        // Auto-set the country in both addresses if not already set
        if (!contactDetails.currentAddress.country) {
          updateContactDetails({
            currentAddress: {
              ...contactDetails.currentAddress,
              country: countryName,
            },
          });
        }
        
        if (!contactDetails.permanentAddress.country && !sameAsCurrent) {
          updateContactDetails({
            permanentAddress: {
              ...contactDetails.permanentAddress,
              country: countryName,
            },
          });
        }
      }
    }
  }, [countryName, allCountries, contactDetails.currentAddress.country, contactDetails.permanentAddress.country, sameAsCurrent, updateContactDetails]);

  // Get states for the selected country - with better fallback for countries without states
  const getStatesForCountry = (): IState[] => {
    if (!countryIsoCode) return [];
    
    try {
      const states = State.getStatesOfCountry(countryIsoCode);
      
      // If no states found, check if this is a country that typically doesn't have states
      if (states.length === 0) {
        // Expanded list of countries that don't have states/regions
        const countriesWithoutStates = [
          'SG', 'MC', 'VA', 'SM', 'LI', 'AD', 'MT', 'SC', 'MV', 'BH', 'QA', 'CY',
          'LU', 'IS', 'MT', 'FO', 'GL', 'GI', 'BM', 'KY', 'VG', 'FK', 'PN', 'TC',
          'WF', 'NR', 'TV', 'KI', 'CK', 'NU', 'TO', 'WS', 'FM', 'MH', 'PW', 'AQ'
        ];
        
        if (countriesWithoutStates.includes(countryIsoCode)) {
          return [];
        }
        
        // Also check if country exists in our allCountries but no states in country-state-city
        const countryExists = allCountries.find(c => c.cca2 === countryIsoCode);
        if (countryExists) {
          console.log(`Country ${countryName} (${countryIsoCode}) exists but has no states in database`);
          return [];
        }
      }
      
      return states;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  };

  const states: IState[] = getStatesForCountry();

  // Check if country has states available
  const hasStates = states.length > 0;

  // Get country dial code
  const getCountryDialCode = () => {
    if (countryName && countryDialCodes[countryName]) {
      return countryDialCodes[countryName];
    }
    return "+94"; // Default to Sri Lanka
  };

  const handleChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      updateContactDetails({
        [parent]: {
          ...((contactDetails[parent as keyof typeof contactDetails] ||
            {}) as object),
          [child]: value,
        },
      });
    } else {
      updateContactDetails({ [field]: value });
    }
  };

  const handleSameAddressChange = (checked: boolean) => {
    setSameAsCurrent(checked);
    if (checked) {
      updateContactDetails({
        permanentAddress: {
          ...contactDetails.currentAddress,
        },
      });
      toast.success("Permanent address copied from current address");
    } else {
      updateContactDetails({
        permanentAddress: {
          addressLine: "",
          city: "",
          province: "",
          postalCode: "",
          country: contactDetails.currentAddress.country || countryName || "",
        },
      });
    }
  };

  const handleNext = () => {
    // Get current country states availability
    const currentStates = getStatesForCountry();
    const currentHasStates = currentStates.length > 0;

    const requiredFields = [
      { field: contactDetails.workEmail, name: "Work Email" },
      { field: contactDetails.personalPhoneNumber, name: "Personal Phone" },
      { field: contactDetails.currentAddress.addressLine, name: "Current Address Line" },
      { field: contactDetails.currentAddress.city, name: "Current City" },
      { field: contactDetails.currentAddress.postalCode, name: "Current Postal Code" },
      { field: contactDetails.currentAddress.country, name: "Current Country" },
      { field: contactDetails.permanentAddress.addressLine, name: "Permanent Address Line" },
      { field: contactDetails.permanentAddress.city, name: "Permanent City" },
      { field: contactDetails.permanentAddress.postalCode, name: "Permanent Postal Code" },
      { field: contactDetails.permanentAddress.country, name: "Permanent Country" },
      { field: contactDetails.emergencyContact.name, name: "Emergency Contact Name" },
      { field: contactDetails.emergencyContact.phoneNumber, name: "Emergency Contact Phone" },
      { field: contactDetails.emergencyContact.relationship, name: "Emergency Contact Relationship" },
    ];

    // Only require province if the country has states available
    if (currentHasStates) {
      if (!contactDetails.currentAddress.province?.trim()) {
        requiredFields.push({ field: "", name: "Current Province" });
      }
      if (!contactDetails.permanentAddress.province?.trim() && !sameAsCurrent) {
        requiredFields.push({ field: "", name: "Permanent Province" });
      }
    }

    const missingFields = requiredFields.filter(({ field }) => !field?.trim());

    if (missingFields.length > 0) {
      const missingNames = missingFields.map(({ name }) => name);
      toast.error(
        `Please fill all required fields: ${missingNames
          .slice(0, 3)
          .join(", ")}${missingNames.length > 3 ? ` and ${missingNames.length - 3} more` : ""}`
      );
      return;
    }

    // Mark this step as completed
    if (markStepCompleted) {
      markStepCompleted(2); // Mark contact details step (step 2) as completed
    }

    toast.success("Contact details saved successfully!");
    goToNextStep();
    router.push("/pages/employeeManagement/employeeOnboarding/work-details");
  };

  const handlePrevious = () => {
    goToPreviousStep();
    router.push("/pages/employeeManagement/employeeOnboarding/personal-details");
  };

  return (
    <div className="flex flex-col max-w-6xl gap-2 py-10 pl-16 mx-auto">
      <Breadcrumb />
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Contact Details</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Contact Info */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="pb-3 mb-6 text-xl font-semibold text-gray-800 border-b border-gray-100">
            Contact Information
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Work Email*"
              placeholder="Enter work email"
              helperText="Primary email address"
              type="email"
              value={contactDetails.workEmail}
              onChange={(e) => handleChange("workEmail", e.target.value)}
            />
            
            {/* Personal Phone with Country Code */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Personal Phone*
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-xl bg-gray-50 min-w-[100px]">
                  {selectedCountry && (
                    <img 
                      src={getFlagUrl(selectedCountry.cca2)} 
                      alt={`${selectedCountry.name.common} flag`}
                      className="w-5 h-3 object-cover rounded-sm"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {getCountryDialCode()}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={contactDetails.personalPhoneNumber}
                    onChange={(e) => handleChange("personalPhoneNumber", e.target.value)}
                    className="w-full h-[52px] px-4 border border-gray-300 rounded-xl bg-transparent text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500">
                Based on your nationality: {countryName || "Not set"}
              </span>
            </div>

            {/* WhatsApp Number with Country Code */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-xl bg-gray-50 min-w-[100px]">
                  {selectedCountry && (
                    <img 
                      src={getFlagUrl(selectedCountry.cca2)} 
                      alt={`${selectedCountry.name.common} flag`}
                      className="w-5 h-3 object-cover rounded-sm"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {getCountryDialCode()}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Enter WhatsApp number"
                    value={contactDetails.whatsappPhoneNumber}
                    onChange={(e) => handleChange("whatsappPhoneNumber", e.target.value)}
                    className="w-full h-[52px] px-4 border border-gray-300 rounded-xl bg-transparent text-gray-900  shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500">
                For quick communication
              </span>
            </div>
          </div>
        </div>

        {/* Current Address */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="pb-3 mb-6 text-xl font-semibold text-gray-800 border-b border-gray-100">
            Current Address
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Address Line*"
              placeholder="Enter current address"
              helperText="House number, street name"
              value={contactDetails.currentAddress.addressLine}
              onChange={(e) => handleChange("currentAddress.addressLine", e.target.value)}
            />
            <Input
              label="City*"
              placeholder="Enter city"
              helperText="Current city"
              value={contactDetails.currentAddress.city}
              onChange={(e) => handleChange("currentAddress.city", e.target.value)}
            />
            
            {/* Country Display with Flag */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Country*
              </label>
              <div className="h-[52px] w-full rounded-xl border border-gray-300 bg-gray-50 
                            shadow-sm flex items-center px-4 gap-3">
                {selectedCountry && (
                  <img 
                    src={getFlagUrl(selectedCountry.cca2)} 
                    alt={`${selectedCountry.name.common} flag`}
                    className="w-8 h-5 object-cover rounded-sm"
                  />
                )}
                <span className="text-gray-600">
                  {countryName || "Not specified in personal details"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                From personal details nationality
              </span>
            </div>

            {/* Province/State - Show Select if available, otherwise show Input */}
            {hasStates ? (
              <Select
                label="Province/State*"
                helperText="Select province or state"
                value={contactDetails.currentAddress.province}
                onChange={(e) => handleChange("currentAddress.province", e.target.value)}
              >
                <option value="">Select province/state</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                label="Province/Region"
                placeholder="Enter province or region"
                helperText={countryName ? `${countryName} doesn't have states` : "Enter province or region"}
                value={contactDetails.currentAddress.province}
                onChange={(e) => handleChange("currentAddress.province", e.target.value)}
              />
            )}
            
            <Input
              label="Postal Code*"
              placeholder="Enter postal code"
              helperText="Current area postal code"
              value={contactDetails.currentAddress.postalCode}
              onChange={(e) => handleChange("currentAddress.postalCode", e.target.value)}
            />
          </div>
          
          {!countryName && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⚠️ Please set your nationality in Personal Details to see states/provinces.
              </p>
            </div>
          )}
        </div>

        {/* Permanent Address */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Permanent Address</h2>
            <label className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50 hover:bg-teal-50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsCurrent}
                onChange={(e) => handleSameAddressChange(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
              />
              <span className="font-medium">Same as current address</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Address Line*"
              placeholder="Enter permanent address"
              helperText="House number, street name"
              value={contactDetails.permanentAddress.addressLine}
              onChange={(e) => handleChange("permanentAddress.addressLine", e.target.value)}
              disabled={sameAsCurrent}
            />
            <Input
              label="City*"
              placeholder="Enter city"
              helperText="Permanent city"
              value={contactDetails.permanentAddress.city}
              onChange={(e) => handleChange("permanentAddress.city", e.target.value)}
              disabled={sameAsCurrent}
            />
            
            {/* Country Display with Flag */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Country*
              </label>
              <div className="h-[52px] w-full rounded-xl border border-gray-300 bg-gray-50 
                            shadow-sm flex items-center px-4 gap-3">
                {selectedCountry && (
                  <img 
                    src={getFlagUrl(selectedCountry.cca2)} 
                    alt={`${selectedCountry.name.common} flag`}
                    className="w-8 h-5 object-cover rounded-sm"
                  />
                )}
                <span className="text-gray-600">
                  {countryName || "Not specified in personal details"}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                From personal details nationality
              </span>
            </div>

            {/* Province/State - Show Select if available, otherwise show Input */}
            {hasStates ? (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Province/State*</label>
                <select
                  value={contactDetails.permanentAddress.province}
                  onChange={(e) => handleChange("permanentAddress.province", e.target.value)}
                  disabled={sameAsCurrent}
                  className={`h-[52px] w-full px-4 border border-gray-300 rounded-xl shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all ${
                    sameAsCurrent ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-900'
                  }`}
                >
                  <option value="">Select province/state</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">Select province or state</span>
              </div>
            ) : (
              <Input
                label="Province/Region"
                placeholder="Enter province or region"
                helperText={countryName ? `${countryName} doesn't have states` : "Enter province or region"}
                value={contactDetails.permanentAddress.province}
                onChange={(e) => handleChange("permanentAddress.province", e.target.value)}
                disabled={sameAsCurrent}
              />
            )}
            
            <Input
              label="Postal Code*"
              placeholder="Enter postal code"
              helperText="Permanent area postal code"
              value={contactDetails.permanentAddress.postalCode}
              onChange={(e) => handleChange("permanentAddress.postalCode", e.target.value)}
              disabled={sameAsCurrent}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="pb-3 mb-6 text-xl font-semibold text-gray-800 border-b border-gray-100">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Emergency Contact Name*"
              placeholder="Enter emergency contact name"
              helperText="Full name of emergency contact"
              value={contactDetails.emergencyContact.name}
              onChange={(e) => handleChange("emergencyContact.name", e.target.value)}
            />
            
            {/* Emergency Contact Phone with Country Code */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Emergency Contact Phone*
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 border border-gray-300 rounded-xl bg-gray-50 min-w-[100px]">
                  {selectedCountry && (
                    <img 
                      src={getFlagUrl(selectedCountry.cca2)} 
                      alt={`${selectedCountry.name.common} flag`}
                      className="w-5 h-3 object-cover rounded-sm"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {getCountryDialCode()}
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={contactDetails.emergencyContact.phoneNumber}
                    onChange={(e) => handleChange("emergencyContact.phoneNumber", e.target.value)}
                    className="w-full h-[52px] px-4 border border-gray-300 rounded-xl bg-transparent text-gray-900 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500">
                Primary contact number
              </span>
            </div>

            <Select
              label="Relationship*"
              helperText="Relationship to employee"
              value={contactDetails.emergencyContact.relationship}
              onChange={(e) => handleChange("emergencyContact.relationship", e.target.value)}
            >
              <option value="">Select relationship</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Child">Child</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        {/* Social Media */}
        <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
          <h2 className="pb-3 mb-6 text-xl font-semibold text-gray-800 border-b border-gray-100">
            Social Media (Optional)
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="LinkedIn Profile"
              placeholder="Enter LinkedIn profile URL"
              helperText="Professional profile link"
              type="url"
              value={contactDetails.socialMediaLinks.linkedinProfile}
              onChange={(e) => handleChange("socialMediaLinks.linkedinProfile", e.target.value)}
            />
            <Input
              label="Facebook Profile"
              placeholder="Enter Facebook profile URL"
              helperText="Personal profile link"
              type="url"
              value={contactDetails.socialMediaLinks.facebookProfile}
              onChange={(e) => handleChange("socialMediaLinks.facebookProfile", e.target.value)}
            />
          </div>
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
          className="flex items-center justify-center h-8 gap-2 px-8 py-4 text-lg font-semibold text-white transition-colors bg-teal-600 rounded-full shadow-md w-25 hover:bg-teal-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}