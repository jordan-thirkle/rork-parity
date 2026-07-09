import Image from 'next/image';

export const dynamic = 'force-dynamic';

const agents = [
  {
    role: 'FORGEMASTER',
    title: 'Scaffold & Architecture',
    description:
      'Owns project structure, routing, auth foundation, and build integrity. Ensures the product can actually ship.',
  },
  {
    role: 'SMITH',
    title: 'Generation & Runtime',
    description:
      'Owns game generation pipelines, preview fidelity, and runtime behavior. Makes things playable.',
  },
  {
    role: 'WHETSTONE',
    title: 'Quality & Performance',
    description:
      'Owns audits, benchmarks, UX polish, and regression prevention. Keeps output sharp.',
  },
  {
    role: 'LOREKEEPER',
    title: 'Docs & Continuity',
    description:
      'Owns documentation, roadmap fidelity, brand consistency, and cross-session memory.',
  },
  {
    role: 'CRIER',
    title: 'Release & Ops',
    description:
      'Owns packaging, verification, deployment, and publication gates. Nothing ships without explicit confirmation.',
  },
];

export default function TeamPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900">Team</h1>
        <p className="text-gray-600 mt-2">
          RorkParity is built by specialized agents. Each has a single responsibility;
          together they cover the full product lifecycle without hand-waving.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {agents.map((agent) => (
          <article
            key={agent.role}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-900">{agent.role}</h2>
            <p className="text-sm text-gray-500">{agent.title}</p>
            <p className="text-gray-700 mt-3">{agent.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
