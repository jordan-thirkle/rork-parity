'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { withTeam } from '@/lib/auth/middleware';

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ team: team, priceId });
});

export const createCheckoutAction = withTeam(async (formData) => {
  const priceId = formData.get('priceId') as string;
  if (!priceId) {
    throw new Error('price_id_required');
  }

  const h = await headers();
  const proto = h.get('x-forwarded-proto') || 'http';
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:4000';
  const baseUrl = process.env.BASE_URL || `${proto}://${host}`;

  const res = await fetch(`${baseUrl}/api/checkout`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ priceId })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error || 'checkout_failed');
  }

  redirect(data.url);
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});
