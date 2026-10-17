'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Shell, { Field, SelectField } from '../../components/Shell';
import Button from '../../components/ui/button';
import styles from './page.module.css';
import {
  vehiclesApi,
  type Vehicle,
  type VehiclePayload,
  getToken,
  extractCrlv,
} from '../../../lib/api';

type FormState = {
  brand: string;
  model: string;
  plate: string;
  renavam: string;
  chassis: string;
  year: string;
  modelYear: string;
  color: string;
  fuel: string;
  vehicleType: string;
  nickname: string;
};

function toForm(vehicle: Vehicle): FormState {
  return {
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    plate: vehicle.plate || '',
    renavam: vehicle.renavam || '',
    chassis: vehicle.chassis || '',
    year: String(vehicle.year ?? ''),
    modelYear: vehicle.modelYear
      ? String(vehicle.modelYear)
      : '',
    color: vehicle.color || '',
    fuel: vehicle.fuel || 'Flex',
    vehicleType: vehicle.vehicleType || 'Automóvel',
    nickname: vehicle.nickname || '',
  };
}

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }

    vehiclesApi
      .get(params.id)
      .then((data) => {
        setVehicle(data);
        setForm(toForm(data));
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível carregar o veículo.',
        );
      });
  }, [params.id, router]);

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    if (!form) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function payload(): Partial<VehiclePayload> {
    if (!form) return {};

    return {
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      modelYear: form.modelYear
        ? Number(form.modelYear)
        : undefined,
      plate: form.plate || undefined,
      renavam: form.renavam || undefined,
      chassis: form.chassis || undefined,
      color: form.color || undefined,
      fuel: form.fuel || undefined,
      vehicleType: form.vehicleType || undefined,
      nickname: form.nickname || undefined,
    };
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;

    setError('');
    setBusy(true);

    try {
      await vehiclesApi.update(params.id, payload());
      router.push('/veiculos');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível atualizar.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setError('');

    try {
      await vehiclesApi.remove(params.id);
      router.push('/veiculos');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir.',
      );
      setConfirmDelete(false);
    }
  }

  async function importCrlv() {
    if (!file) return;

    setError('');
    setExtracting(true);

    try {
      const data = await extractCrlv(file);

      if (form) {
        setForm({
          ...form,
          ...Object.fromEntries(
            Object.entries(data)
              .filter(([, value]) => value !== null && value !== '')
              .map(([key, value]) => [key, String(value)]),
          ),
        } as FormState);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha ao ler CRLV.',
      );
    } finally {
      setExtracting(false);
    }
  }

  if (!form) {
    return (
      <Shell>
        <main className={styles.pageContent}>
          <Link href="/veiculos" className="back-link">
            Voltar
          </Link>

          {error ? (
            <p role="alert" className="notice">
              {error}
            </p>
          ) : (
            <p>Carregando veículo…</p>
          )}
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className={`${styles.pageContent} ${styles.formPage}`}>
        <Link href="/veiculos" className="back-link">
          Voltar
        </Link>

        <h1>
          {form.brand} {form.model}
        </h1>

        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}

        <form
          onSubmit={submit}
          className={`${styles.vehicleFormLayout} ${styles.editLayout}`}
        >
          <div className={styles.formMain}>
            <section className={styles.formPanel}>
              <h2>Identificação</h2>
              <p>Dados oficiais do veículo, conforme o documento.</p>

              <div className={`${styles.formGrid} ${styles.two}`}>
                <Field
                  label="Placa"
                  name="plate"
                  value={form.plate}
                  onChange={update}
                />

                <Field
                  label="Renavam"
                  name="renavam"
                  value={form.renavam}
                  onChange={update}
                />

                <div className={styles.spanTwo}>
                  <Field
                    label="Chassi"
                    name="chassis"
                    value={form.chassis}
                    onChange={update}
                  />
                </div>
              </div>
            </section>

            <section className={styles.formPanel}>
              <h2>Características</h2>
              <p>Como o veículo aparece na sua garagem.</p>

              <div className={`${styles.formGrid} ${styles.two}`}>
                <Field
                  label="Marca"
                  name="brand"
                  value={form.brand}
                  onChange={update}
                  required
                />

                <Field
                  label="Modelo"
                  name="model"
                  value={form.model}
                  onChange={update}
                  required
                />

                <Field
                  label="Ano de fabricação"
                  name="year"
                  type="number"
                  value={form.year}
                  onChange={update}
                  required
                />

                <Field
                  label="Ano do modelo"
                  name="modelYear"
                  type="number"
                  value={form.modelYear}
                  onChange={update}
                />

                <Field
                  label="Cor"
                  name="color"
                  value={form.color}
                  onChange={update}
                />

                <SelectField
                  label="Combustível"
                  name="fuel"
                  value={form.fuel}
                  onChange={update}
                  options={[
                    'Flex',
                    'Gasolina',
                    'Diesel',
                    'Híbrido',
                    'Elétrico',
                  ]}
                />

                <SelectField
                  label="Tipo"
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={update}
                  options={[
                    'Automóvel',
                    'SUV',
                    'Picape',
                    'Motocicleta',
                    'Caminhão',
                  ]}
                />

                <Field
                  label="Apelido (opcional)"
                  name="nickname"
                  value={form.nickname}
                  onChange={update}
                />
              </div>
            </section>
          </div>

          <aside className={styles.formAside}>
            <section
              className={`${styles.formPanel} ${styles['side-summary']}`}
            >
              <div>
                <small>Cadastrado em</small>
                <b>
                  {vehicle?.createdAt
                    ? new Date(vehicle.createdAt).toLocaleDateString(
                        'pt-BR',
                      )
                    : '—'}
                </b>
              </div>

              <div>
                <small>Última alteração</small>
                <b>
                  {vehicle?.updatedAt
                    ? new Date(vehicle.updatedAt).toLocaleString(
                        'pt-BR',
                      )
                    : '—'}
                </b>
              </div>

              <label className={styles.uploadDrop}>
                <span
                  className={styles.uploadFileIcon}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF453A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2.75h8l4 4V21H6a2 2 0 0 1-2-2V4.75a2 2 0 0 1 2-2Z" />
                    <path d="M14 2.75v4h4" />
                    <path d="M8 13h8M8 16h8" />
                  </svg>
                </span>

                <span>
                  {file?.name || 'Selecionar novo CRLV'}
                  <small>
                    PDF, JPG, PNG ou WebP · até 10 MB
                  </small>
                </span>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] || null)
                  }
                />
              </label>

              <Button
                type="button"
                variant="secondary"
                fullWidth
                disabled={!file || extracting}
                onClick={importCrlv}
              >
                {extracting
                  ? 'Lendo documento...'
                  : 'Atualizar com novo CRLV'}
              </Button>

              <div className={styles.deleteBox}>
                <h3>Excluir veículo</h3>

                <p>
                  Remove o veículo e todos os seus dados
                  da sua garagem. Não é possível desfazer.
                </p>

                <Button
                  type="button"
                  variant="destructive"
                  fullWidth
                  onClick={() => setConfirmDelete(true)}
                >
                  Excluir veículo
                </Button>
              </div>
            </section>
          </aside>

          <div className={styles.formBottom}>
            <span>
              Editando · {form.model} · {form.plate}
            </span>

            <div>
              <Button
                variant="secondary"
                onClick={() => router.push('/veiculos')}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={busy}
              >
                {busy ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </div>
        </form>

        {confirmDelete && (
          <div
            className={styles.modalBackdrop}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
          >
            <div className={styles.confirmModal}>
              <div className={styles.warningIcon}>!</div>

              <h2 id="confirm-delete-title">
                Excluir {vehicle?.model}?
              </h2>

              <p>
                O veículo de placa {vehicle?.plate || '—'} e todos
                os seus dados serão removidos permanentemente.
              </p>

              <div>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancelar
                </Button>

                <Button
                  variant="destructive"
                  onClick={remove}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Shell>
  );
}
