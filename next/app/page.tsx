import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <section>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            RorkParity
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Chat-first AI game builder with real native export, credits, auth,
            and deployment built in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/workspace"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Open workspace
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View pricing
            </Link>
            <Link
              href="/gallery"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Browse templates
            </Link>
          </div>
        </section>

        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Auth: email/OAuth, Supabase-backed</li>
            <li>• Builder: chat, uploads, generation, preview</li>
            <li>• Billing: Stripe checkout + webhooks</li>
            <li>• Export: web + native mobile scaffold</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
