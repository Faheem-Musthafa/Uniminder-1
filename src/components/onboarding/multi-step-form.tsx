"use client";

import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, label: "Account", icon: "👤" },
  { id: 2, label: "Education/Work", icon: "🎓" },
  { id: 3, label: "Interests", icon: "⭐" },
  { id: 4, label: "Goals", icon: "🎯" },
  { id: 5, label: "Socials", icon: "🔗" },
];

// Predefined data for dropdowns
const DEGREE_TYPES = [
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree (PhD)",
  "Associate Degree",
  "Professional Degree",
  "Diploma/Certificate",
  "High School",
  "Other",
];

const MAJORS_BRANCHES = [
  // Engineering
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biomedical Engineering",
  "Industrial Engineering",

  // Business & Management
  "Business Administration (MBA/BBA)",
  "Finance",
  "Marketing",
  "Human Resources",
  "Operations Management",
  "International Business",

  // Sciences
  "Computer Science",
  "Data Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Biotechnology",
  "Environmental Science",

  // Liberal Arts & Others
  "Economics",
  "Psychology",
  "Sociology",
  "Political Science",
  "Literature",
  "History",
  "Philosophy",
  "Design",
  "Arts",
  "Media & Communication",
  "Law",
  "Medicine",
  "Nursing",
  "Education",
  "Other",
];

const ENTRANCE_EXAMS = [
  // Indian Engineering
  "JEE Main",
  "JEE Advanced",
  "BITSAT",
  "VITEEE",
  "SRMJEEE",
  "MET",

  // Indian Management
  "CAT",
  "XAT",
  "SNAP",
  "NMAT",
  "MAT",
  "CMAT",

  // Indian Medical
  "NEET UG",
  "NEET PG",
  "AIIMS",

  // International
  "SAT",
  "ACT",
  "GRE",
  "GMAT",
  "TOEFL",
  "IELTS",

  // Other Government Exams
  "UPSC",
  "SSC",
  "Bank PO",
  "GATE",
  "NET/JRF",

  "Other",
];

const POPULAR_COMPANIES = [
  // Tech Giants
  "Google",
  "Microsoft",
  "Apple",
  "Amazon",
  "Meta (Facebook)",
  "Netflix",
  "Tesla",
  "Uber",
  "Airbnb",
  "Spotify",

  // Indian IT
  "Tata Consultancy Services (TCS)",
  "Infosys",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Capgemini",
  "Accenture",
  "IBM",
  "Cognizant",
  "Mindtree",

  // Consulting & Finance
  "McKinsey & Company",
  "Boston Consulting Group",
  "Deloitte",
  "PwC",
  "EY",
  "KPMG",
  "Goldman Sachs",
  "Morgan Stanley",
  "JP Morgan",
  "Citibank",

  // Startups & Unicorns
  "Flipkart",
  "Paytm",
  "Zomato",
  "Swiggy",
  "Ola",
  "PhonePe",
  "Razorpay",
  "CRED",
  "Dream11",
  "Unacademy",

  // Traditional Industries
  "Reliance Industries",
  "Tata Group",
  "Aditya Birla Group",
  "L&T",
  "Mahindra Group",
  "ITC",
  "HDFC Bank",
  "ICICI Bank",

  "Other",
];

const JOB_DESIGNATIONS = [
  // Software Development
  "Software Engineer",
  "Senior Software Engineer",
  "Lead Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Technical Architect",

  // Data & Analytics
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "Business Analyst",
  "Product Analyst",

  // Product & Design
  "Product Manager",
  "Senior Product Manager",
  "Product Owner",
  "UX Designer",
  "UI Designer",
  "Product Designer",

  // Management & Leadership
  "Team Lead",
  "Engineering Manager",
  "Project Manager",
  "Director",
  "Vice President",
  "CTO",
  "CEO",

  // Consulting & Finance
  "Consultant",
  "Senior Consultant",
  "Manager",
  "Associate",
  "Financial Analyst",
  "Investment Banker",
  "Risk Analyst",

  // Marketing & Sales
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Sales Executive",
  "Business Development Manager",
  "Growth Manager",

  // Other
  "Research Scientist",
  "Quality Assurance Engineer",
  "Technical Writer",
  "Customer Success Manager",
  "Operations Manager",
  "HR Manager",

  "Other",
];

const GRADUATION_YEARS = Array.from({ length: 30 }, (_, i) =>
  (new Date().getFullYear() + 5 - i).toString()
);

const INTEREST_SUGGESTIONS = [
  "AI/ML",
  "Web Development",
  "Mobile Apps",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science",
  "Open Source",
  "Entrepreneurship",
  "Competitive Programming",
  "Design/UI",
  "Finance",
  "Consulting",
  "Marketing",
  "Product Management",
];

const LOOKING_FOR_SUGGESTIONS = [
  "Mentorship",
  "Study Group",
  "Internship",
  "Full-time Role",
  "Project Collaborators",
  "Exam Prep Buddy",
  "Mock Interviews",
  "Resume Review",
];

// Enhanced validation schema matching API route
const formSchema = z.object({
  role: z.enum(["student", "alumni", "aspirant"]),
  fullName: z.string().min(2, "Full name is required"),
  location: z.string().optional(),
  college: z.string().optional(),
  degree: z.string().optional(),
  branch: z.string().optional(),
  passingYear: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  entranceExam: z.string().optional(),
  targetCollege: z.string().optional(),
  linkedin: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
  yearsOfExperience: z
    .preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().int().min(0).max(60))
    .optional(),
  interests: z.array(z.string()).optional(),
  lookingFor: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const totalSteps = steps.length;

  const typedResolver = zodResolver(formSchema) as unknown as Resolver<FormValues>;
  const form = useForm<FormValues>({
    resolver: typedResolver,
    defaultValues: {
      role: "student",
      fullName: "",
      location: "",
      college: "",
      degree: "",
      branch: "",
      passingYear: "",
      company: "",
      designation: "",
      entranceExam: "",
      targetCollege: "",
      linkedin: "",
      skills: "",
      bio: "",
      yearsOfExperience: undefined,
      interests: [],
      lookingFor: [],
    } as FormValues,
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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...values,
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
      };

      console.log("🚀 Submitting onboarding data:", payload);

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("📬 API Response:", { status: response.status, result });

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
        if (role === "student")
          return ["college", "degree", "branch", "passingYear"];
        if (role === "alumni")
          return [
            "college",
            "degree",
            "branch",
            "passingYear",
            "company",
            "designation",
          ];
        if (role === "aspirant") return ["entranceExam"];
        return [];
      case 3:
        return [];
      case 4:
        return [];
      case 5:
        return []; // Optional fields
      default:
        return [];
    }
  };

  return (
  <Card className="w-full max-w-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-xl rounded-2xl bg-white/80 dark:bg-gray-950/70 backdrop-blur">
      <CardHeader className="text-center pb-4">
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
                    "w-10 h-10 rounded-full flex items-center justify-center border font-semibold transition-all duration-300 shadow-sm",
                    step >= s.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-110"
                      : step === s.id - 1
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : "bg-white text-gray-400 border-gray-200 dark:bg-gray-900 dark:border-gray-800"
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
                    "w-16 h-0.5 mx-4 transition-all duration-300 rounded-full",
                    step > s.id ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
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
            {/* STEP 1: Account (Role + Basics) */}
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What describes you best?</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

            {/* STEP 2: Education or Work details */}
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
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your degree type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEGREE_TYPES.map((degree) => (
                                <SelectItem key={degree} value={degree}>
                                  {degree}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch/Major *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your field of study" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MAJORS_BRANCHES.map((major) => (
                                <SelectItem key={major} value={major}>
                                  {major}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select graduation year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GRADUATION_YEARS.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your degree type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DEGREE_TYPES.map((degree) => (
                                <SelectItem key={degree} value={degree}>
                                  {degree}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your major" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MAJORS_BRANCHES.map((major) => (
                                <SelectItem key={major} value={major}>
                                  {major}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select graduation year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {GRADUATION_YEARS.map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select or type your company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {POPULAR_COMPANIES.map((company) => (
                                <SelectItem key={company} value={company}>
                                  {company}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="mt-2">
                            <Input
                              placeholder="Or type your company name"
                              value={
                                field.value === "Other" ? "" : field.value || ""
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {JOB_DESIGNATIONS.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="mt-2">
                            <Input
                              placeholder="Or type your job title"
                              value={
                                field.value === "Other" ? "" : field.value || ""
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              className="text-sm"
                            />
                          </div>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your target exam" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ENTRANCE_EXAMS.map((exam) => (
                                <SelectItem key={exam} value={exam}>
                                  {exam}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="mt-2">
                            <Input
                              placeholder="Or type your target exam"
                              value={
                                field.value === "Other" ? "" : field.value || ""
                              }
                              onChange={(e) => field.onChange(e.target.value)}
                              className="text-sm"
                            />
                          </div>
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

            {/* STEP 3: Interests */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <FormLabel>Pick a few interests</FormLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {INTEREST_SUGGESTIONS.map((i) => {
                      const selected = (form.watch("interests") || []).includes(i);
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            const current = new Set(form.getValues("interests") || []);
                            if (selected) current.delete(i);
                            else current.add(i);
                            form.setValue("interests", Array.from(current));
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs border",
                            selected
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                          )}
                        >
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <FormLabel>What are you looking for?</FormLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LOOKING_FOR_SUGGESTIONS.map((i) => {
                      const selected = (form.watch("lookingFor") || []).includes(i);
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            const current = new Set(form.getValues("lookingFor") || []);
                            if (selected) current.delete(i);
                            else current.add(i);
                            form.setValue("lookingFor", Array.from(current));
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs border",
                            selected
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800"
                          )}
                        >
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Goals & Experience */}
            {step === 4 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={60} placeholder="0" {...field} />
                      </FormControl>
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
                        <Textarea placeholder="Tell us a bit about yourself..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* STEP 5: Socials */}
            {step === 5 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/yourname" {...field} />
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
                      <FormLabel>Skills (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., JavaScript, Design, Marketing" {...field} />
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
            <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
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
