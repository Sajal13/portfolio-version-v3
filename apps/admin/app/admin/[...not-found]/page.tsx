import Link from 'next/link';
import { LuLayoutDashboard, LuBan } from '@repo/icons/lu';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Route trace visual */}
        <div className="flex items-center justify-center gap-2 mb-8 font-mono text-xs">
          <span className="rounded bg-white/4 border border-white/10 px-2 py-1 text-white/40">
            /admin
          </span>
          <span className="text-white/20">/</span>
          <span className="rounded bg-white/4 border border-white/10 px-2 py-1 text-white/40">
            ...
          </span>
          <span className="text-white/20">/</span>
          <span className="flex items-center gap-1.5 rounded bg-warning-subtle border border-warning-300/30 px-2 py-1 text-warning-500">
            <LuBan size={11} />
            unresolved
          </span>
        </div>

        <h1 className="text-xl font-semibold text-white">
          This route doesn&apos;t exist
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/50">
          Nothing in the admin panel resolves to this path. It may have been
          renamed, moved, or never built.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 transition-colors"
          >
            <LuLayoutDashboard size={15} />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/*
Note: not-found.tsx is a Server Component with no props from Next.js, so it
can't read the attempted pathname directly. If you want the real broken path
shown in the trace (instead of the generic "unresolved" placeholder), read it
from headers() in middleware and forward it as a search param, or make this
a small client component that reads usePathname() before falling back to
notFound(). Happy to wire that up if you want the exact path displayed.
*/
