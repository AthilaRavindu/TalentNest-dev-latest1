import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Fingerprint, Camera } from "lucide-react";

export interface BiometricEnrollmentData {
  fingerprintCaptured: boolean;
  photoCaptured: boolean;
  consentGiven: boolean;
}

interface BiometricEnrollmentFormProps {
  onNext: (data: BiometricEnrollmentData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<BiometricEnrollmentData>;
}

export const BiometricEnrollmentForm: React.FC<
  BiometricEnrollmentFormProps
> = ({ onNext, onPrevious, defaultValues }) => {
  const form = useForm<BiometricEnrollmentData>({
    defaultValues: {
      fingerprintCaptured: false,
      photoCaptured: false,
      consentGiven: false,
      ...defaultValues,
    },
  });

  const onSubmit = (data: BiometricEnrollmentData) => {
    onNext(data);
  };

  const simulateFingerprint = () => {
    form.setValue("fingerprintCaptured", true);
  };

  const simulatePhoto = () => {
    form.setValue("photoCaptured", true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biometric Enrollment</CardTitle>
        <CardDescription>
          Complete your biometric enrollment for security access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="fingerprintCaptured"
                rules={{ required: "Fingerprint capture is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fingerprint Capture</FormLabel>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <Fingerprint className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Capture Fingerprint</p>
                          <p className="text-sm text-muted-foreground">
                            {field.value
                              ? "Fingerprint captured successfully"
                              : "Click to capture your fingerprint"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={field.value ? "secondary" : "default"}
                        onClick={simulateFingerprint}
                        disabled={field.value}
                      >
                        {field.value ? "Captured" : "Capture"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photoCaptured"
                rules={{ required: "Photo capture is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo Capture</FormLabel>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <Camera className="h-6 w-6" />
                        <div>
                          <p className="font-medium">Capture Photo</p>
                          <p className="text-sm text-muted-foreground">
                            {field.value
                              ? "Photo captured successfully"
                              : "Click to take your employee photo"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={field.value ? "secondary" : "default"}
                        onClick={simulatePhoto}
                        disabled={field.value}
                      >
                        {field.value ? "Captured" : "Capture"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentGiven"
                rules={{ required: "Consent is required to proceed" }}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to the collection and use of my biometric data
                        for security purposes
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onPrevious}>
                Previous
              </Button>
              <Button type="submit">Next Step</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
