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
import { Checkbox } from "@/app/components/ui/checkbox";

export interface AccessCredentialsData {
  username: string;
  password: string;
  confirmPassword: string;
  systemAccess: string[];
  agreesToTerms: boolean;
}

interface AccessCredentialsFormProps {
  onNext: (data: AccessCredentialsData) => void;
  onPrevious: () => void;
  defaultValues?: Partial<AccessCredentialsData>;
}

const systemAccessOptions = [
  { id: "email", label: "Email System" },
  { id: "crm", label: "CRM System" },
  { id: "hr", label: "HR Portal" },
  { id: "project", label: "Project Management" },
];

export const AccessCredentialsForm: React.FC<AccessCredentialsFormProps> = ({
  onNext,
  onPrevious,
  defaultValues,
}) => {
  const form = useForm<AccessCredentialsData>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      systemAccess: [],
      agreesToTerms: false,
      ...defaultValues,
    },
  });

  const onSubmit = (data: AccessCredentialsData) => {
    onNext(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Credentials</CardTitle>
        <CardDescription>
          Set up your system access and security credentials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === form.getValues("password") ||
                    "Passwords do not match",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="systemAccess"
              rules={{ required: "Please select at least one system" }}
              render={() => (
                <FormItem>
                  <FormLabel>System Access</FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    {systemAccessOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="systemAccess"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          option.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreesToTerms"
              rules={{ required: "You must agree to the terms" }}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
