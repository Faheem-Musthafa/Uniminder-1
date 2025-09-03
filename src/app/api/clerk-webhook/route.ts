import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for insert
);

export async function POST(req: Request) {
  const payload = await req.json();
  const eventType = req.headers.get("svix-event-type");

  if (eventType === "user.created") {
    const { id, first_name, last_name, email_addresses } = payload.data;

    await supabase.from("profiles").insert({
      user_id: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      onboarded: false,
    });
  }

  return NextResponse.json({ status: "ok" });
}
