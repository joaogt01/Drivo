
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

type VehicleData = {
  brand?: string;
  model?: string;
  year?: number;
  modelYear?: number | null;
  plate?: string | null;
  renavam?: string | null;
  chassis?: string | null;
  color?: string | null;
  fuel?: string | null;
  vehicleType?: string | null;
  nickname?: string | null;
};

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateVehicleDto) {
    const data = this.normalizeVehicleData(dto);

    try {
      return await this.prisma.vehicle.create({
        data: {
          brand: data.brand!,
          model: data.model!,
          year: data.year!,
          modelYear: data.modelYear,
          plate: data.plate,
          renavam: data.renavam,
          chassis: data.chassis,
          color: data.color,
          fuel: data.fuel,
          vehicleType: data.vehicleType,
          nickname: data.nickname,
          userId,
        },
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado.');
    }

    return vehicle;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateVehicleDto,
  ) {
    await this.findOne(userId, id);

    const data = this.normalizeVehicleData(dto);

    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.vehicle.delete({
      where: { id },
    });

    return {
      message: 'Veículo excluído com sucesso.',
    };
  }

  private normalizeVehicleData(
    dto: CreateVehicleDto | UpdateVehicleDto,
  ): VehicleData {
    const data: VehicleData = {};

    if (dto.brand !== undefined) {
      data.brand = dto.brand.trim();
    }

    if (dto.model !== undefined) {
      data.model = dto.model.trim();
    }

    if (dto.year !== undefined) {
      data.year = dto.year;
    }

    if (dto.modelYear !== undefined) {
      data.modelYear = dto.modelYear;
    }

    if (dto.plate !== undefined) {
      data.plate = dto.plate.trim().toUpperCase();
    }

    if (dto.renavam !== undefined) {
      data.renavam = dto.renavam.trim();
    }

    if (dto.chassis !== undefined) {
      data.chassis = dto.chassis.trim().toUpperCase();
    }

    if (dto.color !== undefined) {
      data.color = dto.color.trim();
    }

    if (dto.fuel !== undefined) {
      data.fuel = dto.fuel.trim();
    }

    if (dto.vehicleType !== undefined) {
      data.vehicleType = dto.vehicleType.trim();
    }

    if (dto.nickname !== undefined) {
      data.nickname = dto.nickname.trim();
    }

    return data;
  }

  private handleDatabaseError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'A placa, o Renavam ou o chassi informado já está cadastrado.',
      );
    }

    throw error;
  }
}
