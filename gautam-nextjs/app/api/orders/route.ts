import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/middleware/auth";
import Order from "@/lib/models/Order";
import { pageParams } from "@/lib/catalog/query";
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth) return unauthorizedResponse();
  const { page, limit } = pageParams(request, 10);
  const filter = { userId: auth.userId };
  const [orders, totalCount] = await Promise.all([
    Order.find(filter)
      .select("totalAmount paymentMethod paymentStatus orderStatus createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);
  return NextResponse.json(
    {
      success: true,
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
