'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../lib/api';
import styles from './page.module.css';
import { Field } from '../components/Shell';
import CarIcon from '../components/CarIcon';
import Button from '../components/ui/button';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.replace('/veiculos');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível entrar. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop"
            alt="Carro Esportivo"
          />
          <div className={styles.heroOverlay} />
        </div>

        <div className={styles.heroBrand}>Drivo</div>

        <div className={styles.heroCopy}>
          <h1>Sua garagem, sempre à mão.</h1>
          <p>
            Placa, Renavam e licenciamento de todos os seus veículos em um só
            lugar.
          </p>
        </div>
      </section>

      <section className={styles.loginSection}>
        <div className={styles.loginContainer}>
          <div className={styles.carIcon}>
            <CarIcon />
          </div>

          <h2 className={styles.loginTitle}>Entrar no Drivo</h2>

          <p className={styles.loginDescription}>
            Seus veículos, documentos e dados em um só lugar.
          </p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formField}>
              <Field
                label="E-mail"
                name="email"
                id="email"
                type="email"
                wrapperClassName={styles.formField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.formField}>
              <Field
                label="Senha"
                name="password"
                id="password"
                type="password"
                wrapperClassName={styles.formField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {error && (
            <p role="alert" className={styles.loginError}>
              {error}
            </p>
          )}

          <div className={styles.signupPrompt}>
            Ainda não tem conta?{' '}
            <Link href="/cadastro">Criar conta</Link>
          </div>
        </div>
      </section>
    </main>
  );
}