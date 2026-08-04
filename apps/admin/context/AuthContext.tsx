'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from 'api/base';

type Session = { email: string; role: 'user' | 'admin' } | null;

const AuthContext = createContext<{ session: Session; loading: boolean }>({
  session: null,
  loading: true
});

export function useAuth() {
  return useContext(AuthContext);
}

// Access tokens live 24h — refresh a bit early so an in-progress action
// never gets caught by an actual expiry.
const REFRESH_MARGIN_MS = 5 * 60 * 1000;
const ACCESS_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function AuthProvider({
  initialSession,
  children
}: {
  initialSession: Session;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session>(initialSession);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleRefresh = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await api.post('/api/auth/refresh');
        scheduleRefresh(); // success — schedule the next one
      } catch {
        // refresh token is dead too — session is genuinely over
        setSession(null);
        router.push('/login');
      }
    }, ACCESS_TOKEN_LIFETIME_MS - REFRESH_MARGIN_MS);
  };

  useEffect(() => {
    if (session) scheduleRefresh();
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
