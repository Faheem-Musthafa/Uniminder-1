import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();

    // Get profile verification status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`
        id,
        role,
        verification_status,
        verification_method,
        phone_verified,
        verification_notes,
        verified_at,
        verification_submitted_at
      `)
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile verification status:", profileError);
      return NextResponse.json(
        { error: "Failed to fetch verification status" },
        { status: 500 }
      );
    }

    // Get verification request details
    const { data: verificationRequest, error: requestError } = await supabase
      .from("verification_requests")
      .select(`
        id,
        verification_method,
        status,
        phone_number,
        submitted_at,
        reviewed_at,
        reviewed_by,
        notes,
        verification_documents (
          id,
          type,
          url,
          filename,
          uploaded_at,
          status,
          notes
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (requestError && requestError.code !== "PGRST116") {
      console.error("Error fetching verification request:", requestError);
      return NextResponse.json(
        { error: "Failed to fetch verification details" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: profile,
        verificationRequest: verificationRequest || null,
      },
    });
  } catch (err: unknown) {
    console.error("Verification status error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}