
import Link from 'next/link';
import type { Vehicle } from '../../../lib/api';
import styles from './VehicleCard.module.css';

type VehicleCardProps = {
  vehicle: Vehicle;
  image: string;
  onRemove: (id: string) => void;
};

export default function VehicleCard({
  vehicle,
  image,
  onRemove,
}: VehicleCardProps) {
  return (
    <article className={styles.vehicleCard}>
      <Link
        href={`/veiculos/${vehicle.id}`}
        className={styles.vehicleImageLink}
      >
        <img
          src={image}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
      </Link>

      <div className={styles.vehicleInfo}>
        <div className={styles.vehicleMake}>
          {vehicle.brand}
        </div>

        <div className={styles.vehicleNameRow}>
          <div>
            <h2>{vehicle.model}</h2>

            <p className={styles.vehicleMeta}>
              <span className={styles.metaDot} />
              {vehicle.color || 'Cor não informada'}
              {' · '}
              {vehicle.year}
              {vehicle.modelYear
                ? `/${vehicle.modelYear}`
                : ''}
              {' · '}
              {vehicle.fuel || 'Combustível não informado'}
            </p>
          </div>

          <span className={styles.plate}>
            <small>BRASIL</small>
            <b>{vehicle.plate || 'SEM PLACA'}</b>
          </span>
        </div>

        <div className={styles.vehicleData}>
          <div>
            <span>RENAVAM</span>
            <code>{vehicle.renavam || '—'}</code>
          </div>

          <div>
            <span>CHASSI</span>
            <code>{vehicle.chassis || '—'}</code>
          </div>

          <Link
            href={`/veiculos/${vehicle.id}`}
            className={styles.vehicleOpen}
            aria-label={`Editar ${vehicle.model}`}
          >
            →
          </Link>
        </div>

        <button
          type="button"
          className={styles.textAction}
          onClick={() => onRemove(vehicle.id)}
        >
          Excluir veículo
        </button>
      </div>
    </article>
  );
}
