import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/models/Cart';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// POST - Confirm and save cart to database
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items to confirm' },
        { status: 400 }
      );
    }

    // Validate all items have required fields
    for (const item of items) {
      if (!item.productId || !item.name || !item.price || !item.image || !item.quantity) {
        return NextResponse.json(
          { success: false, message: 'Invalid item data' },
          { status: 400 }
        );
      }
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get('cart_session_id')?.value;

    // Create session ID if it doesn't exist
    if (!sessionId) {
      sessionId = uuidv4();
    }

    // Save cart to database
    let cart = await Cart.findOne({ sessionId });

    if (cart) {
      // Update existing cart
      cart.items = items;
      cart.updatedAt = new Date();
    } else {
      // Create new cart
      cart = new Cart({
        sessionId,
        items,
      });
    }

    await cart.save();

    const response = NextResponse.json(
      { 
        success: true, 
        cart, 
        message: 'Cart confirmed and saved successfully',
        orderId: cart._id 
      },
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
    console.error('Error confirming cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to confirm cart' },
      { status: 500 }
    );
  }
}
