// Types for user profiles and database models

export interface VerificationDocument {
  id: string;
  type: 'id_card_front' | 'id_card_back' | 'additional_document';
  url: string;
  filename: string;
  uploaded_at: string;
  verified_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  profile_id: string;
  verification_method: 'id_card' | 'phone' | 'document';
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'resubmit';
  documents?: VerificationDocument[];
  phone_number?: string;
  verification_code?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email?: string;
  role: "student" | "alumni" | "aspirant" | "admin";
  full_name: string;
  avatar_url?: string; // legacy optional
  profile_image_url?: string; // actual column in DB per complete_schema.sql
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
  skills?: string[];
  bio?: string;
  years_of_experience?: number;
  interests?: string[];
  looking_for?: string[];
  preferences?: Record<string, unknown> | null;
  social?: Record<string, string> | null;
  onboarded: boolean;
  privacy_settings?: Record<string, boolean>;
  is_mentor_available?: boolean;
  mentor_capacity?: number;
  
  // Verification fields
  verification_status?: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'resubmit';
  verification_method?: 'id_card' | 'phone' | 'document';
  verification_documents?: VerificationDocument[];
  phone_verified?: boolean;
  verification_notes?: string;
  verified_at?: string;
  verification_submitted_at?: string;
  
  created_at: string;
  updated_at: string;
}

// Post types for alumni job sharing
export interface Post {
  id: string;
  author_id: string;
  author?: Profile;
  type: "job" | "referral" | "update" | "question" | "resource";
  title: string;
  content: string;
  external_url?: string;
  company_name?: string;
  location?: string;
  salary_range?: string;
  experience_required?: string;
  skills_required?: string[];
  job_type?: "full-time" | "part-time" | "internship" | "contract";
  experience_level?: "entry" | "mid" | "senior";
  apply_url?: string;
  deadline?: string;
  tags?: string[];
  is_featured?: boolean;
  is_active: boolean;
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  applications_count?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface PostInteraction {
  id: string;
  post_id: string;
  user_id: string;
  type: "like" | "bookmark";
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  content: string;
  created_at: string;
  updated_at: string;
}

// Messaging types
export interface Conversation {
  id: string;
  type: "direct" | "group";
  name?: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  user?: Profile;
  joined_at: string;
  last_read_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: Profile;
  content: string;
  type: "text" | "image" | "file";
  created_at: string;
  updated_at: string;
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

// Mentorship types
export interface MentorshipConnection {
  id: string;
  mentor_id: string;
  mentee_id: string;
  mentor?: Profile;
  mentee?: Profile;
  status: "pending" | "active" | "completed" | "declined";
  requested_at: string;
  responded_at?: string;
  notes?: string;
  goals?: string[];
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  type: "post_like" | "post_comment" | "message" | "mentorship_request" | "system";
  title: string;
  content: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// User preferences
export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  mentor_requests: boolean;
  job_alerts: boolean;
  privacy_profile: "public" | "connections" | "private";
  privacy_posts: "public" | "connections" | "private";
  privacy_contact: "public" | "connections" | "private";
  created_at: string;
  updated_at: string;
}

export interface OnboardingFormData {
  role: "student" | "alumni" | "aspirant" | "admin";
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
  skills?: string[];
  bio?: string;
  yearsOfExperience?: number;
  interests?: string[];
  lookingFor?: string[];
  preferences?: Record<string, unknown>;
  isMentorAvailable?: boolean;
  mentorCapacity?: number;
  
  // Verification fields
  phoneNumber?: string;
  idCardFront?: File;
  idCardBack?: File;
  additionalDocuments?: File[];
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
