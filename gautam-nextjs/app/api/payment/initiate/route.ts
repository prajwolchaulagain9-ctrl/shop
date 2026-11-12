import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Please choose Cash on Delivery at checkout. For eSewa, contact the shop on WhatsApp.",
      whatsappUrl: "https://wa.me/9779849591758",
    },
    { status: 409 },
  );
}
