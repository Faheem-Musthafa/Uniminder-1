"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, label: "Role", icon: "🎯" },
  { id: 2, label: "Details", icon: "📝" },
  { id: 3, label: "Finish", icon: "🎉" },
];

// Enhanced validation schema matching API route
const formSchema = z.object({
  role: z.enum(["student", "alumni", "aspirant"]),
  fullName: z.string().min(2, "Full name is required"),
  location: z.string().optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  passingYear: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  entranceExam: z.string().optional(),
  targetCollege: z.string().optional(),
  linkedin: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
});

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const totalSteps = steps.length;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "student",
      fullName: "",
      location: "",
      college: "",
      branch: "",
      passingYear: "",
      company: "",
      designation: "",
      entranceExam: "",
      targetCollege: "",
      linkedin: "",
      skills: "",
      bio: "",
    },
  });

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile");
      }

      console.log("✅ Profile saved successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Onboarding error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enhanced form validation before step navigation
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
      setSubmitError(""); // Clear any previous errors
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setSubmitError(""); // Clear errors when going back
  };

  // Helper function to validate specific fields per step
  const getFieldsForStep = (
    currentStep: number
  ): (keyof z.infer<typeof formSchema>)[] => {
    switch (currentStep) {
      case 1:
        return ["role", "fullName"];
      case 2:
        const role = form.watch("role");
        if (role === "student") return ["college", "passingYear"];
        if (role === "alumni") return ["college", "passingYear", "company"];
        if (role === "aspirant") return ["entranceExam"];
        return [];
      case 3:
        return []; // Optional fields
      default:
        return [];
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Welcome to UniMinder!
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Let&apos;s set up your profile to get started
        </p>

        {/* Visual Stepper */}
        <div className="flex items-center justify-center mt-6 relative">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-all duration-300",
                    step >= s.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                      : step === s.id - 1
                      ? "bg-blue-100 text-blue-600 border-blue-300"
                      : "bg-white text-gray-400 border-gray-300"
                  )}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{s.icon}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium transition-colors duration-300",
                    step >= s.id ? "text-blue-600" : "text-gray-400"
                  )}
                >
                  {s.label}
                </span>
              </div>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-4 transition-all duration-300",
                    step > s.id ? "bg-blue-600" : "bg-gray-300"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Progress value={(step / totalSteps) * 100} className="mt-6" />
        <p className="text-xs text-gray-500 mt-2">
          Step {step} of {totalSteps}
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* STEP 1: Role Selection & Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What describes you best?</FormLabel>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          {
                            value: "student",
                            icon: "🎓",
                            label: "Student",
                            desc: "Currently studying",
                          },
                          {
                            value: "alumni",
                            icon: "💼",
                            label: "Alumni",
                            desc: "Graduated & working",
                          },
                          {
                            value: "aspirant",
                            icon: "🎯",
                            label: "Aspirant",
                            desc: "Planning to study",
                          },
                        ].map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={
                              field.value === option.value
                                ? "default"
                                : "outline"
                            }
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex flex-col h-auto p-4 text-left transition-all duration-200",
                              field.value === option.value &&
                                "ring-2 ring-blue-200"
                            )}
                          >
                            <span className="font-semibold flex items-center gap-2">
                              {option.icon} {option.label}
                            </span>
                            <span className="text-xs opacity-75">
                              {option.desc}
                            </span>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State/Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* STEP 2: Role-specific details */}
            {step === 2 && (
              <div className="space-y-4">
                {form.watch("role") === "student" && (
                  <>
                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University/College *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your university name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch/Major</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Computer Science"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Graduation Year *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {form.watch("role") === "alumni" && (
                  <>
                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alma Mater *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Where you graduated from"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passingYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2020" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Company *</FormLabel>
                          <FormControl>
                            <Input placeholder="Where you work" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Your position" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {form.watch("role") === "aspirant" && (
                  <>
                    <FormField
                      control={form.control}
                      name="entranceExam"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Entrance Exam *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., JEE, CAT, GMAT"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetCollege"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dream College/University</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Where you want to study"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            )}

            {/* STEP 3: Additional Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="font-semibold text-lg">Almost done!</h3>
                  <p className="text-sm text-gray-600">
                    Add some final details to complete your profile
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/yourname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills & Interests</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Programming, Design, Marketing"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Separate with commas
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Bio (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us a bit about yourself..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              {step < totalSteps && (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  Continue
                </Button>
              )}
              {step === totalSteps && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
