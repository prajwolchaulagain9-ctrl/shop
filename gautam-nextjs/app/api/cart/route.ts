import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/models/Cart';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch cart
export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: true, cart: { items: [] } },
        { status: 200 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: true, cart: { items: [] } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, cart },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add item to cart
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { productId, name, price, image, quantity = 1 } = await req.json();

    if (!productId || !name || !price || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;

    // Create session ID if it doesn't exist
    if (!sessionId) {
      sessionId = uuidv4();
    }

    let cart = await Cart.findOne({ sessionId });

    if (!cart) {
      cart = new Cart({
        sessionId,
        items: [],
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        price,
        image,
        quantity,
      });
    }

    await cart.save();

    const response = NextResponse.json(
      { success: true, cart, message: 'Item added to cart' },
      { status: 200 }
    );

    // Set session cookie if new
    if (!cookieStore.get('cart_session_id')?.value) {
      response.cookies.set('cart_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error: unknown) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}
