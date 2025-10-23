// components/leaves/ApplyLeaveModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import { X, Clipboard, Upload, Trash2 } from "lucide-react";
import {
  LeaveFormData,
  LeaveDateSelection,
  LeaveTimeType,
} from "@/types/employee/applyLeave.types";
import Select from "@/app/components/select/page";
import DateInput from "@/app/components/employee/leaves/DateInput"
import Textarea from "@/app/components/textarea/page";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    approver: "",
    startDate: "",
    endDate: "",
    reason: "",
    attachments: [],
  });
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [dateSelections, setDateSelections] = useState<LeaveDateSelection[]>([]);

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const leaveTypeOptions: LeaveTimeType[] = [
    "Full day",
    "Half day - Morning",
    "Half day - Afternoon",
    "None Working Day",
  ];

  // Fixed generateDateRange function
  const generateDateRange = (start: string, end: string): LeaveDateSelection[] => {
    if (!start || !end) return [];
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dateArray: LeaveDateSelection[] = [];
    
    // Reset times to avoid timezone issues
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Create a new date object for iteration
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      
      dateArray.push({
        date: currentDate.toISOString().split('T')[0],
        leaveType: isWeekend ? "None Working Day" : "",
        isChecked: !isWeekend,
      });
      
      // Move to next day without modifying the original date
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dateArray;
  };

  // Validate step 1 whenever formData changes
  useEffect(() => {
    const validateStep1 = () => {
      const { leaveType, approver, startDate, endDate, reason } = formData;
      return (
        leaveType.trim() !== "" &&
        approver.trim() !== "" &&
        startDate.trim() !== "" &&
        endDate.trim() !== "" &&
        reason.trim() !== ""
      );
    };

    setIsStep1Valid(validateStep1());
  }, [formData]);

  // Validate step 2 whenever dateSelections changes
  useEffect(() => {
    const validateStep2 = () => {
      // Check if all working days have a leave type selected
      return dateSelections.every((item) => {
        if (item.leaveType === "None Working Day") {
          return true; // Weekends are valid
        }
        return item.leaveType.trim() !== ""; // Working days must have a leave type
      });
    };

    setIsStep2Valid(validateStep2());
  }, [dateSelections]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) {
      // Generate date range before moving to step 2
      const dates = generateDateRange(formData.startDate, formData.endDate);
      setDateSelections(dates);
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updated = [...dateSelections];
    updated[index].isChecked = !updated[index].isChecked;
    setDateSelections(updated);
  };

  const handleLeaveTypeChange = (index: number, type: string) => {
    const updated = [...dateSelections];
    updated[index].leaveType = type;
    setDateSelections(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, file]
      }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFormData(prev => ({
      ...prev,
      attachments: []
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData, dateSelections);
    setShowSuccessMessage(true);
    
    // Hide success message and close modal after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      onClose();
      // Reset form
      setCurrentStep(1);
      setFormData({
        leaveType: "",
        approver: "",
        startDate: "",
        endDate: "",
        reason: "",
        attachments: [],
      });
      setDateSelections([]);
      setUploadedFile(null);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-100 bg-teal-100/50">
      {showSuccessMessage ? (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl">
          <div className="flex items-center justify-center w-20 h-20 mb-6 bg-teal-100 rounded-full">
            <svg
              className="w-10 h-10 text-teal-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Success!</h2>
          <p className="text-center text-gray-600">
            Your leave application has been submitted successfully.
          </p>
        </div>
      ) : (
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex-shrink-0 px-8 py-4 bg-white border-b border-gray-200 rounded-t-3xl">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl">
              <Clipboard className="text-teal-600" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Apply Leave
          </h2>
          <div className="px-8 py-6">
            <div className="relative flex items-center justify-between">
              <div className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  {currentStep > 1 ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium text-white">1</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    currentStep >= 1
                      ? "text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Leave Details
                </span>
              </div>

              <div
                className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-0"
                style={{
                  left: "calc(12.5%)",
                  right: "calc(12.5%)",
                  width: "75%",
                }}
              >
                <div
                  className="h-full transition-all duration-300 bg-teal-600"
                  style={{ width: currentStep === 2 ? "100%" : "0%" }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-white">2</span>
                </div>
                <span
                  className={`text-xs mt-2 ${
                    currentStep >= 2
                      ? "text-teal-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  Leave Dates
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-4 overflow-y-auto">
          {currentStep === 1 ? (
            <div className="py-2 space-y-5">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.leaveType}
                    onChange={(e) =>
                      setFormData({ ...formData, leaveType: e.target.value })
                    }
                  >
                    <option value="">Select Leave Type</option>
                    <option value="casual">Casual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="annual">Annual Leave</option>
                    <option value="no-pay">No-Pay Leave</option>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">Select Leave Type</p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Approver <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.approver}
                    onChange={(e) =>
                      setFormData({ ...formData, approver: e.target.value })
                    }
                  >
                    <option value="">Select Approver</option>
                    <option value="lasith">Lasith</option>
                    <option value="yahampath">Yahampath</option>
                    <option value="navindu">Navindu</option>
                    <option value="athila">Athila</option>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">Select Approver</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Leave Start Date <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">Select Leave Start Date</p>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Leave End Date <span className="text-red-500">*</span>
                  </label>
                  <DateInput
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-gray-500">Select Leave End Date</p>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Reason For Leave <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows={4}
                  placeholder="Type Description Here"
                  maxLength={30}
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">Required field</p>
                  <div className="text-xs text-gray-400">
                    {formData.reason.length}/30
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Attachments (Optional)
                </label>
                <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="flex flex-col items-center">
                    <Upload className="mb-3 text-gray-400" size={32} />
                    <p className="mb-1 text-sm text-gray-700">
                      Choose a file or drag & drop it here
                    </p>
                    <p className="mb-4 text-xs text-gray-400">
                      JPEG, PNG, PDF, and MP4 formats, up to 50MB
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf,.mp4"
                        onChange={handleFileUpload}
                      />
                      <span className="inline-block px-6 py-2 text-white transition-colors bg-teal-600 rounded-lg hover:bg-teal-700">
                        Browse File
                      </span>
                    </label>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="flex items-center justify-between p-3 mt-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded">
                        <svg
                          className="w-4 h-4 text-teal-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">
                        {uploadedFile}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="text-gray-400 transition-colors hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-md py-2 mx-auto space-y-4">
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200">
                <div className="col-span-5">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </span>
                </div>
                <div className="col-span-6">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    Leave Type
                  </span>
                </div>
                <div className="col-span-1"></div>
              </div>

              {dateSelections.map((item, index) => (
                <div
                  key={index}
                  className="grid items-center grid-cols-12 gap-4 py-2"
                >
                  <div className="col-span-5">
                    <span className="text-sm text-gray-900">{item.date}</span>
                  </div>
                  <div className="col-span-6">
                    {item.leaveType === "None Working Day" ? (
                      <span className="text-sm text-teal-600">
                        {item.leaveType}
                      </span>
                    ) : (
                      <Select
                        value={item.leaveType}
                        onChange={(e) =>
                          handleLeaveTypeChange(index, e.target.value)
                        }
                      >
                        <option value="">Select an option</option>
                        {leaveTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    )}
                  </div>
                  <div className="flex items-center justify-center col-span-1">
                    {item.leaveType !== "None Working Day" && (
                      <button className="text-gray-400 transition-colors hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between flex-shrink-0 px-8 py-5 bg-white border-t border-gray-200 rounded-b-3xl">
          {currentStep === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!isStep1Valid}
                className={`px-8 py-2.5 font-medium rounded-lg transition-colors shadow-lg ${
                  isStep1Valid
                    ? "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handlePrevious}
                className="px-6 py-2.5 text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2 shadow-lg"
              >
                ← Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isStep2Valid}
                className={`px-8 py-2.5 font-medium rounded-lg transition-colors shadow-md hover:shadow-lg ${
                  isStep2Valid
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
};