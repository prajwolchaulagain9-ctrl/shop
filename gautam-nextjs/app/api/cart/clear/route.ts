import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Cart from '@/lib/models/Cart';
import { cookies } from 'next/headers';

// DELETE - Clear entire cart
export async function DELETE() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('cart_session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: true, message: 'Cart already empty' },
        { status: 200 }
      );
    }

    const cart = await Cart.findOne({ sessionId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return NextResponse.json(
      { success: true, message: 'Cart cleared' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
