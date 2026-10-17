import { jest } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  const prisma = {
    vehicle: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  let service: VehiclesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VehiclesService(
      prisma as unknown as PrismaService,
    );
  });

  describe('create', () => {
    it('cadastra veículo vinculado ao usuário e normaliza os campos', async () => {
      prisma.vehicle.create.mockResolvedValue({
        id: 'vehicle-1',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'ABC1D23',
        userId: 'user-1',
      });

      await service.create('user-1', {
        brand: ' Toyota ',
        model: ' Corolla ',
        year: 2022,
        plate: ' abc1d23 ',
        chassis: ' abcdefghijklmnopq ',
      });

      expect(prisma.vehicle.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          plate: 'ABC1D23',
          chassis: 'ABCDEFGHIJKLMNOPQ',
          userId: 'user-1',
        }),
      });
    });
  });

  describe('findAll', () => {
    it('lista somente os veículos do usuário, do mais recente ao mais antigo', async () => {
      prisma.vehicle.findMany.mockResolvedValue([]);

      await service.findAll('user-1');

      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('retorna o veículo pertencente ao usuário', async () => {
      const vehicle = { id: 'vehicle-1', userId: 'user-1' };
      prisma.vehicle.findFirst.mockResolvedValue(vehicle);

      await expect(
        service.findOne('user-1', 'vehicle-1'),
      ).resolves.toEqual(vehicle);

      expect(prisma.vehicle.findFirst).toHaveBeenCalledWith({
        where: { id: 'vehicle-1', userId: 'user-1' },
      });
    });

    it('não encontra veículo de outro usuário', async () => {
      prisma.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne('user-2', 'vehicle-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('atualiza veículo após confirmar sua propriedade', async () => {
      prisma.vehicle.findFirst.mockResolvedValue({
        id: 'vehicle-1',
        userId: 'user-1',
      });
      prisma.vehicle.update.mockResolvedValue({
        id: 'vehicle-1',
        brand: 'Honda',
      });

      await service.update('user-1', 'vehicle-1', {
        brand: ' Honda ',
      });

      expect(prisma.vehicle.update).toHaveBeenCalledWith({
        where: { id: 'vehicle-1' },
        data: { brand: 'Honda' },
      });
    });

    it('não atualiza veículo de outro usuário', async () => {
      prisma.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.update('user-2', 'vehicle-1', {
          brand: 'Honda',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.vehicle.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('exclui veículo pertencente ao usuário', async () => {
      prisma.vehicle.findFirst.mockResolvedValue({
        id: 'vehicle-1',
        userId: 'user-1',
      });
      prisma.vehicle.delete.mockResolvedValue({ id: 'vehicle-1' });

      await expect(
        service.remove('user-1', 'vehicle-1'),
      ).resolves.toEqual({
        message: 'Veículo excluído com sucesso.',
      });

      expect(prisma.vehicle.delete).toHaveBeenCalledWith({
        where: { id: 'vehicle-1' },
      });
    });

    it('não exclui veículo de outro usuário', async () => {
      prisma.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('user-2', 'vehicle-1'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(prisma.vehicle.delete).not.toHaveBeenCalled();
    });
  });
});
