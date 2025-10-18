import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

interface OnboardingData {
  role: "student" | "alumni" | "aspirant";
  fullName: string;
  email?: string;
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
  
  // Verification fields
  phoneNumber?: string;
  idCardFront?: File;
  idCardBack?: File;
  additionalDocuments?: File[];
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    const data: OnboardingData = await req.json();

    // Validate required fields
    if (!data.role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    if (!data.fullName?.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    // Validate role
    const allowedRoles = ["student", "alumni", "aspirant"];
    if (!allowedRoles.includes(data.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Role-specific validation
    if (data.role === "student" || data.role === "alumni") {
      if (!data.college?.trim()) {
        return NextResponse.json(
          { error: "College is required" },
          { status: 400 }
        );
      }
      if (!data.passingYear?.trim()) {
        return NextResponse.json(
          { error: "Year is required" },
          { status: 400 }
        );
      }
    }

    if (data.role === "alumni" && !data.company?.trim()) {
      return NextResponse.json(
        { error: "Company is required for alumni" },
        { status: 400 }
      );
    }

    if (data.role === "aspirant" && !data.entranceExam?.trim()) {
      return NextResponse.json(
        { error: "Entrance exam is required for aspirants" },
        { status: 400 }
      );
    }

    // Verification validation
    if (data.role === "student" || data.role === "alumni") {
      // For students and alumni, ID card verification is required
      // File uploads will be handled separately via /api/verification/upload
    }

    if (data.role === "aspirant") {
      if (!data.phoneNumber?.trim()) {
        return NextResponse.json(
          { error: "Phone number is required for aspirants" },
          { status: 400 }
        );
      }
      // Basic phone number validation
      const phoneRegex = /^\+\d{1,3}\s?\d{8,15}$/;
      if (!phoneRegex.test(data.phoneNumber)) {
        return NextResponse.json(
          { error: "Please enter a valid phone number with country code" },
          { status: 400 }
        );
      }
    }

    // Prepare payload for database
    const payload = {
      user_id: userId, // Primary key field
      email: data.email,
      role: data.role,
      full_name: data.fullName,
      location: data.location || null,
      college: data.college || null,
      degree: data.degree || null,
      branch: data.branch || null,
      passing_year: data.passingYear || null,
      company: data.company || null,
      designation: data.designation || null,
      entrance_exam: data.entranceExam || null,
      target_college: data.targetCollege || null,
      linkedin: data.linkedin || null,
      skills: data.skills || null,
      bio: data.bio || null,
      years_of_experience:
        typeof data.yearsOfExperience === "number"
          ? data.yearsOfExperience
          : null,
      interests: Array.isArray(data.interests) ? data.interests : null,
      looking_for: Array.isArray(data.lookingFor) ? data.lookingFor : null,
      onboarded: true,
      
      // Verification fields
      verification_status: 'pending',
      verification_method: data.role === 'aspirant' ? 'phone' : 'id_card',
      phone_verified: data.role === 'aspirant' ? false : null,
      verification_submitted_at: new Date().toISOString(),
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>;

    // Remove empty/null values to avoid database issues
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === undefined) {
        payload[key] = null;
      }
    });

    // Log payload for debugging
    console.log("🔍 Attempting to save payload:", {
      userId,
      payloadKeys: Object.keys(payload),
      role: payload.role,
      fullName: payload.full_name,
    });

    // Use upsert to create or update profile
    const { data: profile, error: upsertError } = await supabase
      .from("profiles")
      .upsert(payload, {
        onConflict: "user_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (upsertError) {
      console.error("❌ Supabase upsert error:", upsertError);
      console.error("❌ Error details:", {
        code: upsertError.code,
        message: upsertError.message,
        hint: upsertError.hint,
        details: upsertError.details,
      });

      const debug = process.env.NODE_ENV === "development";
      return NextResponse.json(
        {
          error: "Failed to save profile",
          ...(debug && {
            details: upsertError.message,
            code: upsertError.code,
            hint: upsertError.hint,
          }),
        },
        { status: 500 }
      );
    }

    console.log("✅ Profile saved successfully:", {
      id: profile?.id,
      onboarded: profile?.onboarded,
      role: profile?.role
    });

    // Create verification request
    const verificationPayload = {
      user_id: userId,
      profile_id: userId,
      verification_method: data.role === 'aspirant' ? 'phone' : 'id_card',
      status: 'pending',
      phone_number: data.role === 'aspirant' ? data.phoneNumber : null,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: verificationError } = await supabase
      .from("verification_requests")
      .insert(verificationPayload);

    if (verificationError) {
      console.error("❌ Verification request creation error:", verificationError);
      // Don't fail the entire onboarding if verification request fails
      // Just log it and continue
    } else {
      console.log("✅ Verification request created successfully");
    }

    return NextResponse.json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (err: unknown) {
    console.error("❌ Onboarding handler error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Optional: Add GET method to fetch profile data
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = getSupabase();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = not found
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile || null,
    });
  } catch (err: unknown) {
    console.error("Profile GET error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
