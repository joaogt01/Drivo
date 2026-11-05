import { Injectable } from '@nestjs/common';
import { normalizeVehicleDraft, VehicleDraft } from '../domain/vehicle';
import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(ownerId: string, id: string, input: VehicleDraft) {
    const current = await this.vehicles.findByIdAndOwner(id, ownerId);
    if (!current) throw new VehicleNotFoundError();

    return this.vehicles.update(id, normalizeVehicleDraft(input));
  }
}