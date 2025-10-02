"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Profile } from "@/types";
import { Upload, Save, Loader2 } from "lucide-react";

interface ProfileEditFormProps {
  profile: Profile;
}

export default function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    location: profile.location || "",
    bio: profile.bio || "",
    skills: profile.skills || "",
    linkedin: profile.linkedin || "",
    college: profile.college || "",
    degree: profile.degree || "",
    branch: profile.branch || "",
    passing_year: profile.passing_year || "",
    company: profile.company || "",
    designation: profile.designation || "",
    years_of_experience: profile.years_of_experience || 0,
    entrance_exam: profile.entrance_exam || "",
    target_college: profile.target_college || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setMessage(result.error || "Failed to update profile");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update your basic profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/avatars/default.jpg" alt={formData.full_name} />
              <AvatarFallback className="text-lg">
                {formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button type="button" variant="outline" className="mb-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
            <Badge>{profile.role}</Badge>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange("skills", e.target.value)}
                placeholder="Comma-separated skills"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      {(profile.role === "student" || profile.role === "alumni") && (
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>
              Your educational background and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="branch">Field of Study</Label>
                <Input
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => handleInputChange("branch", e.target.value)}
                  placeholder="Computer Science, Engineering, etc."
                />
              </div>
              <div>
                <Label htmlFor="passing_year">
                  {profile.role === "student" ? "Expected Graduation" : "Graduation Year"}
                </Label>
                <Input
                  id="passing_year"
                  value={formData.passing_year}
                  onChange={(e) => handleInputChange("passing_year", e.target.value)}
                  placeholder="2025"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Information */}
      {profile.role === "alumni" && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              Your current work and professional experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="company">Current Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="designation">Job Title</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange("designation", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                id="years_of_experience"
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => handleInputChange("years_of_experience", parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aspirant Information */}
      {profile.role === "aspirant" && (
        <Card>
          <CardHeader>
            <CardTitle>Test Preparation Information</CardTitle>
            <CardDescription>
              Your test preparation goals and targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="entrance_exam">Target Exam</Label>
                <Input
                  id="entrance_exam"
                  value={formData.entrance_exam}
                  onChange={(e) => handleInputChange("entrance_exam", e.target.value)}
                  placeholder="GRE, GMAT, SAT, etc."
                />
              </div>
              <div>
                <Label htmlFor="target_college">Target College/University</Label>
                <Input
                  id="target_college"
                  value={formData.target_college}
                  onChange={(e) => handleInputChange("target_college", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        {message && (
          <p className={`text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}