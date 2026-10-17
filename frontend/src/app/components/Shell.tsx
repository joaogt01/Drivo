'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  currentUser,
  getToken,
  getUser,
  logout,
  type User,
} from '../../lib/api';

export { default as Field } from './ui/field';
export { default as SelectField } from './ui/selectField';

export function Brand() {
  return (
    <Link href="/veiculos" className="app-brand">
      <img
        src="/car-icon.svg"
        alt=""
        aria-hidden="true"
      />
      <b>Drivo</b>
    </Link>
  );
}

export default function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!getToken()) {
        logout();
        router.replace('/login');
        return;
      }

      try {
        const authenticatedUser = await currentUser();

        if (!active) return;

        const storedUser = getUser();

        setUser({
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          name: storedUser?.name || authenticatedUser.email,
          createdAt: storedUser?.createdAt,
        });

        setCheckingAuth(false);
      } catch {
        if (!active) return;

        logout();
        router.replace('/login');
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  const initials = (user?.name || user?.email || 'D')
    .split(/[ @]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  if (checkingAuth) {
    return (
      <div className="app-shell" aria-live="polite">
        <main className="page-content">
          Verificando sua sessão...
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />

        <nav className="app-tabs">
          <Link
            className={
              path.startsWith('/veiculos') ? 'active' : ''
            }
            href="/veiculos"
          >
            Meus veículos
          </Link>

          <Link
            className={path === '/perfil' ? 'active' : ''}
            href="/perfil"
          >
            Perfil
          </Link>
        </nav>

        <button
          type="button"
          className="user-chip"
          onClick={() => router.push('/perfil')}
          aria-label={`Abrir perfil de ${user?.name || user?.email || 'Minha conta'}`}
        >
          <span>
            {user?.name || user?.email || 'Minha conta'}
          </span>
          <b>{initials}</b>
        </button>
      </header>

      {children}
    </div>
  );
}