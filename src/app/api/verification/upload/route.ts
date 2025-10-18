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

    // Parse form data for file uploads
    const formData = await req.formData();
    const idCardFront = formData.get("idCardFront") as File | null;
    const idCardBack = formData.get("idCardBack") as File | null;

    if (!idCardFront) {
      return NextResponse.json(
        { error: "ID card front image is required" },
        { status: 400 }
      );
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(idCardFront.type)) {
      return NextResponse.json(
        { error: "ID card front must be a valid image file (JPEG, PNG, WebP)" },
        { status: 400 }
      );
    }

    if (idCardBack && !allowedTypes.includes(idCardBack.type)) {
      return NextResponse.json(
        { error: "ID card back must be a valid image file (JPEG, PNG, WebP)" },
        { status: 400 }
      );
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (idCardFront.size > maxSize) {
      return NextResponse.json(
        { error: "ID card front image must be less than 5MB" },
        { status: 400 }
      );
    }

    if (idCardBack && idCardBack.size > maxSize) {
      return NextResponse.json(
        { error: "ID card back image must be less than 5MB" },
        { status: 400 }
      );
    }

    // Check if user has a pending verification request
    const { data: existingRequest, error: requestError } = await supabase
      .from("verification_requests")
      .select("id, status")
      .eq("user_id", userId)
      .eq("verification_method", "id_card")
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
        { error: "No pending verification request found. Please complete onboarding first." },
        { status: 400 }
      );
    }

    const requestId = existingRequest.id;

    // Upload files to Supabase Storage
    const uploadPromises = [];

    // Upload front image
    const frontFileName = `id_card_front_${userId}_${Date.now()}.jpg`;
    const frontPath = `verification/${userId}/${frontFileName}`;

    const frontArrayBuffer = await idCardFront.arrayBuffer();
    const frontFile = new File([frontArrayBuffer], frontFileName, {
      type: idCardFront.type,
    });

    uploadPromises.push(
      supabase.storage
        .from("verification-documents")
        .upload(frontPath, frontFile, {
          cacheControl: "3600",
          upsert: false,
        })
    );

    // Upload back image if provided
    let backPath = null;
    if (idCardBack) {
      const backFileName = `id_card_back_${userId}_${Date.now()}.jpg`;
      backPath = `verification/${userId}/${backFileName}`;

      const backArrayBuffer = await idCardBack.arrayBuffer();
      const backFile = new File([backArrayBuffer], backFileName, {
        type: idCardBack.type,
      });

      uploadPromises.push(
        supabase.storage
          .from("verification-documents")
          .upload(backPath, backFile, {
            cacheControl: "3600",
            upsert: false,
          })
      );
    }

    // Wait for all uploads to complete
    const uploadResults = await Promise.allSettled(uploadPromises);

    // Check for upload failures
    const failedUploads = uploadResults.filter(
      (result) => result.status === "rejected"
    );

    if (failedUploads.length > 0) {
      console.error("File upload failures:", failedUploads);
      return NextResponse.json(
        { error: "Failed to upload verification documents" },
        { status: 500 }
      );
    }

    // Get public URLs for the uploaded files
    const { data: frontUrlData } = supabase.storage
      .from("verification-documents")
      .getPublicUrl(frontPath);

    let backUrlData = null;
    if (backPath) {
      const { data } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(backPath);
      backUrlData = data;
    }

    // Create verification documents records
    const documents = [
      {
        request_id: requestId,
        type: "id_card_front",
        url: frontUrlData.publicUrl,
        filename: frontFileName,
        uploaded_at: new Date().toISOString(),
        status: "pending",
      },
    ];

    if (backUrlData && backPath) {
      documents.push({
        request_id: requestId,
        type: "id_card_back",
        url: backUrlData.publicUrl,
        filename: backPath.split("/").pop() || "",
        uploaded_at: new Date().toISOString(),
        status: "pending",
      });
    }

    const { error: documentsError } = await supabase
      .from("verification_documents")
      .insert(documents);

    if (documentsError) {
      console.error("Error saving document records:", documentsError);
      return NextResponse.json(
        { error: "Failed to save document records" },
        { status: 500 }
      );
    }

    // Update verification request status
    const { error: updateError } = await supabase
      .from("verification_requests")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
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
      message: "Verification documents uploaded successfully",
      data: {
        requestId,
        documentsCount: documents.length,
        status: "submitted",
      },
    });
  } catch (err: unknown) {
    console.error("Verification upload error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}