import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DocsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Documentation</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            Learn how to create your first game project and preview it live.
          </p>
          <Link
            href="/workspace"
            className="text-blue-600 hover:text-blue-700"
          >
            Open workspace →
          </Link>
        </section>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Workspace</h2>
          <p className="text-gray-600 mb-4">
            Chat-first builder workflow, file uploads, and preview controls.
          </p>
          <Link
            href="/workspace"
            className="text-blue-600 hover:text-blue-700"
          >
            Open workspace →
          </Link>
        </section>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Templates</h2>
          <p className="text-gray-600 mb-4">
            Brawler, 3D world, shooter, idle RPG, and native mobile exports.
          </p>
          <Link
            href="/gallery"
            className="text-blue-600 hover:text-blue-700"
          >
            Browse templates →
          </Link>
        </section>
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Publishing</h2>
          <p className="text-gray-600 mb-4">
            Export to web, iOS, Android, or desktop. App Store flow included.
          </p>
          <Link
            href="/pricing"
            className="text-blue-600 hover:text-blue-700"
          >
            View plans →
          </Link>
        </section>
      </div>
    </main>
  );
}
