import Link from 'next/link';
import { CircleIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-background text-foreground">
      <div className="max-w-md space-y-8 p-4 text-center">
        <div className="flex justify-center">
          <CircleIcon className="size-12 text-primary" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-base text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="mx-auto flex max-w-48 justify-center rounded-full border border-white/[0.08] bg-black/60 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
