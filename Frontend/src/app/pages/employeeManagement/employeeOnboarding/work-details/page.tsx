"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import Input from "@/app/components/Input/page";
import Select from "@/app/components/select/page";
import DateInput from "@/app/components/DateInput/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";
import { useOnboardingData } from "@/app/contexts/OnboardingContext";

// Department codes mapping
const departmentCodes = {
  "Human Resources": "HR",
  "Finance": "FIN",
  "Information Technology": "IT",
  "Operations": "OPS",
  "Marketing": "MKT",
  "Sales": "SAL",
  "Engineering": "ENG"
};

// Store employee counters in localStorage for persistence
const getStoredCounters = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem('employeeIdCounters');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const setStoredCounters = (counters: {[key: string]: number}) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('employeeIdCounters', JSON.stringify(counters));
  }
};

// Initialize counters for each department
const initializeCounters = () => {
  const stored = getStoredCounters();
  const currentYear = new Date().getFullYear().toString().slice(-2);
  
  // Reset counters if year changes
  const lastYear = localStorage.getItem('lastEmployeeIdYear');
  if (lastYear !== currentYear) {
    localStorage.setItem('lastEmployeeIdYear', currentYear);
    const newCounters: {[key: string]: number} = {};
    Object.keys(departmentCodes).forEach(dept => {
      newCounters[dept] = 1;
    });
    setStoredCounters(newCounters);
    return newCounters;
  }
  
  // Initialize missing departments
  let hasNewDepartments = false;
  const counters = { ...stored };
  Object.keys(departmentCodes).forEach(dept => {
    if (!counters[dept]) {
      counters[dept] = 1;
      hasNewDepartments = true;
    }
  });
  
  if (hasNewDepartments) {
    setStoredCounters(counters);
  }
  
  return counters;
};

export default function WorkDetailsPage() {
  const router = useRouter();
  
  // Get pre-fetched currencies from context
  const { currencies, isLoading: loadingCurrencies } = useOnboardingData();
  
  const steps = [
    "Personal Details",
    "Contact Details",
    "Work Details",
    "Access Credentials",
    "Biometric Enrollment",
    "ATS & Review",
  ];

  const {
    workDetails,
    currentStep,
    updateWorkDetails,
    goToNextStep,
    goToPreviousStep,
    error
  } = useOnboardingForm();

  const [employeeCounters, setEmployeeCounters] = useState<{[key: string]: number}>({});

  // Initialize counters on component mount
  useEffect(() => {
    const counters = initializeCounters();
    setEmployeeCounters(counters);
  }, []);

  const handleDepartmentChange = (department: string) => {
    updateWorkDetails({ department });
    
    // Auto-generate employee ID when department is selected
    if (department && departmentCodes[department as keyof typeof departmentCodes]) {
      generateEmployeeId(department);
    } else {
      updateWorkDetails({ userId: "" });
    }
  };

  const generateEmployeeId = (department: string) => {
    if (!department) return;

    const deptCode = departmentCodes[department as keyof typeof departmentCodes];
    const currentYear = new Date().getFullYear().toString().slice(-2);
    
    // Get the next employee number for this department
    const nextNumber = employeeCounters[department] || 1;
    const employeeNumber = nextNumber.toString().padStart(4, '0');
    const generatedId = `${deptCode}${currentYear}${employeeNumber}`;
    
    updateWorkDetails({ userId: generatedId });
    
    // Update counter for next time
    const newCounters = {
      ...employeeCounters,
      [department]: nextNumber + 1
    };
    setEmployeeCounters(newCounters);
    setStoredCounters(newCounters);
    
    toast.success(`Employee ID generated: ${generatedId}`);
  };

  const handleChange = (field: string, value: string | number) => {
    updateWorkDetails({ [field]: value });
    
    // Clear termination date if employment type changes to permanent or full-time
    if (field === 'employmentType' && (value === 'full-time' || value === 'part-time')) {
      updateWorkDetails({ terminationDate: '' });
      toast.success("Termination date cleared for permanent position");
    }
  };

  // Check if termination date should be shown based on employment type
  const shouldShowTerminationDate = workDetails.employmentType === 'contract' || workDetails.employmentType === 'intern';

  const handleNext = () => {
    const requiredFields = [
      { field: 'userId', name: 'Employee ID' },
      { field: 'department', name: 'Department' },
      { field: 'position', name: 'Position' },
      { field: 'workLocation', name: 'Work Location' },
      { field: 'employmentType', name: 'Employment Type' },
      { field: 'hireDate', name: 'Hire Date' },
      { field: 'workingHours', name: 'Working Hours' },
      { field: 'basicSalary', name: 'Basic Salary' },
    ];
    
    // Add termination date as required if employment type requires it
    if (shouldShowTerminationDate) {
      requiredFields.push({ field: 'terminationDate', name: 'Termination Date' });
    }
    
    const missingFields = requiredFields.filter(({ field }) => {
      const value = workDetails[field as keyof typeof workDetails];
      return !value || (typeof value === 'string' && value.trim() === '') || 
             (typeof value === 'number' && value === 0);
    });

    if (missingFields.length > 0) {
      const missingNames = missingFields.map(({ name }) => name);
      toast.error(`Please fill required fields: ${missingNames.slice(0, 3).join(', ')}${missingNames.length > 3 ? ` and ${missingNames.length - 3} more` : ''}`);
      return;
    }

    toast.success("Work details saved successfully!");
    goToNextStep();
    router.push("/pages/employeeManagement/employeeOnboarding/access");
  };

  const handlePrevious = () => {
    goToPreviousStep();
    router.push("/pages/employeeManagement/employeeOnboarding/contact-details");
  };

  return (
    <div className="flex flex-col max-w-6xl gap-2 py-10 pl-16 mx-auto">
      <Breadcrumb />
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Work Details</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-8 mt-6 bg-white border border-gray-200 shadow-sm rounded-2xl">
        <div className="grid grid-cols-2 gap-6">
          {/* Employee ID - Auto-generated and read-only */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Employee ID*
            </label>
            <input
              placeholder="Select department to generate ID"
              value={workDetails.userId}
              onChange={(e) => handleChange("userId", e.target.value)}
              className="h-[52px] px-4 border border-gray-300 rounded-xl bg-gray-50 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 placeholder-gray-500"
              readOnly
            />
            <span className="text-xs text-gray-500">
              {workDetails.department 
                ? `Auto-generated for ${workDetails.department}` 
                : "Select department to generate ID"}
            </span>
          </div>

          <Select
            label="Department*"
            helperText="Select department to generate Employee ID"
            value={workDetails.department}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Engineering">Engineering</option>
          </Select>

          <Input
            label="Position*"
            placeholder="Enter job position"
            helperText="Job title or position"
            value={workDetails.position}
            onChange={(e) => handleChange("position", e.target.value)}
          />

          <Input
            label="Manager ID"
            placeholder="Enter manager ID"
            helperText="Reporting manager's employee ID"
            value={workDetails.managerId || ''}
            onChange={(e) => handleChange("managerId", e.target.value)}
          />

          <Input
            label="Work Location*"
            placeholder="Enter work location"
            helperText="Eg: Colombo HQ, Remote, etc."
            value={workDetails.workLocation}
            onChange={(e) => handleChange("workLocation", e.target.value)}
          />

          <Select
            label="Employment Type*"
            helperText="Select employment type"
            value={workDetails.employmentType}
            onChange={(e) => handleChange("employmentType", e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="intern">Intern</option>
            <option value="contract">Contract</option>
          </Select>

          <Select
            label="Employment Status"
            helperText="Current employment status"
            value={workDetails.employmentStatus}
            onChange={(e) => handleChange("employmentStatus", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </Select>

          <DateInput
            label="Hire Date*"
            helperText="Select joining date"
            value={workDetails.hireDate}
            onChange={(e) => handleChange("hireDate", e.target.value)}
          />

          {shouldShowTerminationDate && (
            <DateInput
              label="Termination Date*"
              helperText="Required for contract/intern positions"
              value={workDetails.terminationDate || ''}
              onChange={(e) => handleChange("terminationDate", e.target.value)}
            />
          )}

          <Input
            label="Working Hours*"
            placeholder="Enter working hours"
            helperText="Eg: 6 hours/day"
            value={workDetails.workingHours}
            onChange={(e) => handleChange("workingHours", e.target.value)}
          />

          {/* Salary Fields */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Basic Salary*
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Enter basic salary"
                value={workDetails.basicSalary?.toString() || ''}
                onChange={(e) => handleChange("basicSalary", parseFloat(e.target.value) || 0)}
                className="h-[52px] flex-1 px-4 border border-gray-300 rounded-xl shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-900 placeholder-gray-500"
              />
              <div className="w-32">
                <Select
                  value={workDetails.salaryCurrency || ''}
                  onChange={(e) => handleChange("salaryCurrency", e.target.value)}
                  placeholder="Currency"
                >
                  <option value="">Currency</option>
                  {loadingCurrencies ? (
                    <option value="" disabled>Loading...</option>
                  ) : (
                    currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.value}
                      </option>
                    ))
                  )}
                </Select>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              Monthly basic salary amount
            </span>
          </div>
        </div>

        {workDetails.employmentType && (
          <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h3 className="font-medium text-teal-800 mb-2">Employment Type Information:</h3>
            {shouldShowTerminationDate ? (
              <p className="text-sm text-teal-700">
                ⚠️ Contract and Intern positions require a termination date to be specified.
              </p>
            ) : (
              <p className="text-sm text-teal-700">
                ✅ {workDetails.employmentType === 'full-time' ? 'Full-time' : 'Part-time'} positions do not require a termination date.
              </p>
            )}
          </div>
        )}
      </div>

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