import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();

    // Test basic connection
    console.log("🔍 Testing Supabase connection...");

    // Check if profiles table exists and get its structure
    const { error: tableError } = await supabase
      .from("profiles")
      .select("*")
      .limit(0); // Don't fetch any rows, just check structure

    if (tableError) {
      console.error("❌ Table check error:", tableError);
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: {
          code: tableError.code,
          message: tableError.message,
          hint: tableError.hint,
        },
      });
    }

    // Test environment variables
    const envCheck = {
      hasSupabaseUrl:
        !!process.env.SUPABASE_URL || !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey:
        !!process.env.SUPABASE_SERVICE_ROLE_KEY ||
        !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    console.log("✅ Database connection successful");

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      environment: envCheck,
      tableExists: true,
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    return NextResponse.json({
      success: false,
      error: "Health check failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
