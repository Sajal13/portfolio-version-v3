import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@repo/ui/providers';
import SidebarServer from 'components/common/navbar/Sidebar.server';
import Topbar from 'components/common/navbar/Topbar';
import { AuthProvider } from 'context/AuthContext';
import { verifySession, decodeSessionUnsafe } from 'lib/session';

const API_URL = process.env.API_URL!;

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let valid = false;
  if (accessToken) {
    try {
      await verifySession(accessToken);
      valid = true;
    } catch {
      valid = false;
    }
  }

  if (!valid && refreshToken) {
    const csrfToken = cookieStore.get('csrfToken')?.value;
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        cookie: `refreshToken=${refreshToken}; csrfToken=${csrfToken ?? ''}`,
        'x-csrf-token': csrfToken ?? ''
      },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    if (refreshRes?.ok) {
      redirect('/api/auth/bootstrap-refresh');
    }

    redirect('/login');
  }

  if (!valid && !refreshToken) {
    redirect('/login');
  }

  const session = accessToken ? decodeSessionUnsafe(accessToken) : null;

  return (
    <AuthProvider initialSession={session}>
      <SidebarProvider>
        <SidebarServer />
        <div className="flex min-h-svh flex-1 flex-col">
          <Topbar />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
