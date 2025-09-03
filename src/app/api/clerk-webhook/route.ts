import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();

  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook received:", evt.type);

  if (evt.type === "user.created") {
    const { id, first_name, last_name } = evt.data;

    console.log("🟢 Trying to insert:", { id, first_name, last_name });

    const { error } = await supabase.from("profiles").insert({
      user_id: id,
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      onboarded: false,
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
    } else {
      console.log("✅ Insert successful!");
    }
  }

  return NextResponse.json({ success: true });
}
