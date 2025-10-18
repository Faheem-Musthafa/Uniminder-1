"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

type Role = "student" | "alumni" | "aspirant";

interface FormData {
  role: Role | "";
  fullName: string;
  email: string;
  location: string;
  college: string;
  degree: string;
  branch: string;
  passingYear: string;
  company: string;
  designation: string;
  entranceExam: string;
  targetCollege: string;
  linkedin: string;
  skills: string[];
  bio: string;
  yearsOfExperience: number;
  interests: string[];
  lookingFor: string[];
  
  // Verification fields
  phoneNumber: string;
  idCardFront?: File;
  idCardBack?: File;
  additionalDocuments?: File[];
}

const initialFormData: FormData = {
  role: "",
  fullName: "",
  email: "",
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
  skills: [],
  bio: "",
  yearsOfExperience: 0,
  interests: [],
  lookingFor: [],
  phoneNumber: "",
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  // Local UI state for skills input field (cannot use hooks inside nested render functions)
  const [skillInput, setSkillInput] = useState("");
  // const router = useRouter(); // Using window.location.href instead for hard refresh
  const { user, isLoaded } = useUser();

  // Auto-fill user data
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  // Calculate progress
  const totalSteps = formData.role === "student" ? 4 : formData.role === "alumni" ? 5 : formData.role === "aspirant" ? 5 : 1;
  const progress = (currentStep / totalSteps) * 100;

  // Update form field
  const updateField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Auto-save progress
  const autoSave = async () => {
    if (!formData.role || saveStatus === "saving") return;
    
    try {
      setSaveStatus("saving");
      await fetch("/api/onboarding/save", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("idle");
    }
  };

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep > 1) autoSave();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep]);

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.role) newErrors.role = "Please select a role";
    }

    if (currentStep === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = "Name is required";
      
      if (formData.role === "student" || formData.role === "alumni") {
        if (!formData.college.trim()) newErrors.college = "College is required";
        if (!formData.passingYear.trim()) newErrors.passingYear = "Year is required";
      }
      
      if (formData.role === "aspirant") {
        if (!formData.entranceExam.trim()) newErrors.entranceExam = "Entrance exam is required";
      }
    }

    if (currentStep === 3 && formData.role === "alumni") {
      if (!formData.company.trim()) newErrors.company = "Company is required";
    }

    // Verification step validation
    if ((currentStep === 4 && formData.role === "student") || (currentStep === 5 && (formData.role === "alumni" || formData.role === "aspirant"))) {
      if (formData.role === "student" || formData.role === "alumni") {
        if (!formData.idCardFront) newErrors.idCardFront = "ID card front image is required";
      }
      
      if (formData.role === "aspirant") {
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        // Basic phone number validation
        const phoneRegex = /^\+\d{1,3}\s?\d{8,15}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
          newErrors.phoneNumber = "Please enter a valid phone number with country code";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate steps
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      // For students and alumni, we need to handle file uploads
      if (formData.role === "student" || formData.role === "alumni") {
        // First submit the basic profile data
        const profileResponse = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            // Remove file objects from JSON payload
            idCardFront: undefined,
            idCardBack: undefined,
            additionalDocuments: undefined,
          }),
        });

        const profileResult = await profileResponse.json();

        if (!profileResponse.ok) {
          setErrors({ submit: profileResult.error || "Failed to save profile" });
          return;
        }

        // Then upload verification documents if provided
        if (formData.idCardFront) {
          const formDataUpload = new FormData();
          formDataUpload.append("idCardFront", formData.idCardFront);
          if (formData.idCardBack) {
            formDataUpload.append("idCardBack", formData.idCardBack);
          }

          const uploadResponse = await fetch("/api/verification/upload", {
            method: "POST",
            body: formDataUpload,
          });

          const uploadResult = await uploadResponse.json();

          if (!uploadResponse.ok) {
            setErrors({ submit: uploadResult.error || "Failed to upload verification documents" });
            return;
          }
        }
      } else if (formData.role === "aspirant") {
        // For aspirants, submit profile and initiate phone verification
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrors({ submit: result.error || "Failed to save profile" });
          return;
        }

        // Initiate phone verification
        const phoneResponse = await fetch("/api/verification/phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
          }),
        });

        const phoneResult = await phoneResponse.json();

        if (!phoneResponse.ok) {
          setErrors({ submit: phoneResult.error || "Failed to send verification code" });
          return;
        }

        // Show success message with verification code for development
        if (process.env.NODE_ENV === "development" && phoneResult.data?.code) {
          alert(`Development mode: Your verification code is ${phoneResult.data.code}`);
        }
      } else {
        // Fallback for other roles
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          setErrors({ submit: result.error || "Failed to save profile" });
          return;
        }
      }

      // Small delay to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to role-specific dashboard
      const dashboardPath = formData.role === 'student' ? '/dashboard/student' :
                           formData.role === 'alumni' ? '/dashboard/alumni' :
                           formData.role === 'aspirant' ? '/dashboard/aspirant' :
                           '/dashboard';
      
      // Force reload to ensure middleware sees the updated profile
      window.location.href = dashboardPath;
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render role selection
  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">
          Choose Your Role
        </h2>
        <p className="text-muted-foreground mt-2">
          Select what best describes you. This helps us personalize your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            role: "student" as Role,
            icon: "🎓",
            title: "Student",
            description: "Currently pursuing a degree",
          },
          {
            role: "alumni" as Role,
            icon: "💼",
            title: "Alumni",
            description: "Graduated and working professional",
          },
          {
            role: "aspirant" as Role,
            icon: "🎯",
            title: "Aspirant",
            description: "Preparing for entrance exams",
          },
        ].map((option) => (
          <Card
            key={option.role}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              formData.role === option.role
                ? "ring-2 ring-primary bg-primary/10"
                : "hover:ring-2 hover:ring-muted"
            }`}
            onClick={() => updateField("role", option.role)}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{option.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {errors.role && (
        <p className="text-destructive text-sm text-center">{errors.role}</p>
      )}
    </div>
  );

  // Render basic info
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Basic Information
        </h2>
        <p className="text-muted-foreground mt-2">
          Tell us about yourself
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="Full-Name"
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="your-email@example.com"
            disabled
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="New York, USA"
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
      </div>

      {(formData.role === "student" || formData.role === "alumni") && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="college">College/University *</Label>
              <Input
                id="college"
                value={formData.college}
                onChange={(e) => updateField("college", e.target.value)}
                placeholder="Calicut University"
                className={errors.college ? "border-red-500" : ""}
              />
              {errors.college && (
                <p className="text-destructive text-sm mt-1">{errors.college}</p>
              )}
            </div>

            <div>
              <Label htmlFor="degree">Degree</Label>
              <Select
                value={formData.degree}
                onValueChange={(value) => updateField("degree", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor's">Bachelor&apos;s</SelectItem>
                  <SelectItem value="Master's">Master&apos;s</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="branch">Branch/Major</Label>
              <Input
                id="branch"
                value={formData.branch}
                onChange={(e) => updateField("branch", e.target.value)}
                placeholder="Computer Science"
              />
            </div>

            <div>
              <Label htmlFor="passingYear">
                {formData.role === "student" ? "Expected Graduation Year" : "Passing Year"} *
              </Label>
              <Input
                id="passingYear"
                value={formData.passingYear}
                onChange={(e) => updateField("passingYear", e.target.value)}
                placeholder="2025"
                className={errors.passingYear ? "border-red-500" : ""}
              />
              {errors.passingYear && (
                <p className="text-red-500 text-sm mt-1">{errors.passingYear}</p>
              )}
            </div>
          </div>
        </>
      )}

      {formData.role === "aspirant" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entranceExam">Target Entrance Exam *</Label>
              <Input
                id="entranceExam"
                value={formData.entranceExam}
                onChange={(e) => updateField("entranceExam", e.target.value)}
                placeholder="JEE, NEET, CAT, etc."
                className={errors.entranceExam ? "border-red-500" : ""}
              />
              {errors.entranceExam && (
                <p className="text-red-500 text-sm mt-1">{errors.entranceExam}</p>
              )}
            </div>

            <div>
              <Label htmlFor="targetCollege">Target College</Label>
              <Input
                id="targetCollege"
                value={formData.targetCollege}
                onChange={(e) => updateField("targetCollege", e.target.value)}
                placeholder="IIT Bombay, AIIMS, etc."
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Render professional info (alumni only)
  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Professional Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Share your work experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company">Current Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Google"
            className={errors.company ? "border-red-500" : ""}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        <div>
          <Label htmlFor="designation">Job Title</Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => updateField("designation", e.target.value)}
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min="0"
            value={formData.yearsOfExperience || ""}
            onChange={(e) => updateField("yearsOfExperience", parseInt(e.target.value) || 0)}
            placeholder="3"
          />
        </div>
      </div>
    </div>
  );

  // Render additional info
  const addSkill = () => {
      const trimmed = skillInput.trim();
      if (trimmed && !formData.skills.includes(trimmed)) {
        updateField("skills", [...formData.skills, trimmed]);
        setSkillInput("");
      }
    };

  const removeSkill = (skillToRemove: string) => {
      updateField("skills", formData.skills.filter(skill => skill !== skillToRemove));
    };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addSkill();
      }
    };

  const renderAdditionalInfo = () => {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Almost Done!
          </h2>
          <p className="text-muted-foreground mt-2">
            Just a few more details
          </p>
        </div>

        <div>
          <Label htmlFor="skills">Skills & Interests</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyPress}
                placeholder="Add a skill (press Enter or comma to add)"
                className="flex-1"
              />
              <Button type="button" onClick={addSkill} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Add your technical skills, interests, and expertise areas
          </p>
        </div>

        <div>
          <Label htmlFor="bio">Brief Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Tell us about yourself, your goals, and what you&apos;re looking for..."
            rows={4}
          />
        </div>
      </div>
    );
  };

  // Render verification step
  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Verify Your Identity
        </h2>
        <p className="text-muted-foreground mt-2">
          Help us keep our community safe and trustworthy
        </p>
      </div>

      {(formData.role === "student" || formData.role === "alumni") && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📋 ID Card Verification
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Please upload clear photos of your student/alumni ID card (front and back).
              This helps verify your educational background and ensures a trusted community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="idCardFront">ID Card Front *</Label>
              <Input
                id="idCardFront"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateField("idCardFront", file);
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload front side of your ID card
              </p>
            </div>

            <div>
              <Label htmlFor="idCardBack">ID Card Back</Label>
              <Input
                id="idCardBack"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) updateField("idCardBack", file);
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload back side if applicable
              </p>
            </div>
          </div>
        </div>
      )}

      {formData.role === "aspirant" && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              📱 Phone Verification
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              We&apos;ll send a verification code to your phone number to confirm your identity.
              This helps maintain a genuine community of aspirants.
            </p>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="+91 9876543210"
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Include country code (e.g., +91 for India)
            </p>
          </div>
        </div>
      )}

      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          🔒 Privacy & Security
        </h4>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Your verification documents are encrypted and securely stored</li>
          <li>• Only authorized administrators can review verification requests</li>
          <li>• Your personal information is never shared without consent</li>
          <li>• You can request deletion of verification data at any time</li>
        </ul>
      </div>
    </div>
  );

  // Render current step
  const renderStep = () => {
    if (currentStep === 1) return renderRoleSelection();
    if (currentStep === 2) return renderBasicInfo();
    if (currentStep === 3 && formData.role === "alumni") return renderProfessionalInfo();
    if (currentStep === 3 && formData.role !== "alumni") return renderAdditionalInfo();
    if (currentStep === 4 && formData.role === "alumni") return renderAdditionalInfo();
    if ((currentStep === 4 && formData.role === "student") || (currentStep === 5)) return renderVerification();
    return renderAdditionalInfo();
  };

  return (
    <div className="w-full">
      <Card className="shadow-xl border-gray-200 dark:border-gray-800">
        <CardContent className="p-6 md:p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep} of {totalSteps}
              </span>
              {saveStatus === "saved" && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </span>
              )}
              {saveStatus === "saving" && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              )}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
