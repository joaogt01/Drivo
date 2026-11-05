import { VehicleNotFoundError } from '../domain/vehicle.errors';
import { InMemoryVehicleRepository } from '../testing/in-memory-vehicle.repository';
import { UpdateVehicleUseCase } from './update-vehicle.use-case';

describe('UpdateVehicleUseCase', () => {
  it('atualiza o veículo após confirmar a propriedade e normaliza', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'Toyota', model: 'Corolla', year: 2022 });

    const updated = await new UpdateVehicleUseCase(repo).execute('user-1', created.id, {
      brand: ' Honda ',
    });

    expect(updated.brand).toBe('Honda');
    expect(updated.model).toBe('Corolla');
  });

  it('permite limpar um campo opcional com null', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'A', model: 'B', year: 2020, color: 'Prata' });

    const updated = await new UpdateVehicleUseCase(repo).execute('user-1', created.id, { color: null });

    expect(updated.color).toBeNull();
  });

  it('não atualiza veículo de outro usuário', async () => {
    const repo = new InMemoryVehicleRepository();
    const created = await repo.create('user-1', { brand: 'Toyota', model: 'Corolla', year: 2022 });

    await expect(
      new UpdateVehicleUseCase(repo).execute('user-2', created.id, { brand: 'Honda' }),
    ).rejects.toBeInstanceOf(VehicleNotFoundError);
    expect(repo.items[0].brand).toBe('Toyota');
  });
});