import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Degrade gracefully without crashing the build or the page when Stripe
  // keys are not configured.
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'stripe_not_configured' },
      { status: 500 }
    );
  }

  let priceId: string | undefined;
  let redirect: string | undefined;
  try {
    const body = await request.json();
    priceId = body?.priceId;
    redirect = body?.redirect;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!priceId) {
    return NextResponse.json({ error: 'price_id_required' }, { status: 400 });
  }

  // Lazily import the existing Stripe client so a missing key cannot crash
  // module evaluation at build/load time.
  const { stripe } = await import('@/lib/payments/stripe');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/${redirect ?? 'pricing'}`,
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: 14 }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Failed to create Stripe checkout session:', error);
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
  }
}
