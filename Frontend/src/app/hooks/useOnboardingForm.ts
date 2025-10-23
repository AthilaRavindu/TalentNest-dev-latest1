// hooks/useOnboardingForm.ts
import { useAppDispatch, useAppSelector } from "../store";
import { useCallback } from "react"; // Add this import
import {
  updatePersonalDetails,
  updateContactDetails,
  updateWorkDetails,
  updateAccessCredentials,
  updateBiometrics,
  nextStep,
  previousStep,
  setCurrentStep,
  markStepCompleted,
  submitOnboardingData,
  resetOnboarding,
  clearError,
  type PersonalDetailsData,
  type ContactDetailsData,
  type WorkDetailsData,
  type AccessCredentialsData,
  type BiometricsData,
} from "../store/slices/onboardingSlice";

export const useOnboardingForm = () => {
  const dispatch = useAppDispatch();
  const onboardingState = useAppSelector((state) => state.onboarding);

  // Memoize all action dispatchers to prevent unnecessary re-renders
  const updatePersonalDetailsMemoized = useCallback(
    (data: Partial<PersonalDetailsData>) => {
      dispatch(updatePersonalDetails(data));
    },
    [dispatch]
  );

  const updateContactDetailsMemoized = useCallback(
    (data: Partial<ContactDetailsData>) => {
      dispatch(updateContactDetails(data));
    },
    [dispatch]
  );

  const updateWorkDetailsMemoized = useCallback(
    (data: Partial<WorkDetailsData>) => {
      dispatch(updateWorkDetails(data));
    },
    [dispatch]
  );

  const updateAccessCredentialsMemoized = useCallback(
    (data: Partial<AccessCredentialsData>) => {
      dispatch(updateAccessCredentials(data));
    },
    [dispatch]
  );

  const updateBiometricsMemoized = useCallback(
    (data: Partial<BiometricsData>) => {
      dispatch(updateBiometrics(data));
    },
    [dispatch]
  );

  const goToNextStepMemoized = useCallback(() => {
    dispatch(nextStep());
  }, [dispatch]);

  const goToPreviousStepMemoized = useCallback(() => {
    dispatch(previousStep());
  }, [dispatch]);

  const goToStepMemoized = useCallback(
    (step: number) => {
      dispatch(setCurrentStep(step));
    },
    [dispatch]
  );

  const markStepCompletedMemoized = useCallback(
    (step: number) => {
      dispatch(markStepCompleted(step));
    },
    [dispatch]
  );

  const submitFormMemoized = useCallback(() => {
    dispatch(submitOnboardingData());
  }, [dispatch]);

  const resetFormMemoized = useCallback(() => {
    dispatch(resetOnboarding());
  }, [dispatch]);

  const clearErrorMemoized = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Data
    personalDetails: onboardingState.data.personalDetails,
    contactDetails: onboardingState.data.contactDetails,
    workDetails: onboardingState.data.workDetails,
    accessCredentials: onboardingState.data.accessCredentials,
    biometrics: onboardingState.data.biometrics,

    // State
    currentStep: onboardingState.currentStep,
    completedSteps: onboardingState.completedSteps,
    isLoading: onboardingState.isLoading,
    error: onboardingState.error,
    isSubmitted: onboardingState.isSubmitted,
    currentUserId: onboardingState.currentUserId,

    // Memoized Actions
    updatePersonalDetails: updatePersonalDetailsMemoized,
    updateContactDetails: updateContactDetailsMemoized,
    updateWorkDetails: updateWorkDetailsMemoized,
    updateAccessCredentials: updateAccessCredentialsMemoized,
    updateBiometrics: updateBiometricsMemoized,

    // Navigation
    goToNextStep: goToNextStepMemoized,
    goToPreviousStep: goToPreviousStepMemoized,
    goToStep: goToStepMemoized,
    markStepCompleted: markStepCompletedMemoized,

    // Form Management
    submitForm: submitFormMemoized,
    resetForm: resetFormMemoized,
    clearError: clearErrorMemoized,

    // Complete data object for final submission
    getAllData: () => onboardingState.data,
  };
};
