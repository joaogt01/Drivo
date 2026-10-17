'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '../../lib/api';
import styles from './page.module.css';
import { Field } from '../components/Shell';
import CarIcon from '../components/CarIcon';
import Button from '../components/ui/button';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      router.push('/veiculos');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível criar a conta.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.authPage}>
      <section className={styles.authVisual}>
        <div className={styles.authVisualImage} />

        <div className={styles.authBrand}>DRIVO</div>

        <div className={styles.authSlogan}>
          <h1>
            Cadastre uma vez.
            <br />O CRLV faz o resto.
          </h1>

          <p>
            Importe o documento e os dados do veículo são preenchidos
            automaticamente.
          </p>
        </div>
      </section>

      <section className={styles.authPanel}>
        <div className={styles.authFormWrap}>
          <div className={styles.carMark}>
            <CarIcon />
          </div>

          <h2>Criar sua conta</h2>

          <p className={styles.authDescription}>
            Leva menos de um minuto. Depois é só adicionar seus veículos.
          </p>

          {error && (
            <p role="alert" className={styles.authError}>
              {error}
            </p>
          )}

          <form className={styles.authForm} onSubmit={submit}>
            <Field
              label="Nome completo"
              type="text"
              wrapperClassName={styles.field}
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={100}
              placeholder="Seu nome"
              autoComplete="name"
              required
            />

            <Field
              label="E-mail"
              type="email"
              wrapperClassName={styles.field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="voce@email.com"
              autoComplete="email"
              required
            />

            <Field
              label="Senha"
              type="password"
              wrapperClassName={styles.field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={72}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              required
            />

            <Field
              label="Confirmar senha"
              type="password"
              wrapperClassName={styles.field}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
              required
            />

            <Button
              className={styles.submitButton}
              disabled={loading}
              type="submit"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <p className={styles.authSwitch}>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </section>
    </main>
  );
}