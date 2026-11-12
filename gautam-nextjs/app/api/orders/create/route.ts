import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { validateDatabaseOrder } from "@/lib/catalog/validate-order";
import { requireAuth } from "@/lib/middleware/auth";
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth)
      return NextResponse.json(
        { success: false, message: "Please sign in to place your order." },
        { status: 401 },
      );
    const { items, totalAmount, paymentMethod, customerDetails } =
      await request.json();
    if (paymentMethod !== "cod")
      return NextResponse.json(
        {
          success: false,
          message:
            "Cash on Delivery is available. Please contact the shop on WhatsApp for eSewa.",
        },
        { status: 400 },
      );
    const name =
      typeof customerDetails?.name === "string"
        ? customerDetails.name.trim()
        : "";
    const phone =
      typeof customerDetails?.phone === "string"
        ? customerDetails.phone.trim()
        : "";
    const address =
      typeof customerDetails?.address === "string"
        ? customerDetails.address.trim()
        : "";
    const email =
      typeof customerDetails?.email === "string"
        ? customerDetails.email.trim()
        : "";
    if (
      !name ||
      name.length > 100 ||
      !/^[+0-9 ()-]{7,20}$/.test(phone) ||
      !address ||
      address.length > 500 ||
      (email &&
        (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    )
      return NextResponse.json(
        {
          success: false,
          message: "Please check your name, phone number and delivery address.",
        },
        { status: 400 },
      );
    let verified;
    try {
      verified = await validateDatabaseOrder(items);
    } catch (cause) {
      return NextResponse.json(
        {
          success: false,
          message:
            cause instanceof Error ? cause.message : "Please refresh your bag.",
        },
        { status: 400 },
      );
    }
    if (
      !Number.isFinite(totalAmount) ||
      Math.abs(totalAmount - verified.total) > 0.01
    )
      return NextResponse.json(
        {
          success: false,
          message:
            "A price has changed. Please refresh your bag before ordering.",
          expectedTotal: verified.total,
        },
        { status: 400 },
      );
    const location = customerDetails?.location;
    const validLocation =
      location &&
      Number.isFinite(location.lat) &&
      Number.isFinite(location.lng) &&
      Math.abs(location.lat) <= 90 &&
      Math.abs(location.lng) <= 180
        ? {
            lat: location.lat,
            lng: location.lng,
            formattedAddress:
              typeof location.formattedAddress === "string"
                ? location.formattedAddress.slice(0, 500)
                : undefined,
          }
        : undefined;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value || uuidv4();
    const order = await Order.create({
      userId: auth.userId,
      sessionId,
      items: verified.items,
      totalAmount: verified.total,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "pending",
      customerDetails: { name, phone, address, email, location: validLocation },
    });
    const response = NextResponse.json(
      {
        success: true,
        order: {
          _id: order._id,
          totalAmount: order.totalAmount,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
        },
      },
      { status: 201 },
    );
    if (!cookieStore.get("cart_session_id")?.value)
      response.cookies.set("cart_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    return response;
  } catch (cause) {
    console.error("Order creation failed:", cause);
    return NextResponse.json(
      {
        success: false,
        message: "Your order could not be placed. Please try again.",
      },
      { status: 500 },
    );
  }
}
