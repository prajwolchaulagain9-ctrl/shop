import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/models/Cart';
import { cookies } from 'next/headers';

// PUT - Update item quantity
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { productId, quantity } = await req.json();

    if (!productId || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return NextResponse.json(
      { success: true, cart, message: 'Cart updated' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
