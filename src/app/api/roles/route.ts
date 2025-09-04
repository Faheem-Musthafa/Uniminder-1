import { NextResponse } from "next/server";

export function GET() {
  const roles = [
    { id: "student", label: "Student" },
    { id: "alumni", label: "Alumni" },
    { id: "aspirant", label: "Aspirant" },
  ];

  return NextResponse.json({ roles });
}
