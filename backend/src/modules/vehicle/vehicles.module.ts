import { Module } from '@nestjs/common';
import { CreateVehicleUseCase } from './application/create-vehicle.use-case';
import { DeleteVehicleUseCase } from './application/delete-vehicle.use-case';
import { GetVehicleUseCase } from './application/get-vehicle.use-case';
import { ListVehiclesUseCase } from './application/list-vehicles.use-case';
import { UpdateVehicleUseCase } from './application/update-vehicle.use-case';
import { VehicleRepository } from './domain/vehicle.repository';
import { PrismaVehicleRepository } from './infrastructure/prisma-vehicle.repository';
import { VehiclesController } from './presentation/vehicles.controller';

@Module({
  controllers: [VehiclesController],
  providers: [
    { provide: VehicleRepository, useClass: PrismaVehicleRepository },
    CreateVehicleUseCase,
    ListVehiclesUseCase,
    GetVehicleUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
  ],
})
export class VehiclesModule {}