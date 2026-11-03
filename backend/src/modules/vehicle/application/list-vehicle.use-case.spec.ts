import { InMemoryVehicleRepository } from '../testing/in-memory-vehicle.repository';
import { ListVehiclesUseCase } from './list-vehicles.use-case';

describe('ListVehiclesUseCase', () => {
  it('lista somente os veículos do usuário, do mais recente ao mais antigo', async () => {
    const repo = new InMemoryVehicleRepository();
    await repo.create('user-1', { brand: 'A', model: 'Primeiro', year: 2020 });
    await repo.create('user-2', { brand: 'B', model: 'Alheio', year: 2020 });
    await repo.create('user-1', { brand: 'C', model: 'Segundo', year: 2021 });

    const result = await new ListVehiclesUseCase(repo).execute('user-1');

    expect(result.map((v) => v.model)).toEqual(['Segundo', 'Primeiro']);
  });
});