import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateVehicleDto } from './create-vehicle.dto';

describe('CreateVehicleDto', () => {
  const dadosValidos = {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    modelYear: 2023,
    plate: 'ABC1D23',
    renavam: '12345678901',
    chassis: 'ABCDEFGHIJKLMNOPQ',
    color: 'Prata',
    fuel: 'Flex',
    vehicleType: 'Automóvel',
    nickname: 'Meu carro',
  };

  async function validar(dados: object) {
    return validate(plainToInstance(CreateVehicleDto, dados));
  }

  it('aceita um veículo com todos os dados válidos', async () => {
    expect(await validar(dadosValidos)).toHaveLength(0);
  });

  it('aceita os campos opcionais ausentes', async () => {
    const { modelYear, plate, renavam, chassis, color, fuel, vehicleType, nickname, ...basicos } =
      dadosValidos;

    expect(await validar(basicos)).toHaveLength(0);
  });

  it('rejeita marca vazia', async () => {
    const erros = await validar({ ...dadosValidos, brand: '' });
    expect(erros.some((erro) => erro.property === 'brand')).toBe(true);
  });

  it('rejeita modelo acima de 100 caracteres', async () => {
    const erros = await validar({ ...dadosValidos, model: 'A'.repeat(101) });
    expect(erros.some((erro) => erro.property === 'model')).toBe(true);
  });

  it('rejeita ano anterior a 1900', async () => {
    const erros = await validar({ ...dadosValidos, year: 1899 });
    expect(erros.some((erro) => erro.property === 'year')).toBe(true);
  });

  it('rejeita ano futuro além do limite permitido', async () => {
    const erros = await validar({
      ...dadosValidos,
      year: new Date().getFullYear() + 2,
    });
    expect(erros.some((erro) => erro.property === 'year')).toBe(true);
  });

  it('rejeita placa fora do formato Mercosul esperado', async () => {
    const erros = await validar({ ...dadosValidos, plate: 'PLACA-INVALIDA' });
    expect(erros.some((erro) => erro.property === 'plate')).toBe(true);
  });

  it('rejeita RENAVAM que não tenha 11 dígitos', async () => {
    const erros = await validar({ ...dadosValidos, renavam: '12345' });
    expect(erros.some((erro) => erro.property === 'renavam')).toBe(true);
  });

  it('rejeita chassi com tamanho diferente de 17 caracteres', async () => {
    const erros = await validar({ ...dadosValidos, chassis: 'CHASSI123' });
    expect(erros.some((erro) => erro.property === 'chassis')).toBe(true);
  });

  it('rejeita ano como texto', async () => {
    const erros = await validar({ ...dadosValidos, year: '2022' });
    expect(erros.some((erro) => erro.property === 'year')).toBe(true);
  });
});
