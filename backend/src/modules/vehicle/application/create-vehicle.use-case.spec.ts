import { InMemoryVehicleRepository } from '../testing/in-memory-vehicle.repository';
import { CreateVehicleUseCase } from './create-vehicle.use-case';

describe('CreateVehicleUseCase', () => {
  it('cadastra veículo vinculado ao usuário e normaliza os campos', async () => {
    const repo = new InMemoryVehicleRepository();

    const vehicle = await new CreateVehicleUseCase(repo).execute('user-1', {
      brand: ' Toyota ',
      model: ' Corolla ',
      year: 2022,
      plate: ' abc1d23 ',
      chassis: ' abcdefghijklmnopq ',
    });

    expect(vehicle).toEqual(
      expect.objectContaining({
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        plate: 'ABC1D23',
        chassis: 'ABCDEFGHIJKLMNOPQ',
        userId: 'user-1',
      }),
    );
    expect(repo.items).toHaveLength(1);
  });
});