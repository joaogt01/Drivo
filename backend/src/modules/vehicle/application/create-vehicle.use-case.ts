import { Injectable } from '@nestjs/common';
import { normalizeVehicleDraft } from '../domain/vehicle';
import { NewVehicle, VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  execute(ownerId: string, input: NewVehicle) {
    return this.vehicles.create(ownerId, normalizeVehicleDraft(input));
  }
}