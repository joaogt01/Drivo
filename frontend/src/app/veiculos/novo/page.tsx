
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Shell, { Field, SelectField } from '../../components/Shell';
import Button from '../../components/ui/button';
import styles from './page.module.css';
import {
  vehiclesApi,
  extractCrlv,
  getToken,
  type VehiclePayload,
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

const initial: FormState = {
  brand: '',
  model: '',
  plate: '',
  renavam: '',
  chassis: '',
  year: '',
  modelYear: '',
  color: '',
  fuel: 'Flex',
  vehicleType: 'Automóvel',
  nickname: '',
};

export default function NewVehiclePage() {
  const router = useRouter();

  const [form, setForm] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [crlvImported, setCrlvImported] = useState(false);

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function importCrlv() {
    if (!file) {
      setError('Selecione um arquivo CRLV primeiro.');
      return;
    }

    if (!getToken()) {
      router.push('/login');
      return;
    }

    setError('');
    setCrlvImported(false);
    setExtracting(true);

    try {
      const data = await extractCrlv(file);

      setForm((previous) => ({
        ...previous,
        ...Object.fromEntries(
          Object.entries(data)
            .filter(([, value]) => value !== null && value !== '')
            .map(([key, value]) => [key, String(value)]),
        ),
      } as FormState));

      setCrlvImported(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível ler o CRLV.',
      );
    } finally {
      setExtracting(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!getToken()) {
      router.push('/login');
      return;
    }

    const payload: VehiclePayload = {
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

    setBusy(true);

    try {
      await vehiclesApi.create(payload);
      router.push('/veiculos');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível salvar o veículo.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <main className={`${styles.pageContent} ${styles.formPage}`}>
        <Link href="/veiculos" className={styles.backLink}>
          Voltar
        </Link>

        <h1>Novo veículo</h1>

        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}

        <form
          onSubmit={submit}
          className={styles.vehicleFormLayout}
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
                  placeholder="ABC1D23"
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
                  placeholder="Ex.: Carro da família"
                />
              </div>
            </section>
          </div>

          <aside className={styles.formAside}>
            <section
             className={`${styles.formPanel} ${styles.uploadPanel}`}
            >
              <div className={styles.uploadHeading}>
                <span
                  className={styles.uploadIcon}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
                  </svg>
                </span>

                <div>
                  <b>Importar CRLV</b>
                  <p>
                    Extraia os dados do documento para
                    preencher o formulário.
                  </p>
                </div>
              </div>

              <label
                className={`${styles.uploadDrop} ${
                  file ? styles.uploadDropSelected : ''
                }`}
              >
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

                <span className={styles.uploadFileInfo}>
                  <span className={styles.uploadFileName}>
                    {crlvImported
                      ? 'CRLV importado com sucesso'
                      : file?.name || 'Nenhum arquivo selecionado'}
                  </span>

                  <small>
                    {crlvImported
                      ? `${file?.name} · ${
                          file ? (file.size / 1024).toFixed(0) : 0
                        } KB`
                      : file
                        ? `${(file.size / 1024).toFixed(0)} KB · arquivo selecionado`
                        : 'PDF, JPG, PNG ou WebP · até 10 MB'}
                  </small>
                </span>

                {file && (
                  <span
                    className={styles.uploadFileCheck}
                    aria-label={
                      crlvImported
                        ? 'CRLV importado com sucesso'
                        : 'Arquivo selecionado'
                    }
                  >
                    ✓
                  </span>
                )}

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    setCrlvImported(false);
                    setError('');
                  }}
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
                  : file
                    ? crlvImported
                      ? 'Importar outro CRLV'
                      : 'Importar CRLV'
                    : 'Importar CRLV'}
              </Button>
            </section>
          </aside>

          <div className={styles.formBottom}>
            <span>
              Novo veículo · {form.brand} {form.model}
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
                {busy ? 'Salvando...' : 'Salvar veículo'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </Shell>
  );
}
