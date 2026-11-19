import { NextRequest, NextResponse } from 'next/server';
import { createPagaDynamicVirtualAccount, verifyPagaVirtualAccountPayment } from '@/lib/paga';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, orgName, customerEmail } = body;

    if (!orgName || typeof orgName !== 'string') {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const selectedTier = tier === 'enterprise_shield' ? 'enterprise_shield' : 'newsroom_pro';
    const virtualAccount = await createPagaDynamicVirtualAccount(selectedTier, orgName.trim(), customerEmail);

    return NextResponse.json({
      success: true,
      virtualAccount,
      message: `Dedicated Paga dynamic NUBAN account successfully provisioned for ${orgName}.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create virtual account' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
  }

  try {
    const result = await verifyPagaVirtualAccountPayment(reference);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to verify account payment' }, { status: 500 });
  }
}
