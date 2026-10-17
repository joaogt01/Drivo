import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  const dadosValidos = {
    email: 'joao@example.com',
    password: 'senha-segura-123',
  };

  async function validar(dados: object) {
    return validate(plainToInstance(LoginDto, dados));
  }

  it('aceita credenciais válidas', async () => {
    expect(await validar(dadosValidos)).toHaveLength(0);
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

  it('rejeita senha vazia', async () => {
    const erros = await validar({
      ...dadosValidos,
      password: '',
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

  it('rejeita senha que não seja texto', async () => {
    const erros = await validar({
      ...dadosValidos,
      password: 123456,
    });

    expect(erros.some((erro) => erro.property === 'password')).toBe(true);
  });
});
