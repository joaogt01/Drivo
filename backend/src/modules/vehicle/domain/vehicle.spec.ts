import { normalizeVehicleDraft } from './vehicle';

describe('normalizeVehicleDraft', () => {
  it('aplica trim em textos e caixa alta em placa e chassi', () => {
    expect(
      normalizeVehicleDraft({
        brand: ' Toyota ',
        model: ' Corolla ',
        plate: ' abc1d23 ',
        chassis: ' abcdefghijklmnopq ',
        color: ' Prata ',
      }),
    ).toEqual({
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC1D23',
      chassis: 'ABCDEFGHIJKLMNOPQ',
      color: 'Prata',
    });
  });

  it('descarta campos undefined para não sobrescrever no update', () => {
    const result = normalizeVehicleDraft({ brand: ' Honda ', plate: undefined });

    expect(result).toEqual({ brand: 'Honda' });
    expect('plate' in result).toBe(false);
  });

  it('preserva null, que permite limpar um campo', () => {
    expect(normalizeVehicleDraft({ color: null })).toEqual({ color: null });
  });

  it('não altera números nem muta o objeto original', () => {
    const input = { brand: ' Fiat ', year: 2020 };

    expect(normalizeVehicleDraft(input)).toEqual({ brand: 'Fiat', year: 2020 });
    expect(input.brand).toBe(' Fiat ');
  });
});