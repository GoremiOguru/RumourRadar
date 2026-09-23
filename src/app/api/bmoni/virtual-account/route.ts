import { NextRequest, NextResponse } from 'next/server';
import { createBmoniVirtualAccount } from '@/lib/bmoni';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tier, orgName } = body;

    if (!orgName || typeof orgName !== 'string') {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const selectedTier = tier === 'enterprise_shield' ? 'enterprise_shield' : 'newsroom_pro';
    const virtualAccount = await createBmoniVirtualAccount(selectedTier, orgName);

    return NextResponse.json({
      success: true,
      virtualAccount,
      message: `Dedicated BMONI NGN virtual account successfully created for ${orgName}.`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create virtual account' }, { status: 500 });
  }
}
