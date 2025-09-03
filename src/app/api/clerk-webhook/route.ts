import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { supabase as sharedSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();

  const supabase = sharedSupabase;

  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  // Define a narrow event type to avoid `any` and satisfy ESLint
  type SvixEvent<T = unknown> = { type: string; data: T };
  type UserCreatedData = {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
  };

  let evt: SvixEvent | undefined;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as unknown as SvixEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook received:", evt?.type);

  if (evt?.type === "user.created") {
    const { id, first_name, last_name } = evt.data as UserCreatedData;

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
