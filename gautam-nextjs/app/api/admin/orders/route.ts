import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Order from "@/lib/models/Order";
import { requireAdmin, forbiddenResponse } from "@/lib/middleware/auth";
import { pageParams } from "@/lib/catalog/query";
const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return forbiddenResponse();
    const { params, page, limit } = pageParams(request, 10);
    const status = params.get("status");
    const filter =
      status && orderStatuses.includes(status) ? { orderStatus: status } : {};
    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .select("-items.image")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);
    return NextResponse.json(
      {
        orders,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (cause) {
    console.error("Orders fetch failed:", cause);
    return NextResponse.json(
      { message: "Orders could not load. Please try again." },
      { status: 500 },
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return forbiddenResponse();
    const { orderId, orderStatus, paymentStatus } = await request.json();
    if (
      typeof orderId !== "string" ||
      !mongoose.isValidObjectId(orderId) ||
      (!orderStatus && !paymentStatus) ||
      (orderStatus && !orderStatuses.includes(orderStatus)) ||
      (paymentStatus &&
        !["pending", "verified", "failed"].includes(paymentStatus))
    )
      return NextResponse.json(
        { message: "Please choose a valid order status." },
        { status: 400 },
      );
    const update = {
      ...(orderStatus ? { orderStatus } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    };
    const order = await Order.findByIdAndUpdate(orderId, update, {
      new: true,
      runValidators: true,
    })
      .select("-items.image")
      .lean();
    if (!order)
      return NextResponse.json(
        { message: "Order not found." },
        { status: 404 },
      );
    return NextResponse.json(order, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (cause) {
    console.error("Order update failed:", cause);
    return NextResponse.json(
      { message: "The order could not be updated." },
      { status: 500 },
    );
  }
}
