import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CreateVehicleUseCase } from '../application/create-vehicle.use-case';
import { DeleteVehicleUseCase } from '../application/delete-vehicle.use-case';
import { GetVehicleUseCase } from '../application/get-vehicle.use-case';
import { ListVehiclesUseCase } from '../application/list-vehicles.use-case';
import { UpdateVehicleUseCase } from '../application/update-vehicle.use-case';
import { VehiclesController } from './vehicles.controller';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const createVehicle = { execute: jest.fn() };
  const listVehicles = { execute: jest.fn() };
  const getVehicle = { execute: jest.fn() };
  const updateVehicle = { execute: jest.fn() };
  const deleteVehicle = { execute: jest.fn() };

  const request = { user: { id: 'user-123', email: 'teste@example.com' } };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        { provide: CreateVehicleUseCase, useValue: createVehicle },
        { provide: ListVehiclesUseCase, useValue: listVehicles },
        { provide: GetVehicleUseCase, useValue: getVehicle },
        { provide: UpdateVehicleUseCase, useValue: updateVehicle },
        { provide: DeleteVehicleUseCase, useValue: deleteVehicle },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(VehiclesController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('cria um veículo para o usuário autenticado', async () => {
    const dto = { brand: 'Toyota', model: 'Corolla', year: 2022 } as any;
    createVehicle.execute.mockResolvedValue({ id: 'vehicle-123', ...dto });

    await expect(controller.create(request as any, dto)).resolves.toEqual({
      id: 'vehicle-123',
      ...dto,
    });
    expect(createVehicle.execute).toHaveBeenCalledWith('user-123', dto);
  });

  it('lista os veículos do usuário autenticado', async () => {
    listVehicles.execute.mockResolvedValue([{ id: 'vehicle-123' }]);

    await expect(controller.findAll(request as any)).resolves.toEqual([{ id: 'vehicle-123' }]);
    expect(listVehicles.execute).toHaveBeenCalledWith('user-123');
  });

  it('busca um veículo pelo ID', async () => {
    getVehicle.execute.mockResolvedValue({ id: 'vehicle-123' });

    await expect(controller.findOne(request as any, 'vehicle-123')).resolves.toEqual({
      id: 'vehicle-123',
    });
    expect(getVehicle.execute).toHaveBeenCalledWith('user-123', 'vehicle-123');
  });

  it('atualiza um veículo do usuário autenticado', async () => {
    const dto = { color: 'Prata' } as any;
    updateVehicle.execute.mockResolvedValue({ id: 'vehicle-123', color: 'Prata' });

    await expect(controller.update(request as any, 'vehicle-123', dto)).resolves.toEqual({
      id: 'vehicle-123',
      color: 'Prata',
    });
    expect(updateVehicle.execute).toHaveBeenCalledWith('user-123', 'vehicle-123', dto);
  });

  it('remove o veículo e mantém a mensagem de resposta da API', async () => {
    deleteVehicle.execute.mockResolvedValue(undefined);

    await expect(controller.remove(request as any, 'vehicle-123')).resolves.toEqual({
      message: 'Veículo excluído com sucesso.',
    });
    expect(deleteVehicle.execute).toHaveBeenCalledWith('user-123', 'vehicle-123');
  });
});