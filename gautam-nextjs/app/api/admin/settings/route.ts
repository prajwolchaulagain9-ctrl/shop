import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SiteSettings from '@/lib/models/SiteSettings';
import { requireAdmin, forbiddenResponse } from '@/lib/middleware/auth';

// Admin only: Update a setting
export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin(request);
    if (!admin) return forbiddenResponse();

    await dbConnect();

    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { success: false, message: 'Key and value are required' },
        { status: 400 }
      );
    }

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
