import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/models/Cart';
import { cookies } from 'next/headers';

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
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

    // Remove item from cart
    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    return NextResponse.json(
      { success: true, cart, message: 'Item removed from cart' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
