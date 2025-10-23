import React, { useState } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

// Step interface
interface Step {
  id: string;
  title: string;
  description?: string;
}

// Stepper Props
interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Custom Stepper Component with enhanced colors
const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  className = '', 
  orientation = 'horizontal' 
}) => {
  return (
    <div
      className={`flex w-full ${
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col'
      } ${className}`}
    >
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isPending = stepNumber > currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center ${
                orientation === 'horizontal' ? 'flex-col text-center' : 'flex-row text-left'
              }`}
            >
              {/* Step Circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ${
                  isCompleted 
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg' 
                    : isActive 
                    ? 'border-emerald-500 bg-white text-emerald-600 shadow-md ring-4 ring-emerald-100' 
                    : 'border-gray-300 bg-gray-100 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Step Content */}
              <div
                className={`transition-colors duration-200 ${
                  orientation === 'horizontal' ? 'mt-3 px-2' : 'ml-4'
                }`}
              >
                <div
                  className={`text-sm font-medium transition-colors ${
                    isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    className={`text-xs mt-1 transition-colors ${
                      isCompleted || isActive ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`transition-all duration-300 ${
                  orientation === 'horizontal'
                    ? 'mx-4 h-0.5 flex-1'
                    : 'my-4 ml-5 h-8 w-0.5'
                } ${
                  stepNumber < currentStep 
                    ? 'bg-emerald-500' 
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Enhanced Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700"
  };
  
  const sizeClasses = {
    default: "h-10 px-6 py-2",
    sm: "h-9 rounded-md px-4",
    lg: "h-11 rounded-md px-8"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Components
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <p className={`text-sm text-gray-600 ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Form Component for demonstration
const ContactForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = () => {
    if (isValid) {
      onNext();
    }
  };

  const isValid = formData.firstName && formData.lastName && formData.email && formData.phone;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
        <CardDescription>Please provide your personal information and contact details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="min-w-[120px]"
            >
              Next Step
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample form for other steps
const GenericForm: React.FC<{ 
  title: string; 
  description: string; 
  onNext?: () => void; 
  onPrevious?: () => void;
  isLast?: boolean;
}> = ({ title, description, onNext, onPrevious, isLast = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center py-8 text-gray-500">
            Form fields for {title.toLowerCase()} would go here
          </div>
          
          <div className="flex justify-between pt-4">
            {onPrevious && (
              <Button variant="outline" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            <div className="flex-1" />
            {onNext && (
              <Button onClick={onNext} className="min-w-[120px]">
                {isLast ? 'Complete' : 'Next Step'}
                {!isLast && <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component
const EmployeeOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const employeeOnboardingSteps: Step[] = [
    {
      id: 'contact-details',
      title: 'Contact Details',
      description: 'Personal information and contact details'
    },
    {
      id: 'work-details',
      title: 'Work Details',
      description: 'Job role, department, and work preferences'
    },
    {
      id: 'access-credentials',
      title: 'Access Credentials',
      description: 'System access and security credentials'
    },
    {
      id: 'biometric-enrollment',
      title: 'Biometric Enrollment',
      description: 'Fingerprint and photo capture'
    },
    {
      id: 'ats-review',
      title: 'ATS & Review',
      description: 'Final review and approval'
    }
  ];

  const simpleSteps: Step[] = [
    { id: 'step-1', title: 'Getting Started' },
    { id: 'step-2', title: 'Configuration' },
    { id: 'step-3', title: 'Testing' },
    { id: 'step-4', title: 'Deployment' }
  ];

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNext = () => {
    if (currentStep < employeeOnboardingSteps.length) {
      setCurrentStep(currentStep + 1);
      showToastMessage(`Moved to step ${currentStep + 1}`);
    } else {
      showToastMessage('Onboarding Complete!');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      showToastMessage(`Moved to step ${currentStep - 1}`);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <ContactForm onNext={handleNext} />;
      case 2:
        return (
          <GenericForm
            title="Work Details"
            description="Job role, department, and work preferences"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <GenericForm
            title="Access Credentials"
            description="System access and security credentials"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <GenericForm
            title="Biometric Enrollment"
            description="Fingerprint and photo capture"
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <GenericForm
            title="ATS & Review"
            description="Final review and approval"
            onPrevious={handlePrevious}
            isLast={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
            <div className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white shadow-lg">
              {toastMessage}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Employee Onboarding</h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete your onboarding process step by step
          </p>
        </div>

        {/* Main Stepper */}
        <Card>
          <CardContent className="pt-6">
            <Stepper
              steps={employeeOnboardingSteps}
              currentStep={currentStep}
              orientation="horizontal"
            />
          </CardContent>
        </Card>

        {/* Current Step Form */}
        {renderCurrentStep()}

        {/* Demo Section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Simple Stepper Demo</h2>
            <p className="text-gray-600">Basic stepper without forms</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vertical Stepper</CardTitle>
                <CardDescription>Compact vertical layout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Stepper
                  steps={simpleSteps}
                  currentStep={2}
                  orientation="vertical"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>What makes this stepper special</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Form validation prevents invalid progression</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Green connecting lines for completed steps</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Enhanced color scheme matching your design</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Horizontal and vertical orientations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Responsive and accessible design</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Helper */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-emerald-900">Step {currentStep} of {employeeOnboardingSteps.length}</h3>
                <p className="text-sm text-emerald-700">
                  Current: {employeeOnboardingSteps[currentStep - 1]?.title}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={currentStep === employeeOnboardingSteps.length}
                >
                  {currentStep === employeeOnboardingSteps.length ? 'Complete' : 'Next Step'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
export { Stepper, Button, Card, CardHeader, CardTitle, CardDescription, CardContent };
export type { Step };