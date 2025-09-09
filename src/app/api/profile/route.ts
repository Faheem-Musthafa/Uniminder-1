import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/supabase";
import { rateLimiter } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateCheck = rateLimiter(userId, 50, 60000); // 50 requests per minute
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests",
          resetTime: rateCheck.resetTime,
        },
        { status: 429 }
      );
    }

    const profile = await db.profiles.findById(userId);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateCheck = rateLimiter(`${userId}-update`, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many update requests" },
        { status: 429 }
      );
    }

    const updateData = await req.json();

    // Remove sensitive fields that shouldn't be updated
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;

    updateData.updated_at = new Date().toISOString();

    const profile = await db.profiles.upsert({
      id: userId,
      ...updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}
