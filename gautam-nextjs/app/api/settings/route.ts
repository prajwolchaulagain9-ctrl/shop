import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import SiteSettings from '@/lib/models/SiteSettings';

// Public: Get a specific setting by key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    await dbConnect();

    if (key) {
      const setting = await SiteSettings.findOne({ key });
      return NextResponse.json({ success: true, value: setting?.value || null });
    }

    // Return all settings
    const settings = await SiteSettings.find({});
    const map: Record<string, string> = {};
    settings.forEach((s) => (map[s.key] = s.value));
    return NextResponse.json({ success: true, settings: map });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
