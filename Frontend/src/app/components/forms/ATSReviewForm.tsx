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
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Badge } from "@/app/components/ui/badge";
import { CheckCircle } from "lucide-react";

export interface ATSReviewData {
  reviewNotes: string;
  finalApproval: boolean;
  documentsVerified: boolean;
}

interface ATSReviewFormProps {
  onComplete: (data: ATSReviewData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<ATSReviewData>;
}

export const ATSReviewForm: React.FC<ATSReviewFormProps> = ({
  onComplete,
  onPrevious,
  defaultValues,
}) => {
  const form = useForm<ATSReviewData>({
    defaultValues: {
      reviewNotes: "",
      finalApproval: false,
      documentsVerified: false,
      ...defaultValues,
    },
  });

  const onSubmit = (data: ATSReviewData) => {
    onComplete(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS & Final Review</CardTitle>
        <CardDescription>
          Review all information and complete the onboarding process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Review Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Onboarding Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-stepper-completed" />
                <span className="text-sm">Contact Details</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-stepper-completed" />
                <span className="text-sm">Work Details</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-stepper-completed" />
                <span className="text-sm">Access Credentials</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-stepper-completed" />
                <span className="text-sm">Biometric Enrollment</span>
                <Badge variant="secondary">Complete</Badge>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reviewNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or comments..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentsVerified"
                rules={{ required: "Document verification is required" }}
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
                        I confirm that all documents have been verified and are
                        accurate
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalApproval"
                rules={{
                  required: "Final approval is required to complete onboarding",
                }}
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
                        I approve the completion of this employee onboarding
                        process
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onPrevious}>
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="bg-stepper-completed text-stepper-completed-foreground"
                >
                  Complete Onboarding
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
