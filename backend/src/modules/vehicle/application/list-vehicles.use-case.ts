import { Injectable } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class ListVehiclesUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  execute(ownerId: string) {
    return this.vehicles.findAllByOwner(ownerId);
  }
}