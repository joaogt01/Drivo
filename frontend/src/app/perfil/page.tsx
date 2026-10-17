'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell, { Field } from '../components/Shell';
import Button from '../components/ui/button';
import styles from './page.module.css';
import {
  changePassword,
  currentUser,
  getUser,
  logout,
  User,
} from '../../lib/api';

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const saved = getUser();

    if (!localStorage.getItem('drivo-access-token')) {
      router.replace('/login');
      return;
    }

    if (saved) setUser(saved);

    currentUser()
      .then((data) => {
        setUser(
          (previous) => ({ ...previous, ...data } as User)
        );
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar o perfil.'
        );
      });
  }, [router]);

  function signOut() {
    logout();
    router.replace('/login');
  }

  async function handleChangePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação da nova senha não corresponde.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('A nova senha deve ser diferente da atual.');
      return;
    }

    setChangingPassword(true);

    try {
      const result = await changePassword(currentPassword, newPassword);

      setPasswordMessage(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : 'Não foi possível alterar a senha.',
      );
    } finally {
      setChangingPassword(false);
    }
  }

  const initial = (user?.email || 'D')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Shell>
      <main className={`${styles.pageContent} ${styles.profilePage}`}>
        <div className={styles.profileIdentity}>
          <div className={styles.avatarLarge}>{initial}</div>

          <div>
            <h1>Minha conta</h1>
            <p>{user?.email || 'Carregando conta...'}</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}

        <section className={styles.profileRow}>
          <div className={styles.profileCopy}>
            <h2>Dados da conta</h2>
            <p>
              Informações disponibilizadas pelo endpoint
              de autenticação do backend.
            </p>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileFormGrid}>
              <Field
                label="ID do usuário"
                value={user?.id || ''}
                readOnly
              />

              <Field
                label="E-mail"
                value={user?.email || ''}
                readOnly
              />
            </div>

            <div className={styles.profileCardFooter}>
              <small>
                O backend atual não disponibiliza edição de
                nome, e-mail ou senha.
              </small>
            </div>
          </div>
        </section>

        <section className={styles.profileRow}>
          <div className={styles.profileCopy}>
            <h2>Segurança</h2>
            <p>
              Mantenha sua conta protegida atualizando sua senha.
            </p>
          </div>

          <div className={styles.profileCard}>
            <form
              className={styles.authForm}
              onSubmit={handleChangePassword}
            >
              <Field
                label="Senha atual"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
              />

              <Field
                label="Nova senha"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                minLength={8}
                required
              />

              <Field
                label="Confirmar nova senha"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={8}
                required
              />

              {passwordError && (
                <p role="alert" className="notice">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p role="status" className="notice">
                  {passwordMessage}
                </p>
              )}

              <div className={styles.profileCardFooter}>
                <small>
                  A nova senha deve ter pelo menos 8 caracteres.
                </small>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={changingPassword}
              >
                {changingPassword
                  ? 'Alterando senha...'
                  : 'Alterar senha'}
              </Button>
            </form>
          </div>
        </section>

        <section className={styles.profileRow}>
          <div className={styles.profileCopy}>
            <h2>Sessão</h2>
            <p>Encerre sua sessão neste dispositivo.</p>
          </div>

          <div className={`${styles.profileCard} ${styles.signoutRow}`}>
            <div>
              <b>Sair da conta</b>
              <p>
                O token de acesso será removido deste navegador.
              </p>
            </div>

            <button className="text-action" onClick={signOut}>
              Sair
            </button>
          </div>
        </section>
      </main>
    </Shell>
  );
}