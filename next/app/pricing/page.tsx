import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createCheckoutAction } from '@/lib/payments/actions';

// Price IDs come from env when configured. Placeholder strings are used
// otherwise so the UI is fully wired without inventing real Stripe keys.
const plans = [
  {
    name: 'Free',
    price: '$0',
    priceId: '',
    features: ['Free trial of Rork Max', 'Web apps', 'Public projects'],
    highlighted: false,
  },
  {
    name: 'Rork Pro',
    price: '$20',
    priceId: process.env.STRIPE_PRICE_PRO || 'price_rork_pro',
    features: ['Native iOS & Android export', 'Private projects', 'Priority builds'],
    highlighted: true,
  },
  {
    name: 'Rork Max',
    price: '$50',
    priceId: process.env.STRIPE_PRICE_MAX || 'price_rork_max',
    features: ['Everything in Pro', 'Faster builds', 'Advanced multiplayer/physics templates'],
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight">Choose your Rork</h1>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you need native export and faster iteration.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                'relative flex flex-col rounded-2xl border bg-black/40 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg ' +
                (plan.highlighted
                  ? 'border-transparent ring-1 ring-[#f97316]'
                  : 'border-white/[0.08]')
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-[#f97316] px-3 py-1 text-xs font-semibold text-black">
                  Most popular
                </span>
              )}
              <div className="text-sm font-medium text-muted-foreground">{plan.name}</div>
              <div className="mt-2 text-3xl font-semibold text-foreground">{plan.price}</div>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              {plan.name === 'Free' ? (
                <Button variant="outline" className="mt-6 w-full rounded-full" asChild>
                  <Link href="/sign-up">Start free</Link>
                </Button>
              ) : (
                <form action={createCheckoutAction} className="mt-6">
                  <input type="hidden" name="priceId" value={plan.priceId} />
                  <Button
                    type="submit"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    className="w-full rounded-full"
                  >
                    Upgrade
                  </Button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
