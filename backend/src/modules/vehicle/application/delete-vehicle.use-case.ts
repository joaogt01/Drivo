import { Injectable } from '@nestjs/common';
import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(ownerId: string, id: string): Promise<void> {
    const current = await this.vehicles.findByIdAndOwner(id, ownerId);
    if (!current) throw new VehicleNotFoundError();

    await this.vehicles.delete(id);
  }
}