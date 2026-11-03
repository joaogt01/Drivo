import { Injectable } from '@nestjs/common';
import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class GetVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(ownerId: string, id: string) {
    const vehicle = await this.vehicles.findByIdAndOwner(id, ownerId);
    if (!vehicle) throw new VehicleNotFoundError();
    return vehicle;
  }
}