import { Vehicle, VehicleDraft } from '../domain/vehicle';
import { NewVehicle, VehicleRepository } from '../domain/vehicle.repository';

/** Fake usado só nos testes. Substitui o mock do Prisma. */
export class InMemoryVehicleRepository extends VehicleRepository {
  items: Vehicle[] = [];
  private sequence = 0;

  async create(ownerId: string, data: NewVehicle): Promise<Vehicle> {
    const now = new Date(++this.sequence * 1000);
    const vehicle: Vehicle = {
      id: `vehicle-${this.sequence}`,
      userId: ownerId,
      modelYear: null,
      plate: null,
      renavam: null,
      chassis: null,
      color: null,
      fuel: null,
      vehicleType: null,
      nickname: null,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(vehicle);
    return vehicle;
  }

  async findAllByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.items
      .filter((v) => v.userId === ownerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByIdAndOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    return this.items.find((v) => v.id === id && v.userId === ownerId) ?? null;
  }

  async update(id: string, data: VehicleDraft): Promise<Vehicle> {
    const index = this.items.findIndex((v) => v.id === id);
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((v) => v.id !== id);
  }
}