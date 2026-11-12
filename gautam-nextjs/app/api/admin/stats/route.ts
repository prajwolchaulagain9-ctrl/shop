import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import { requireAdmin, forbiddenResponse } from "@/lib/middleware/auth";
export async function GET(request: NextRequest) {
  try {
    if (!(await requireAdmin(request))) return forbiddenResponse();
    const now = new Date(),
      month = new Date(now.getFullYear(), now.getMonth(), 1),
      since = new Date(now.getTime() - 30 * 86400000);
    const [summary, totalUsers, verifiedUsers] = await Promise.all([
      Order.aggregate([
        {
          $facet: {
            totals: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalRevenue: {
                    $sum: {
                      $cond: [
                        { $ne: ["$orderStatus", "cancelled"] },
                        "$totalAmount",
                        0,
                      ],
                    },
                  },
                  monthlyRevenue: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $ne: ["$orderStatus", "cancelled"] },
                            { $gte: ["$createdAt", month] },
                          ],
                        },
                        "$totalAmount",
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            statuses: [{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }],
            paymentMethods: [
              {
                $group: {
                  _id: "$paymentMethod",
                  count: { $sum: 1 },
                  revenue: { $sum: "$totalAmount" },
                },
              },
            ],
            dailyRevenue: [
              {
                $match: {
                  createdAt: { $gte: since },
                  orderStatus: { $ne: "cancelled" },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                  },
                  revenue: { $sum: "$totalAmount" },
                  orders: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ]),
      User.countDocuments({}),
      User.countDocuments({ isEmailVerified: true }),
    ]);
    const result = summary[0],
      totals = result.totals[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
      };
    const ordersByStatus = Object.fromEntries(
      ["pending", "processing", "shipped", "delivered", "cancelled"].map(
        (s) => [
          s,
          result.statuses.find(
            (r: { _id: string; count: number }) => r._id === s,
          )?.count || 0,
        ],
      ),
    );
    return NextResponse.json(
      {
        ...totals,
        totalUsers,
        verifiedUsers,
        ordersByStatus,
        paymentMethods: result.paymentMethods,
        dailyRevenue: result.dailyRevenue,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (cause) {
    console.error("Statistics failed:", cause);
    return NextResponse.json(
      { message: "Statistics could not load. Please try again." },
      { status: 500 },
    );
  }
}
