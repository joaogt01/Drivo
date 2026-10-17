import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  const dadosValidos = {
    name: 'João Victor',
    email: 'joao@example.com',
    password: 'senha-segura-123',
  };

  async function validar(dados: object) {
    return validate(plainToInstance(RegisterDto, dados));
  }

  it('aceita dados válidos', async () => {
    expect(await validar(dadosValidos)).toHaveLength(0);
  });

  it('rejeita nome com menos de 2 caracteres', async () => {
    const erros = await validar({ ...dadosValidos, name: 'J' });
    expect(erros.some((erro) => erro.property === 'name')).toBe(true);
  });

  it('rejeita nome acima de 100 caracteres', async () => {
    const erros = await validar({
      ...dadosValidos,
      name: 'A'.repeat(101),
    });
    expect(erros.some((erro) => erro.property === 'name')).toBe(true);
  });

  it('rejeita e-mail inválido', async () => {
    const erros = await validar({
      ...dadosValidos,
      email: 'email-invalido',
    });
    expect(erros.some((erro) => erro.property === 'email')).toBe(true);
  });

  it('rejeita e-mail acima de 255 caracteres', async () => {
    const erros = await validar({
      ...dadosValidos,
      email: `${'a'.repeat(250)}@teste.com`,
    });
    expect(erros.some((erro) => erro.property === 'email')).toBe(true);
  });

  it('rejeita senha com menos de 8 caracteres', async () => {
    const erros = await validar({
      ...dadosValidos,
      password: '1234567',
    });
    expect(erros.some((erro) => erro.property === 'password')).toBe(true);
  });

  it('rejeita senha acima de 72 caracteres', async () => {
    const erros = await validar({
      ...dadosValidos,
      password: 'A'.repeat(73),
    });
    expect(erros.some((erro) => erro.property === 'password')).toBe(true);
  });
});
