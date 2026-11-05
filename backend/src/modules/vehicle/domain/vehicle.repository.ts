import { Vehicle, VehicleDraft } from './vehicle';

export type NewVehicle = VehicleDraft &
  Required<Pick<VehicleDraft, 'brand' | 'model' | 'year'>>;

/**
 * Porta de persistência. Classe abstrata para servir
 * de token de injeção do Nest sem precisar de @Inject('...').
 */
export abstract class VehicleRepository {
  abstract create(ownerId: string, data: NewVehicle): Promise<Vehicle>;
  abstract findAllByOwner(ownerId: string): Promise<Vehicle[]>;
  abstract findByIdAndOwner(
    id: string,
    ownerId: string,
  ): Promise<Vehicle | null>;
  abstract update(id: string, data: VehicleDraft): Promise<Vehicle>;
  abstract delete(id: string): Promise<void>;
}