import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { InMemoryVehicleRepository } from '../testing/in-memory-vehicle.repository';
import { GetVehicleUseCase } from './get-vehicle.use-case';

describe('GetVehicleUseCase', () => {
  it('retorna o veículo pertencente ao usuário', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'A', model: 'B', year: 2020 });

    await expect(new GetVehicleUseCase(repo).execute('user-1', created.id)).resolves.toEqual(created);
  });

  it('não encontra veículo de outro usuário', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'A', model: 'B', year: 2020 });

    await expect(new GetVehicleUseCase(repo).execute('user-2', created.id)).rejects.toBeInstanceOf(
      VehicleNotFoundError,
    );
  });
});