import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Vehicle, VehicleDraft } from '../domain/vehicle';
import { VehicleConflictError } from '../domain/vehicle.errors';
import { NewVehicle, VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class PrismaVehicleRepository extends VehicleRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(ownerId: string, data: NewVehicle): Promise<Vehicle> {
    return this.translateConflict(() =>
      this.prisma.vehicle.create({ data: { ...data, userId: ownerId } }),
    );
  }

  findAllByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.prisma.vehicle.findMany({
      where: { userId: ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByIdAndOwner(id: string, ownerId: string): Promise<Vehicle | null> {
    return this.prisma.vehicle.findFirst({ where: { id, userId: ownerId } });
  }

  update(id: string, data: VehicleDraft): Promise<Vehicle> {
    return this.translateConflict(() =>
      this.prisma.vehicle.update({ where: { id }, data }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({ where: { id } });
  }

  /** P2002 (violação de unicidade) é detalhe do Prisma: vira erro de domínio. */
  private async translateConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new VehicleConflictError();
      }
      throw error;
    }
  }
}