import { jest } from '@jest/globals';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { VehicleConflictError } from '../domain/vehicle.errors';
import { PrismaVehicleRepository } from './prisma-vehicle.repository';

describe('PrismaVehicleRepository', () => {
  const prisma = {
    vehicle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  let repository: PrismaVehicleRepository;

  const uniqueViolation = () =>
    new Prisma.PrismaClientKnownRequestError('unique', {
      code: 'P2002',
      clientVersion: 'test',
    });

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaVehicleRepository(
      prisma as unknown as PrismaService,
    );
  });

  it('cria vinculando o veículo ao dono', async () => {
    prisma.vehicle.create.mockResolvedValue({ id: 'vehicle-1' });

    await repository.create('user-1', { brand: 'Toyota', model: 'Corolla', year: 2022 });

    expect(prisma.vehicle.create).toHaveBeenCalledWith({
      data: { brand: 'Toyota', model: 'Corolla', year: 2022, userId: 'user-1' },
    });
  });

  it('lista só os veículos do dono, do mais recente ao mais antigo', async () => {
    prisma.vehicle.findMany.mockResolvedValue([]);

    await repository.findAllByOwner('user-1');

    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('busca por id restringindo ao dono', async () => {
    prisma.vehicle.findFirst.mockResolvedValue(null);

    await repository.findByIdAndOwner('vehicle-1', 'user-2');

    expect(prisma.vehicle.findFirst).toHaveBeenCalledWith({
      where: { id: 'vehicle-1', userId: 'user-2' },
    });
  });

  it('traduz P2002 em VehicleConflictError ao criar', async () => {
    prisma.vehicle.create.mockRejectedValue(uniqueViolation());

    await expect(
      repository.create('user-1', { brand: 'A', model: 'B', year: 2020 }),
    ).rejects.toBeInstanceOf(VehicleConflictError);
  });

  it('traduz P2002 em VehicleConflictError ao atualizar', async () => {
    prisma.vehicle.update.mockRejectedValue(uniqueViolation());

    await expect(repository.update('vehicle-1', { plate: 'ABC1D23' })).rejects.toBeInstanceOf(
      VehicleConflictError,
    );
  });

  it('repassa erros que não são de unicidade', async () => {
    const boom = new Error('conexão perdida');
    prisma.vehicle.create.mockRejectedValue(boom);

    await expect(
      repository.create('user-1', { brand: 'A', model: 'B', year: 2020 }),
    ).rejects.toBe(boom);
  });
});