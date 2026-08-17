'use client';

import { useState } from 'react';
import {
  LuRotateCw,
  LuLayoutDashboard,
  LuChevronDown,
  LuTriangleAlert
} from '@repo/icons/lu';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen w-full bg-[#0a0c10] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-[#f5a623]/20 bg-[#0f1218] overflow-hidden">
          {/* Header */}
          <div className="flex items-start gap-4 px-8 pt-8 pb-6">
            <div className="shrink-0 rounded-lg bg-[#f5a623]/10 p-2.5">
              <LuTriangleAlert size={20} className="text-[#f5a623]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">
                Something went wrong
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                An unexpected error stopped this page from loading. It's been
                recorded — retrying usually resolves it.
              </p>
            </div>
          </div>

          {/* Digest / reference */}
          {error.digest && (
            <div className="mx-8 mb-6 rounded-lg border border-white/10 bg-white/2 px-4 py-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-white/30">reference</span>
                <span className="text-white/50">{error.digest}</span>
              </div>
            </div>
          )}

          {/* Dev-only stack trace */}
          {isDev && (
            <div className="mx-8 mb-6">
              <button
                onClick={() => setShowDetails((v) => !v)}
                className="flex w-full items-center justify-between text-xs font-medium text-white/40 hover:text-white/60 transition-colors"
              >
                <span>Technical details (dev only)</span>
                <LuChevronDown
                  size={14}
                  className={`transition-transform ${showDetails ? 'rotate-180' : ''}`}
                />
              </button>
              {showDetails && (
                <pre className="mt-3 max-h-48 overflow-auto rounded-lg border border-white/10 bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-white/50 whitespace-pre-wrap">
                  {error.stack ?? error.message}
                </pre>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 border-t border-white/10 bg-white/2 px-8 py-5">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#f5a623] px-4 py-2.5 text-sm font-semibold text-[#0a0c10] hover:bg-[#e39816] transition-colors"
            >
              <LuRotateCw size={15} />
              Try again
            </button>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LuLayoutDashboard size={15} />
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
