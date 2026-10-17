'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Shell from '../components/Shell';
import styles from './page.module.css';
import VehicleCard from '../components/vehicles/VehicleCard';
import {
  vehiclesApi,
  Vehicle,
  getToken,
  logout,
} from '../../lib/api';

const photos = [
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1519641476-a6b2d8b0e3b8?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
];

export default function VehiclesPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    if (!getToken()) {
      router.replace('/login');
      return;
    }

    setLoading(true);

    try {
      setVehicles(await vehiclesApi.list());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Falha ao carregar veículos.'
      );

      if (!getToken()) {
        logout();
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      vehicles.filter((vehicle) =>
        `${vehicle.brand} ${vehicle.model} ${vehicle.plate || ''}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [vehicles, query]
  );

  async function remove(id: string) {
    if (
      !confirm(
        'Deseja excluir este veículo? Essa ação não pode ser desfeita.'
      )
    ) {
      return;
    }

    try {
      await vehiclesApi.remove(id);
      setVehicles((items) =>
        items.filter((vehicle) => vehicle.id !== id)
      );
      setError('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível excluir o veículo.'
      );
    }
  }

  return (
    <Shell>
      <main className={styles.pageContent}>
        <div className={styles.pageTitleRow}>
          <div>
            <h1>
              Meus veículos{' '}
              <Link
                href="/veiculos/novo"
                className={styles.roundAdd}
                aria-label="Adicionar veículo"
              >
                +
              </Link>
            </h1>

            <p>{vehicles.length} veículos cadastrados</p>
          </div>

          <input
            className={styles.searchInput}
            placeholder="Buscar por placa ou modelo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="notice">
            {error}
          </p>
        )}

        {loading ? (
          <p>Carregando veículos...</p>
        ) : filtered.length === 0 ? (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>＋</div>

            <h2>
              {query
                ? 'Nenhum veículo encontrado'
                : 'Sua garagem está vazia'}
            </h2>

            <p>
              {query
                ? 'Tente buscar por outra placa ou modelo.'
                : 'Adicione seu primeiro veículo. Importe o CRLV para preencher os dados automaticamente.'}
            </p>

            <Link className="button" href="/veiculos/novo">
              Adicionar veículo
            </Link>
          </section>
        ) : (
          <div className={styles.vehiclesGrid}>
            {filtered.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                image={photos[index % photos.length]}
                onRemove={remove}
              />
            ))}

            <Link
              href="/veiculos/novo"
              className={styles.addVehicleCard}
            >
              <span>＋</span>
              <b>Adicionar veículo</b>
              <small>
                Preencha manualmente ou importe o CRLV
              </small>
            </Link>
          </div>
        )}
      </main>
    </Shell>
  );
}