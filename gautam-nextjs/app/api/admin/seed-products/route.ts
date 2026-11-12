import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, forbiddenResponse } from "@/lib/middleware/auth";
export async function GET() {
  return NextResponse.json(
    { message: "Use product management to add products." },
    { status: 405 },
  );
}
export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) return forbiddenResponse();
  return NextResponse.json(
    {
      message:
        "Your existing catalogue is preserved. Add products through product management.",
    },
    { status: 409 },
  );
}
