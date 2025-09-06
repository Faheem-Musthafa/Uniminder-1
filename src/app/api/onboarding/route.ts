import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

interface OnboardingData {
  role: "student" | "alumni" | "aspirant";
  fullName: string;
  email?: string;
  location?: string;
  college?: string;
  branch?: string;
  passingYear?: string;
  company?: string;
  designation?: string;
  entranceExam?: string;
  targetCollege?: string;
  linkedin?: string;
  skills?: string;
  bio?: string;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

    // Prepare payload for database
    const payload = {
      id: userId, // Use 'id' instead of 'user_id' to match middleware
      user_id: userId, // Keep both for compatibility
      email: data.email,
      role: data.role,
      full_name: data.fullName,
      location: data.location || null,
      college: data.college || null,
      branch: data.branch || null,
      passing_year: data.passingYear || null,
      company: data.company || null,
      designation: data.designation || null,
      entrance_exam: data.entranceExam || null,
      target_college: data.targetCollege || null,
      linkedin: data.linkedin || null,
      skills: data.skills || null,
      bio: data.bio || null,
      onboarded: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>;

    // Remove empty/null values to avoid database issues
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === undefined) {
        payload[key] = null;
      }
    });

    // Use upsert to create or update profile
    const { data: profile, error: upsertError } = await supabase
      .from("profiles")
      .upsert(payload, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (upsertError) {
      console.error("❌ Supabase upsert error:", upsertError);
      const debug = process.env.NODE_ENV === "development";
      return NextResponse.json(
        {
          error: "Failed to save profile",
          ...(debug && { details: upsertError.message }),
        },
        { status: 500 }
      );
    }

    console.log("✅ Profile saved successfully:", profile?.id);

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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
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
