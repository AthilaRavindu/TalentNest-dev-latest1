// store/slices/onboardingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define the completed steps type explicitly
export type CompletedSteps = number[];

export interface OnboardingData {
  // Personal Details (Step 1)
  personalDetails: {
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    maritalStatus: "single" | "married" | "divorced" | "widowed";
    nationality: string;
    passportNumber: string;
    bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    religion: string;
    NIC: string;
  };

  // Contact Details (Step 2)
  contactDetails: {
    workEmail: string;
    personalPhoneNumber: string;
    whatsappPhoneNumber: string;
    currentAddress: {
      addressLine: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    permanentAddress: {
      addressLine: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    socialMediaLinks: {
      linkedinProfile: string;
      facebookProfile: string;
    };
    emergencyContact: {
      name: string;
      phoneNumber: string;
      relationship: string;
    };
  };

  // Work Details (Step 3) - UPDATED with salaryCurrency
  workDetails: {
    userId: string;
    employeeType: string;
    department: string;
    position: string;
    workLocation: string;
    hireDate: string;
    terminationDate?: string;
    managerId?: string;
    employmentType: "full-time" | "part-time" | "intern" | "contract";
    employmentStatus: "active" | "inactive" | "terminated";
    workingHours: string;
    basicSalary: number;
    salaryCurrency: string; // ADD THIS LINE
  };

  // Access Credentials (Step 4) - UPDATED with all needed fields
  accessCredentials: {
    username: string;
    password: string;
    confirmUsername: string;
    confirmPassword: string;
    isOneTimePassword: boolean;
    passwordSent: boolean;
  };

  // Biometric Data (Step 5)
  biometrics: {
    fingerprint?: string;
    faceId?: string;
  };
}

// Export individual section types
export type PersonalDetailsData = OnboardingData["personalDetails"];
export type ContactDetailsData = OnboardingData["contactDetails"];
export type WorkDetailsData = OnboardingData["workDetails"];
export type AccessCredentialsData = OnboardingData["accessCredentials"];
export type BiometricsData = OnboardingData["biometrics"];

export interface OnboardingState {
  data: OnboardingData;
  currentStep: number;
  completedSteps: CompletedSteps;
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
  currentUserId: string | null;
}

const initialState: OnboardingState = {
  data: {
    personalDetails: {
      firstName: "",
      lastName: "",
      fullName: "",
      dateOfBirth: "",
      gender: "male",
      maritalStatus: "single",
      nationality: "",
      passportNumber: "",
      bloodGroup: "O+",
      religion: "",
      NIC: "",
    },
    contactDetails: {
      workEmail: "",
      personalPhoneNumber: "",
      whatsappPhoneNumber: "",
      currentAddress: {
        addressLine: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      permanentAddress: {
        addressLine: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      socialMediaLinks: {
        linkedinProfile: "",
        facebookProfile: "",
      },
      emergencyContact: {
        name: "",
        phoneNumber: "",
        relationship: "",
      },
    },
    workDetails: {
      userId: "",
      employeeType: "",
      department: "",
      position: "",
      workLocation: "",
      hireDate: "",
      terminationDate: "",
      managerId: "",
      employmentType: "full-time",
      employmentStatus: "active",
      workingHours: "",
      basicSalary: 0,
      salaryCurrency: "USD", // ADD DEFAULT CURRENCY
    },
    // UPDATED: Initialize all access credentials fields
    accessCredentials: {
      username: "",
      password: "",
      confirmUsername: "",
      confirmPassword: "",
      isOneTimePassword: true,
      passwordSent: false,
    },
    biometrics: {
      fingerprint: "",
      faceId: "",
    },
  },
  currentStep: 1,
  completedSteps: [],
  isLoading: false,
  error: null,
  isSubmitted: false,
  currentUserId: null,
};

// Async thunk for submitting complete onboarding data
export const submitOnboardingData = createAsyncThunk(
  "onboarding/submitData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { onboarding: OnboardingState };
      const { data } = state.onboarding;

      // Map frontend data to backend expected format
      const completeUserData = {
        // Basic Information (Required)
        firstName: data.personalDetails.firstName,
        lastName: data.personalDetails.lastName,
        fullName: data.personalDetails.fullName,
        userId: data.workDetails.userId, // Employee ID from work details
        username: data.accessCredentials.username,
        NIC: data.personalDetails.NIC,
        password: data.accessCredentials.password, // Will be hashed on backend

        // Contact Information (Required)
        workEmail:
          data.contactDetails.workEmail || data.accessCredentials.username,
        personalPhoneNumber: data.contactDetails.personalPhoneNumber || "",
        whatsappPhoneNumber: data.contactDetails.whatsappPhoneNumber || "",

        // Personal Details
        dateOfBirth: data.personalDetails.dateOfBirth
          ? new Date(data.personalDetails.dateOfBirth).toISOString()
          : null,
        gender: data.personalDetails.gender,
        maritalStatus: data.personalDetails.maritalStatus,
        nationality: data.personalDetails.nationality,
        passportNumber: data.personalDetails.passportNumber || "",
        bloodGroup: data.personalDetails.bloodGroup,
        religion: data.personalDetails.religion,

        // Address Information
        currentAddress: {
          addressLine: data.contactDetails.currentAddress.addressLine || "",
          country: data.contactDetails.currentAddress.country || "",
          city: data.contactDetails.currentAddress.city || "",
          province: data.contactDetails.currentAddress.province || "",
          postalCode: data.contactDetails.currentAddress.postalCode || "",
        },
        permanentAddress: {
          addressLine: data.contactDetails.permanentAddress.addressLine || "",
          city: data.contactDetails.permanentAddress.city || "",
          province: data.contactDetails.permanentAddress.province || "",
          postalCode: data.contactDetails.permanentAddress.postalCode || "",
          country: data.contactDetails.permanentAddress.country || "",
        },

        // Social Media
        socialMediaLinks: {
          linkedinProfile:
            data.contactDetails.socialMediaLinks.linkedinProfile || "",
          facebookProfile:
            data.contactDetails.socialMediaLinks.facebookProfile || "",
        },

        // Emergency Contact
        emergencyContact: {
          name: data.contactDetails.emergencyContact.name || "",
          phoneNumber: data.contactDetails.emergencyContact.phoneNumber || "",
          relationship: data.contactDetails.emergencyContact.relationship || "",
        },

        // Employment Information
        department: data.workDetails.department,
        position: data.workDetails.position,
        managerId: data.workDetails.managerId || null,
        workLocation: data.workDetails.workLocation,
        employmentType: data.workDetails.employmentType,
        employmentStatus: data.workDetails.employmentStatus || "active",
        hireDate: data.workDetails.hireDate
          ? new Date(data.workDetails.hireDate).toISOString()
          : null,
        terminationDate: data.workDetails.terminationDate
          ? new Date(data.workDetails.terminationDate).toISOString()
          : null,
        workingHours: data.workDetails.workingHours,
        basicSalary: Number(data.workDetails.basicSalary) || 0,
        salaryCurrency: data.workDetails.salaryCurrency || "USD", // ADD THIS LINE

        // Biometric Data
        biometrics: {
          fingerprint: data.biometrics.fingerprint || "",
          faceId: data.biometrics.faceId || "",
        },

        // Password management flags
        forcePasswordChange: true, // Always force password change for new users
        isOneTimePassword: data.accessCredentials.isOneTimePassword,
      };

      // Log the data being sent for debugging
      console.log("Submitting user data:", completeUserData);

      // Validate required fields before sending
      const requiredFields = [
        "firstName",
        "lastName",
        "fullName",
        "userId",
        "username",
        "NIC",
        "password",
        "workEmail",
      ];

      const missingFields = requiredFields.filter(
        (field) => !completeUserData[field as keyof typeof completeUserData]
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeUserData),
      });

      if (!response.ok) {
        // Try to get detailed error message from backend
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error("Backend error response:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Could not parse error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);
      return result;
    } catch (error) {
      console.error("Submission error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    // Personal Details Actions
    updatePersonalDetails: (
      state,
      action: PayloadAction<Partial<PersonalDetailsData>>
    ) => {
      state.data.personalDetails = {
        ...state.data.personalDetails,
        ...action.payload,
      };
    },

    // Contact Details Actions
    updateContactDetails: (
      state,
      action: PayloadAction<Partial<ContactDetailsData>>
    ) => {
      state.data.contactDetails = {
        ...state.data.contactDetails,
        ...action.payload,
      };
    },

    // Work Details Actions
    updateWorkDetails: (
      state,
      action: PayloadAction<Partial<WorkDetailsData>>
    ) => {
      state.data.workDetails = { ...state.data.workDetails, ...action.payload };
    },

    // Access Credentials Actions
    updateAccessCredentials: (
      state,
      action: PayloadAction<Partial<AccessCredentialsData>>
    ) => {
      state.data.accessCredentials = {
        ...state.data.accessCredentials,
        ...action.payload,
      };
    },

    // Biometrics Actions
    updateBiometrics: (
      state,
      action: PayloadAction<Partial<BiometricsData>>
    ) => {
      state.data.biometrics = { ...state.data.biometrics, ...action.payload };
    },

    // Navigation Actions
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      if (state.currentStep < 6) {
        // Updated to 6 steps total
        state.currentStep += 1;
      }
    },

    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        // Remove the current step from completed steps when going back
        state.completedSteps = state.completedSteps.filter(
          (step) => step !== state.currentStep
        );
      }
    },

    // New action to mark a step as completed without changing current step
    markStepCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },

    // User ID Actions
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },

    // Reset Actions
    resetOnboarding: (state) => {
      state.data = initialState.data;
      state.currentStep = 1;
      state.completedSteps = [];
      state.error = null;
      state.isSubmitted = false;
      state.currentUserId = null;
    },

    // Error Actions
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOnboardingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOnboardingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSubmitted = true;
        state.currentUserId = action.payload.user?._id || null;
        state.error = null;
        // Mark all steps as completed when submission is successful
        state.completedSteps = [1, 2, 3, 4, 5, 6];
      })
      .addCase(submitOnboardingData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updatePersonalDetails,
  updateContactDetails,
  updateWorkDetails,
  updateAccessCredentials,
  updateBiometrics,
  setCurrentStep,
  nextStep,
  previousStep,
  markStepCompleted,
  setCurrentUserId,
  resetOnboarding,
  clearError,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;