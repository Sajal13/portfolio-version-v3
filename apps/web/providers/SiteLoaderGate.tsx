'use client';

import { useState } from 'react';
import TerminalLoader from 'components/layout/TerminalLoader';

export default function SiteLoaderGate({
  children
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <TerminalLoader onComplete={() => setLoading(false)} />}

      {/* Site content is mounted underneath the whole time (so images/data
          can start fetching during the loader), just hidden until it's done. */}
      <div
        style={{
          visibility: loading ? 'hidden' : 'visible',
          opacity: loading ? 0 : 1
        }}
        className="transition-opacity duration-500"
      >
        {children}
      </div>
    </>
  );
}
