import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const vehiclesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const request = {
    user: {
      id: 'user-123',
      email: 'teste@example.com',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: vehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('deve criar um veículo para o usuário autenticado', async () => {
    const dto = { brand: 'Toyota', model: 'Corolla' } as any;
    const vehicle = { id: 'vehicle-123', ...dto };

    vehiclesService.create.mockResolvedValue(vehicle);

    await expect(controller.create(request as any, dto)).resolves.toEqual(vehicle);

    expect(vehiclesService.create).toHaveBeenCalledWith('user-123', dto);
  });

  it('deve listar os veículos do usuário autenticado', async () => {
    const vehicles = [{ id: 'vehicle-123' }];
    vehiclesService.findAll.mockResolvedValue(vehicles);

    await expect(controller.findAll(request as any)).resolves.toEqual(vehicles);

    expect(vehiclesService.findAll).toHaveBeenCalledWith('user-123');
  });

  it('deve buscar um veículo pelo ID', async () => {
    const vehicle = { id: 'vehicle-123' };
    vehiclesService.findOne.mockResolvedValue(vehicle);

    await expect(
      controller.findOne(request as any, 'vehicle-123'),
    ).resolves.toEqual(vehicle);

    expect(vehiclesService.findOne).toHaveBeenCalledWith(
      'user-123',
      'vehicle-123',
    );
  });

  it('deve atualizar um veículo do usuário autenticado', async () => {
    const dto = { color: 'Prata' } as any;
    const vehicle = { id: 'vehicle-123', color: 'Prata' };

    vehiclesService.update.mockResolvedValue(vehicle);

    await expect(
      controller.update(request as any, 'vehicle-123', dto),
    ).resolves.toEqual(vehicle);

    expect(vehiclesService.update).toHaveBeenCalledWith(
      'user-123',
      'vehicle-123',
      dto,
    );
  });

  it('deve remover um veículo pelo ID', async () => {
    const result = { id: 'vehicle-123' };
    vehiclesService.remove.mockResolvedValue(result);

    await expect(
      controller.remove(request as any, 'vehicle-123'),
    ).resolves.toEqual(result);

    expect(vehiclesService.remove).toHaveBeenCalledWith(
      'user-123',
      'vehicle-123',
    );
  });
});
