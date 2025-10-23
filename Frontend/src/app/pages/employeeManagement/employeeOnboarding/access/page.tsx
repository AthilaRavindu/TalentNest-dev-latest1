"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Key, Send, Copy, Check } from "lucide-react"; // Removed Eye, EyeOff
import toast from "react-hot-toast";
import Breadcrumb from "@/app/components/Breadcrumb/page";
import Stepper from "@/app/components/stepper/page";
import Input from "@/app/components/Input/page";
import { useOnboardingForm } from "@/app/hooks/useOnboardingForm";

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

function PasswordInput({
  label,
  placeholder,
  helperText,
  value,
  onChange,
  error,
}: PasswordInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <input
          type="password" // Always password type - no visibility toggle
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            h-[52px] w-full rounded-xl border px-4 text-base shadow-sm 
            outline-none bg-white text-gray-900 transition-all
            ${
              error
                ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-teal-500"
            }
          `}
        />
      </div>

      {(helperText || error) && (
        <span className={`text-xs ${error ? "text-red-600" : "text-gray-500"}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}

export default function AccessCredentialsPage() {
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
    accessCredentials,
    contactDetails,
    personalDetails,
    workDetails,
    currentStep,
    updateAccessCredentials,
    goToNextStep,
    goToPreviousStep,
    error,
  } = useOnboardingForm();

  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [localErrors, setLocalErrors] = useState({
    username: "",
    confirmUsername: "",
    password: "",
  });

  // Fixed useEffect - only depend on contactDetails.workEmail
  useEffect(() => {
    if (
      contactDetails?.workEmail &&
      accessCredentials.username !== contactDetails.workEmail
    ) {
      updateAccessCredentials({
        username: contactDetails.workEmail,
        confirmUsername: contactDetails.workEmail,
      });
    }
  }, [contactDetails?.workEmail]);

  const generatePassword = (length: number = 12): string => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%^&*";

    let password = "";

    // Ensure at least one of each required character type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest
    const allChars = lowercase + uppercase + numbers + special;
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    updateAccessCredentials({
      password: newPassword,
      confirmPassword: newPassword,
      isOneTimePassword: true,
    });
    setLocalErrors((prev) => ({ ...prev, password: "" }));
    toast.success("One-time password generated successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendCredentials = async () => {
    if (!validateForm()) {
      return;
    }

    const employeeName =
      personalDetails?.firstName && personalDetails?.lastName
        ? `${personalDetails.firstName} ${personalDetails.lastName}`
        : "Employee";

    // Check if NIC is available from personal details
    if (!personalDetails?.NIC) {
      toast.error(
        "NIC is required. Please complete the Personal Details step first."
      );
      return;
    }

    setIsSending(true);

    try {
      const loadingToast = toast.loading(
        "Sending credentials preview email..."
      );

      const res = await fetch(
        "http://localhost:5000/api/otp/send-credentials",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: accessCredentials.username,
            password: accessCredentials.password,
            employeeName: employeeName,
            NIC: personalDetails.NIC,
            userId: workDetails.userId,
          }),
        }
      );

      const data = await res.json();
      toast.dismiss(loadingToast);

      console.log("Backend response:", data);

      if (!res.ok) {
        const errorMessage =
          data.message || data.error || `Failed to send preview: ${res.status}`;
        toast.error(errorMessage);
        return;
      }

      if (data.emailSent || data.success) {
        toast.success("✅ Credentials preview email sent successfully!");
        updateAccessCredentials({ passwordSent: true });
      } else {
        const failureReason = data.reason || "Email service unavailable";
        toast.error(`Email sending failed: ${failureReason}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error(
        "Error connecting to server. Please check if backend is running."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    updateAccessCredentials({ [field]: value });

    // Clear error for this field
    if (localErrors[field as keyof typeof localErrors]) {
      setLocalErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      username: "",
      confirmUsername: "",
      password: "",
    };

    let isValid = true;

    if (!accessCredentials.username?.trim()) {
      newErrors.username = "Username (work email) is required";
      isValid = false;
    }

    if (!accessCredentials.confirmUsername?.trim()) {
      newErrors.confirmUsername = "Please confirm your username";
      isValid = false;
    } else if (
      accessCredentials.username !== accessCredentials.confirmUsername
    ) {
      newErrors.confirmUsername = "Usernames do not match";
      isValid = false;
    }

    if (!accessCredentials.password) {
      newErrors.password = "One-time password is required";
      isValid = false;
    } else if (accessCredentials.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(accessCredentials.password)
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and a number";
      isValid = false;
    }

    setLocalErrors(newErrors);

    if (!isValid) {
      toast.error("Please fix the validation errors before proceeding");
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    toast.success("Access credentials configured successfully!");
    goToNextStep();
    router.push("/pages/employeeManagement/employeeOnboarding/biometry");
  };

  const handlePrevious = () => {
    goToPreviousStep();
    router.push("/pages/employeeManagement/employeeOnboarding/work-details");
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(
    accessCredentials?.password || ""
  );
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-emerald-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="pl-16 py-10 max-w-6xl mx-auto flex flex-col gap-2">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-gray-900">Access Credentials</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl mt-6">
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            🔒 Confidential One-Time Password Workflow:
          </h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Admin generates a one-time password (password is hidden for security)</li>
            <li>Credentials are securely emailed to employee</li>
            <li>Only the employee can see the actual password</li>
            <li>Admin cannot view the generated password for security reasons</li>
            <li>Employee uses one-time password for first login</li>
            <li>System forces password change after first login</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Work Email (Username)*"
            type="text"
            value={accessCredentials?.username || ""}
            onChange={() => {}}
            helperText="Employee's work email - will be used as username"
            error={localErrors.username}
            readOnly
          />

          <Input
            label="Confirm Work Email*"
            type="text"
            placeholder="Confirm work email"
            helperText="Must match work email exactly"
            value={accessCredentials.confirmUsername || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("confirmUsername", e.target.value)
            }
            error={localErrors.confirmUsername}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <PasswordInput
                label="One-Time Password*"
                placeholder="Click generate to create secure password"
                helperText="Password is hidden for security - will be sent directly to employee"
                value={accessCredentials?.password || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("password", e.target.value)
                }
                error={localErrors.password}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded hover:bg-teal-700 transition-colors"
                title="Generate secure one-time password"
              >
                <Key className="w-5 h-5" />
              </button>
            </div>

            {accessCredentials?.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
                        index < passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs ${
                    passwordStrength >= 4
                      ? "text-emerald-600"
                      : passwordStrength >= 2
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Password strength:{" "}
                  {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          {/* Empty column to maintain grid layout */}
          <div></div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSendCredentials}
            disabled={isSending || !accessCredentials?.password}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white 
                      bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm
                      disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send One-Time Password to Employee"}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            This will securely email the credentials to{" "}
            <strong>{accessCredentials?.username || "the employee"}</strong>
            <br />
            <span className="text-teal-600">🔒 Password is hidden for security reasons</span>
          </p>
        </div>
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
          className="flex items-center justify-center h-8 gap-2 px-8 py-4 text-lg font-semibold text-white transition-colors bg-teal-500 rounded-full shadow-sm w-25 hover:bg-teal-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}