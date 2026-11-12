import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { parsePrice } from "@/lib/utils/currency";
import { IOrderItem } from "@/lib/models/Order";

export async function validateDatabaseOrder(input: unknown) {
  if (!Array.isArray(input) || !input.length || input.length > 50)
    throw new Error("Please choose between 1 and 50 products.");
  const quantities = new Map<string, number>();
  for (const row of input) {
    const id = row?.productId;
    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id) ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1 ||
      row.quantity > 99
    )
      throw new Error("An item is invalid. Please refresh your bag.");
    const quantity = (quantities.get(id) || 0) + row.quantity;
    if (quantity > 99) throw new Error("Please contact us for bulk orders.");
    quantities.set(id, quantity);
  }
  const products = await Product.find({
    _id: { $in: [...quantities.keys()] },
    isAvailable: true,
  })
    .select("name price image")
    .lean<
      {
        _id: mongoose.Types.ObjectId;
        name: string;
        price: string;
        image: string;
      }[]
    >();
  if (products.length !== quantities.size)
    throw new Error(
      "A piece in your bag is no longer available. Please refresh your bag.",
    );
  let total = 0;
  const items: IOrderItem[] = [];
  for (const product of products) {
    const id = product._id.toString();
    const quantity = quantities.get(id)!;
    const amount = parsePrice(product.price);
    if (!Number.isFinite(amount) || amount <= 0)
      throw new Error("Please contact us to confirm a product price.");
    total += amount * quantity;
    items.push({
      productId: id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }
  return { items, total };
}
