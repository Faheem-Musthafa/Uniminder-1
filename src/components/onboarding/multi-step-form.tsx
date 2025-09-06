"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getSupabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ✅ Validation schema
const formSchema = z.object({
  role: z.enum(["student", "alumni", "aspirant"]),
  name: z.string().min(2, "Name is required"),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  currentStatus: z.string().optional(),
  targetProgram: z.string().optional(),
});

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoaded } = useUser(); // ✅ Fixed: Actually use the hook
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "student", name: "" },
  });

  // ✅ Fixed: Add loading state check
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to continue</div>;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        ...values,
      });

      if (error) {
        console.error("❌ Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      } else {
        console.log("✅ Profile saved!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Fixed: Add form validation before step navigation
  const nextStep = async () => {
    const isValid = await form.trigger(getFieldsForStep(step));
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // ✅ Helper function to validate specific fields per step
  const getFieldsForStep = (currentStep: number): (keyof z.infer<typeof formSchema>)[] => {
    switch (currentStep) {
      case 1:
        return ["role"];
      case 2:
        return ["name"];
      case 3:
        const role = form.watch("role");
        if (role === "student") return ["university"];
        if (role === "alumni") return ["university", "graduationYear"];
        if (role === "aspirant") return ["currentStatus", "targetProgram"];
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-2xl shadow-lg bg-white">
      <Progress value={(step / 3) * 100} className="mb-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* STEP 1: Role Selection */}
          {step === 1 && (
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select your role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="aspirant">Aspirant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* STEP 2: Basic Info */}
          {step === 2 && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* STEP 3: Role-specific details */}
          {step === 3 && (
            <>
              {form.watch("role") === "student" && (
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University / College</FormLabel>
                      <FormControl>
                        <Input placeholder="Your university" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("role") === "alumni" && (
                <>
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduated From</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MIT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2022" {...field} />
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
                    name="currentStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Status</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="High school, working..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetProgram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Program</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MBA, B.Tech CS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
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
            {step < 3 ? (
              <Button type="button" onClick={nextStep} disabled={isSubmitting}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
