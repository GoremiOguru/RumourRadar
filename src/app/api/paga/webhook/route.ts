import { NextRequest, NextResponse } from 'next/server';
import { verifyPagaWebhookSignature } from '@/lib/paga';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('pagaHash') || req.headers.get('x-paga-signature') || '';

    // Verify webhook signature if present
    if (signature && !verifyPagaWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid Paga webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody || '{}');
    const eventType = event.eventType || event.event || 'PAYMENT_COMPLETED';
    const reference = event.reference || event.transactionReference || event.accountReference;
    const amount = event.amount || 0;

    // Log & process
    console.log(`[Paga Webhook] Received ${eventType} for ref: ${reference}, amount: ₦${amount}`);

    return NextResponse.json({
      received: true,
      status: 'PROCESSED',
      reference,
      eventType,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 400 });
  }
}
