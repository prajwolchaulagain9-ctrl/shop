import { NextRequest } from "next/server";

export const categories = ["slippers", "clothing", "collections"];
export function pageParams(request: Request | NextRequest, defaultLimit = 24) {
  const params = new URL(request.url).searchParams;
  const bounded = (value: string | null, fallback: number, max: number) => {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? Math.min(n, max) : fallback;
  };
  return {
    params,
    page: bounded(params.get("page"), 1, 10000),
    limit: bounded(params.get("limit"), defaultLimit, 48),
  };
}
export function catalogProjection() {
  return {
    name: 1,
    price: 1,
    description: 1,
    category: 1,
    subCategory: 1,
    isAvailable: 1,
    createdAt: 1,
    image: {
      $cond: [
        {
          $regexMatch: { input: { $ifNull: ["$image", ""] }, regex: "^data:" },
        },
        { $concat: ["/api/media/product/", { $toString: "$_id" }] },
        "$image",
      ],
    },
  };
}
