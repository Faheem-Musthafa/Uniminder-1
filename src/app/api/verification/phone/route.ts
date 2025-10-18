import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabase();
    const { phoneNumber, verificationCode } = await req.json();

    if (!phoneNumber?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Basic phone number validation
    const phoneRegex = /^\+\d{1,3}\s?\d{8,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number with country code" },
        { status: 400 }
      );
    }

    // Check if user has a pending phone verification request
    const { data: existingRequest, error: requestError } = await supabase
      .from("verification_requests")
      .select("id, status, phone_number, verification_code")
      .eq("user_id", userId)
      .eq("verification_method", "phone")
      .eq("status", "pending")
      .single();

    if (requestError && requestError.code !== "PGRST116") {
      console.error("Error checking existing verification request:", requestError);
      return NextResponse.json(
        { error: "Failed to check verification status" },
        { status: 500 }
      );
    }

    if (!existingRequest) {
      return NextResponse.json(
        { error: "No pending phone verification request found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    const requestId = existingRequest.id;

    if (verificationCode) {
      // Verify the code
      if (existingRequest.verification_code !== verificationCode) {
        return NextResponse.json(
          { error: "Invalid verification code" },
          { status: 400 }
        );
      }

      // Mark verification as approved
      const { error: updateError } = await supabase
        .from("verification_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (updateError) {
        console.error("Error updating verification request:", updateError);
        return NextResponse.json(
          { error: "Failed to update verification status" },
          { status: 500 }
        );
      }

      // Update profile verification status
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          verification_status: "approved",
          phone_verified: true,
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileUpdateError) {
        console.error("Error updating profile verification status:", profileUpdateError);
        return NextResponse.json(
          { error: "Failed to update profile verification status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Phone number verified successfully",
        data: {
          status: "approved",
          verified: true,
        },
      });
    } else {
      // Send verification code (simplified - in production, integrate with SMS service)
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Update verification request with code and phone number
      const { error: codeUpdateError } = await supabase
        .from("verification_requests")
        .update({
          phone_number: phoneNumber,
          verification_code: generatedCode,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (codeUpdateError) {
        console.error("Error saving verification code:", codeUpdateError);
        return NextResponse.json(
          { error: "Failed to send verification code" },
          { status: 500 }
        );
      }

      // TODO: Integrate with actual SMS service (Twilio, AWS SNS, etc.)
      console.log(`📱 Verification code for ${phoneNumber}: ${generatedCode}`);

      // Update profile status
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          verification_status: "submitted",
          verification_submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (profileUpdateError) {
        console.error("Error updating profile verification status:", profileUpdateError);
        // Don't fail the request if profile update fails
      }

      return NextResponse.json({
        success: true,
        message: "Verification code sent to your phone",
        data: {
          status: "code_sent",
          // Don't return the code in production - only for development
          ...(process.env.NODE_ENV === "development" && { code: generatedCode }),
        },
      });
    }
  } catch (err: unknown) {
    console.error("Phone verification error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}