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
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export interface WorkDetailsData {
  jobTitle: string;
  department: string;
  startDate: string;
  employeeId: string;
  workLocation: string;
}

interface WorkDetailsFormProps {
  onNext: (data: WorkDetailsData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<WorkDetailsData>;
}

export const WorkDetailsForm: React.FC<WorkDetailsFormProps> = ({
  onNext,
  onPrevious,
  defaultValues,
}) => {
  const form = useForm<WorkDetailsData>({
    defaultValues: {
      jobTitle: "",
      department: "",
      startDate: "",
      employeeId: "",
      workLocation: "",
      ...defaultValues,
    },
  });

  const onSubmit = (data: WorkDetailsData) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Details</CardTitle>
        <CardDescription>
          Please provide your job role, department, and work preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Job Title */}
            <FormField
              control={form.control}
              name="jobTitle"
              rules={{ required: "Job title is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department Dropdown */}
            <FormField
              control={form.control}
              name="department"
              rules={{ required: "Department is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border rounded-md flex justify-between">
                        <SelectValue placeholder="Select your department" />
                        {/* Animated Icon */}
                        <motion.div
                          animate={{ rotate: field.value ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </motion.div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border rounded-md">
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date & Employee ID */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeId"
                rules={{ required: "Employee ID is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Work Location Dropdown */}
            <FormField
              control={form.control}
              name="workLocation"
              rules={{ required: "Work location is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border rounded-md flex justify-between">
                        <SelectValue placeholder="Select work location" />
                        {/* Animated Icon */}
                        <motion.div
                          animate={{ rotate: field.value ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </motion.div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border rounded-md">
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Navigation Buttons */}
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
