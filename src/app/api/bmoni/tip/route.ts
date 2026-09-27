import { NextRequest, NextResponse } from 'next/server';
import { tipNewsroom } from '@/lib/bmoni';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newsroomSlug, amountNGN, donorName } = body;

    const amount = typeof amountNGN === 'number' && amountNGN > 0 ? amountNGN : 1000;
    const slug = newsroomSlug || 'premium-times';

    const result = await tipNewsroom(slug, amount, donorName);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process tip' }, { status: 500 });
  }
}
