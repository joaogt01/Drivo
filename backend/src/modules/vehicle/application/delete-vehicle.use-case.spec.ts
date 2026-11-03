import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { InMemoryVehicleRepository } from '../testing/in-memory-vehicle.repository';
import { DeleteVehicleUseCase } from './delete-vehicle.use-case';

describe('DeleteVehicleUseCase', () => {
  it('exclui veículo pertencente ao usuário', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'A', model: 'B', year: 2020 });

    await new DeleteVehicleUseCase(repo).execute('user-1', created.id);

    expect(repo.items).toHaveLength(0);
  });

  it('não exclui veículo de outro usuário', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'A', model: 'B', year: 2020 });

    await expect(new DeleteVehicleUseCase(repo).execute('user-2', created.id)).rejects.toBeInstanceOf(
      VehicleNotFoundError,
    );
    expect(repo.items).toHaveLength(1);
  });
});