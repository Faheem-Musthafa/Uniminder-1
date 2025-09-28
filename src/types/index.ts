// Types for user profiles and database models

export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  role: "student" | "alumni" | "aspirant";
  full_name: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  passing_year?: string;
  company?: string;
  designation?: string;
  entrance_exam?: string;
  target_college?: string;
  linkedin?: string;
  skills?: string;
  bio?: string;
  years_of_experience?: number;
  interests?: string[];
  looking_for?: string[];
  preferences?: Record<string, unknown> | null;
  social?: Record<string, string> | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingFormData {
  role: "student" | "alumni" | "aspirant";
  fullName: string;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  passingYear?: string;
  company?: string;
  designation?: string;
  entranceExam?: string;
  targetCollege?: string;
  linkedin?: string;
  skills?: string;
  bio?: string;
  yearsOfExperience?: number;
  interests?: string[];
  lookingFor?: string[];
  preferences?: Record<string, unknown>;
}

export interface DashboardProps {
  profile: Profile;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
