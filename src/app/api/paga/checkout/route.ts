import { NextRequest, NextResponse } from 'next/server';
import { createPagaCheckoutSession, verifyPagaCheckoutPayment } from '@/lib/paga';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, orgName, customerEmail, redirectUrl } = body;

    if (!orgName || typeof orgName !== 'string') {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const selectedTier = tier === 'enterprise_shield' ? 'enterprise_shield' : 'newsroom_pro';
    const email = customerEmail || `billing@${orgName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    const checkoutSession = await createPagaCheckoutSession(
      selectedTier,
      orgName.trim(),
      email,
      redirectUrl
    );

    return NextResponse.json({
      success: true,
      checkoutSession,
      message: 'Paga Checkout session initialized successfully.'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to initialize checkout session' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
  }

  try {
    const verification = await verifyPagaCheckoutPayment(reference);
    return NextResponse.json(verification);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to verify checkout payment' }, { status: 500 });
  }
}
