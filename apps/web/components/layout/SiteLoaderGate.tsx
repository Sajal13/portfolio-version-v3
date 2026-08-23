'use client';

import { useState } from 'react';
import TerminalLoader from 'components/layout/TerminalLoader';
import { LoaderProvider } from 'providers/LoaderContext';

export default function SiteLoaderGate({
  children
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <LoaderProvider ready={!loading}>
      {loading && <TerminalLoader onComplete={() => setLoading(false)} />}

      <div
        style={{
          visibility: loading ? 'hidden' : 'visible',
          opacity: loading ? 0 : 1
        }}
        className="transition-opacity duration-500"
      >
        {children}
      </div>
    </LoaderProvider>
  );
}
